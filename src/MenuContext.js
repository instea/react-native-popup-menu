import React, { Component } from 'react';
import { View } from 'react-native';
import makeMenuRegistry from './menuRegistry';
import Backdrop from './Backdrop';
import { measure } from './helpers';
import { debug } from './logger.js';
import MenuOutside from './renderers/MenuOutside';

const defaultOptionsContainerRenderer = options => options;
const layoutsEqual = (a, b) => (
  a === b || (a && b && a.width === b.width && a.height === b.height)
);

const isFunctional = Component => !Component.prototype.render;

export default class MenuContext extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this._menuRegistry = makeMenuRegistry();
  }

  getChildContext() {
    const menuActions = {
      openMenu: name => this.openMenu(name),
      closeMenu: () => this.closeMenu(),
      toggleMenu: name => this.toggleMenu(name),
      isMenuOpen: () => this.isMenuOpen(),
      _notify: () => this._notify()
    };
    const menuRegistry = this._menuRegistry;
    return { menuRegistry, menuActions };
  }

  isMenuOpen() {
    return !!this.state.openedMenu;
  }

  openMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      return console.warn(`menu with name ${name} does not exist`);
    }
    debug('open menu', name);
    menu.instance._setOpened(true);
    this._notify();
    return Promise.resolve();
  }

  closeMenu() {
    debug('close menu');
    const hideMenu = (this.refs.menuOptions
      && this.refs.menuOptions.close
      && this.refs.menuOptions.close()) || Promise.resolve();
    const hideBackdrop = this.refs.backdrop && this.refs.backdrop.close();
    const closePromise = Promise.all([hideMenu, hideBackdrop]);
    return closePromise.then(() => {
      this._menuRegistry.getAll().forEach(menu => {
        if (menu.instance._getOpened()) {
          menu.instance._setOpened(false);
          // invalidate trigger layout
          this._menuRegistry.updateLayoutInfo(menu.name, { triggerLayout: undefined });
        }
      });
      this._notify();
    }).catch(console.error);
  }

  toggleMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      return console.warn(`menu with name ${name} does not exist`);
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
      return;
    }
    debug('notify: next menu:', next.name, ' prev menu:', prev.name);
    let afterSetState = undefined;
    if (prev.name !== next.name) {
      prev.instance && prev.instance.props.onClose();
      if (next.name) {
        next.instance.props.onOpen();
        afterSetState = () => this._initOpen(next);
      }
    }
    this.setState({ openedMenu: this.openedMenu }, afterSetState);
    debug('notify ended');
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
    const shouldRenderMenu = this.isMenuOpen() && this._isInitialized();
    debug('render menu', this.isMenuOpen(), this._ownLayout);
    return (
      <View style={{flex:1}} onLayout={e => this._onLayout(e)}>
        <View style={[{flex:1}, customStyles.menuContextWrapper, style]}>
          { this.props.children }
        </View>
        {shouldRenderMenu &&
          <Backdrop onPress={() => this._onBackdropPress()} style={customStyles.backdrop} ref='backdrop' />
        }
        {shouldRenderMenu &&
          this._makeOptions(this.state.openedMenu)
        }
      </View>
    );
  }

  _onBackdropPress() {
    debug('on backdrop press');
    this.state.openedMenu.instance.props.onBackdropPress();
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

  _makeOptions({ instance, triggerLayout, optionsLayout }) {
    const options = instance._getOptions();
    const { renderer } = instance.props;
    const windowLayout = this._ownLayout;
    const { optionsContainerStyle, renderOptionsContainer, customStyles } = options.props;
    const optionsRenderer = renderOptionsContainer || defaultOptionsContainerRenderer;
    const isOutside = !triggerLayout || !optionsLayout;
    const onLayout = e => this._onOptionsLayout(e, instance.getName(), isOutside);
    const style = [optionsContainerStyle, customStyles.optionsContainer];
    const layouts = { windowLayout, triggerLayout, optionsLayout };
    const props = { style, onLayout, layouts };
    const optionsType = isOutside ? MenuOutside : renderer;
    if (!isFunctional(optionsType)) {
      props.ref = 'menuOptions';
    }
    return React.createElement(optionsType, props, optionsRenderer(options));
  }

  _onLayout({ nativeEvent: { layout } }) {
    if (layoutsEqual(this._ownLayout, layout)) {
      return;
    }
    this._ownLayout = layout;
    debug('context layout has changed', this._ownLayout);
    if (!this.isMenuOpen()) {
      return;
    }
    const { instance } = this.state.openedMenu;
    const trigger = instance._getTrigger();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements after context layout change', triggerLayout);
      this._menuRegistry.updateLayoutInfo(instance.getName(), { triggerLayout });
      // force update as own layout has changed
      this._notify(true);
    });
  }

}

MenuContext.propTypes = {
  customStyles: React.PropTypes.object,
}

MenuContext.defaultProps = {
  customStyles: {},
};

MenuContext.childContextTypes = {
  menuRegistry: React.PropTypes.object,
  menuActions: React.PropTypes.object,
};
