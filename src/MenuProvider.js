import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, BackHandler } from 'react-native';
import makeMenuRegistry from './menuRegistry';
import MenuPlaceholder from './MenuPlaceholder';
import { measure } from './helpers';
import { debug } from './logger.js';
import MenuOutside from './renderers/MenuOutside';

const defaultOptionsContainerRenderer = options => options;
const layoutsEqual = (a, b) => (
  a === b || (a && b && a.width === b.width && a.height === b.height)
);

const isFunctional = Component => !Component.prototype.render;

export default class MenuProvider extends Component {

  constructor(props) {
    super(props);
    this._menuRegistry = makeMenuRegistry();
    this._isMenuClosing = false;
  }

  getChildContext() {
    const menuActions = {
      openMenu: name => this.openMenu(name),
      closeMenu: () => this.closeMenu(),
      toggleMenu: name => this.toggleMenu(name),
      isMenuOpen: () => this.isMenuOpen(),
      _getOpenedMenu: () => this._getOpenedMenu(),
      _notify: force => this._notify(force),
    };
    const menuRegistry = this._menuRegistry;
    return { menuRegistry, menuActions };
  }

  _handleBackButton = () => {
    const { backHandler } = this.props;
    debug('_handleBackButton called', backHandler);

    // Default handler if true is passed
    if (backHandler === true) {
      if (this.isMenuOpen()) {
        this.closeMenu();
        return true;
      }
    }

    // Custom handler called with MenuProvider instance id function is passed
    if (typeof backHandler === 'function') {
      return backHandler(this);
    }

    return false;
  }

  componentDidMount() {
    if (BackHandler) {
      BackHandler.addEventListener('hardwareBackPress', this._handleBackButton);
    } else {
      const { backHandler } = this.props;
      if (backHandler === true || typeof backHandler === 'function') {
        console.warn('backHandler prop cannot be used if BackHandler is not present (RN >= 0.44 required)');
      }
    }
    if (this.props.customStyles.menuContextWrapper) {
      console.warn('menuContextWrapper custom style is deprecated and it might be removed in future releases, use menuProviderWrapper instead.');
    }
  }

  componentWillUnmount() {
    debug('unmounting menu provider')
    if (BackHandler) {
      BackHandler.removeEventListener('hardwareBackPress', this._handleBackButton);
    }
  }

  isMenuOpen() {
    return !!this._getOpenedMenu();
  }

  openMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      console.warn(`menu with name ${name} does not exist`);
      return Promise.resolve();
    }
    debug('open menu', name);
    menu.instance._setOpened(true);
    return this._notify();
  }

  closeMenu() { // has no effect on controlled menus
    debug('close menu');
    this._menuRegistry.getAll()
      .filter(menu => menu.instance._getOpened())
      .forEach(menu => menu.instance._setOpened(false));
    return this._notify();
  }

  _invalidateTriggerLayouts() {
    // invalidate layouts for closed menus,
    // both controlled and uncontrolled menus
    this._menuRegistry.getAll()
      .filter(menu => !menu.instance._isOpen())
      .forEach(menu => {
        this._menuRegistry.updateLayoutInfo(menu.name, { triggerLayout: undefined });
      });
  }

  _beforeClose(menu) {
    debug('before close', menu.name);
    const hideMenu = (this.optionsRef
      && this.optionsRef.close
      && this.optionsRef.close()) || Promise.resolve();
    const hideBackdrop = this.backdropRef && this.backdropRef.close();
    this._invalidateTriggerLayouts();
    this._isMenuClosing = true;
    return Promise.all([hideMenu, hideBackdrop])
      .then(() => {
        this._isMenuClosing = false;
      })
      .catch(err => {
        this._isMenuClosing = false;
        throw err;
      })
  }

  toggleMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      console.warn(`menu with name ${name} does not exist`);
      return Promise.resolve();
    }
    debug('toggle menu', name);
    if (menu.instance._getOpened()) {
      return this.closeMenu();
    } else {
      return this.openMenu(name);
    }
  }

  _notify(forceUpdate) {
    const NULL = {};
    const prev = this.openedMenu || NULL;
    const next = this._menuRegistry.getAll().find(menu => menu.instance._isOpen()) || NULL;
    // set newly opened menu before any callbacks are called
    this.openedMenu = next === NULL ? undefined : next;
    if (!forceUpdate && !this._isRenderNeeded(prev, next)) {
      return Promise.resolve();
    }
    debug('notify: next menu:', next.name, ' prev menu:', prev.name);
    let afterSetState = undefined;
    let beforeSetState = () => Promise.resolve();
    if (prev.name !== next.name) {
      if (prev !== NULL && !prev.instance._isOpen()) {
        beforeSetState = () => this._beforeClose(prev)
          .then(() => prev.instance.props.onClose());
      }
      if (next !== NULL) {
        next.instance.props.onOpen();
        afterSetState = () => this._initOpen(next);
      }
    }
    return beforeSetState().then(() => {
      if (!this._placeholderRef) {
        debug('setState ignored - maybe the context was unmounted')
        return
      }
      this._placeholderRef.setState({ openedMenuName: this.openedMenu && this.openedMenu.name }, afterSetState);
      debug('notify ended');
    });
  }

  /**
  Compares states of opened menu to determine if rerender is needed.
  */
  _isRenderNeeded(prev, next) {
    if (prev === next) {
      debug('_isRenderNeeded: skipping - no change');
      return false;
    }
    if (prev.name !== next.name) {
      return true;
    }
    const { triggerLayout, optionsLayout } = next;
    if (!triggerLayout || !optionsLayout) {
      debug('_isRenderNeeded: skipping - no trigger or options layout');
      return false;
    }
    return true;
  }

  render() {
    const { style, customStyles } = this.props;
    debug('render menu', this.isMenuOpen(), this._ownLayout);
    return (
      <View style={{flex:1}} onLayout={this._onLayout}>
        <View style={[
          {flex:1},
          customStyles.menuContextWrapper,
          customStyles.menuProviderWrapper,
          style,
        ]}>
          { this.props.children }
        </View>
        <MenuPlaceholder
          ctx={this}
          backdropStyles={customStyles.backdrop}
          ref={this._onPlaceholderRef}
          />
      </View>
    );
  }

  onBackdropRef = r => {
    this.backdropRef = r;
  }

  onOptionsRef = r => {
    this.optionsRef = r;
  }

  _onPlaceholderRef = r => this._placeholderRef = r;

  _getOpenedMenu() {
    const name = this._placeholderRef && this._placeholderRef.state.openedMenuName;
    return name ? this._menuRegistry.getMenu(name) : undefined;
  }

  _onBackdropPress = () => {
    debug('on backdrop press');
    const menu = this._getOpenedMenu();
    if (menu) {
      menu.instance.props.onBackdropPress();
    }
    
    this.closeMenu();
  }

  _isInitialized() {
    return !!this._ownLayout;
  }

  _initOpen(menu) {
    debug('opening', menu.name);
    const trigger = menu.instance._getTrigger();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements', triggerLayout);
      this._menuRegistry.updateLayoutInfo(menu.name, { triggerLayout });
      this.backdropRef && this.backdropRef.open()
      this._notify();
    });
  }

  _onOptionsLayout(e, name, isOutside) {
    const optionsLayout = e.nativeEvent.layout;
    optionsLayout.isOutside = isOutside;
    debug('got options layout', optionsLayout);
    this._menuRegistry.updateLayoutInfo(name, { optionsLayout });
    this._notify();
  }

  _makeOptions() {
    const { instance, triggerLayout, optionsLayout } = this._getOpenedMenu();
    const options = instance._getOptions();
    const { renderer, rendererProps } = instance.props;
    const windowLayout = this._ownLayout;
    const { optionsContainerStyle, renderOptionsContainer, customStyles } = options.props;
    const optionsRenderer = renderOptionsContainer || defaultOptionsContainerRenderer;
    const isOutside = !triggerLayout || !optionsLayout;
    const onLayout = e => this._onOptionsLayout(e, instance.getName(), isOutside);
    const style = [optionsContainerStyle, customStyles.optionsContainer];
    const layouts = { windowLayout, triggerLayout, optionsLayout };
    const props = { ...rendererProps, style, onLayout, layouts };
    const optionsType = isOutside ? MenuOutside : renderer;
    if (!isFunctional(optionsType)) {
      props.ref = this.onOptionsRef;
    }
    return React.createElement(optionsType, props, optionsRenderer(options));
  }

  _onLayout = ({ nativeEvent: { layout } }) => {
    if (layoutsEqual(this._ownLayout, layout)) {
      return;
    }
    this._ownLayout = layout;
    debug('context layout has changed', this._ownLayout);
    if (!this.isMenuOpen()) {
      return;
    }
    const { instance } = this._getOpenedMenu();
    const trigger = instance._getTrigger();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements after context layout change', triggerLayout);
      this._menuRegistry.updateLayoutInfo(instance.getName(), { triggerLayout });
      // force update as own layout has changed
      this._notify(true);
    });
  }

}

MenuProvider.propTypes = {
  customStyles: PropTypes.object,
  backHandler: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
}

MenuProvider.defaultProps = {
  customStyles: {},
  backHandler: false,
};

MenuProvider.childContextTypes = {
  menuRegistry: PropTypes.object,
  menuActions: PropTypes.object,
};
