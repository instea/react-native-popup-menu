import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import AnimatedView from './AnimatedView';
import makeMenuRegistry from './menuRegistry';
import Backdrop from './Backdrop';
import { measure, computeBestMenuPosition } from './helpers';
import { debug } from './logger.js';

const defaultOptionsContainerRenderer = options => options;
const layoutsEqual = (a, b) => (
  a === b || (a && b && a.width === b.width && a.height === b.height)
);

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
  }

  closeMenu() {
    debug('close menu');
    this._menuRegistry.getAll().forEach(menu => {
      menu.instance._getOpened() && menu.instance._setOpened(false);
    });
    this._notify();
  }

  toggleMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      return console.warn(`menu with name ${name} does not exist`);
    }
    debug('toggle menu', name);
    menu.instance._setOpened(!menu.instance._getOpened());
    this._notify();
  }

  _notify() {
    const NULL = {};
    const prev = this.state.openedMenu || NULL;
    const next = this._menuRegistry.getAll().find(menu => menu.instance._isOpen()) || NULL;
    if (prev === next) {
      return debug('notify: skipping - no update needed');
    }
    debug('notify: next menu:', next.name);
    let afterSetState = undefined;
    if (prev.name !== next.name) {
      prev.instance && prev.instance.props.onClose();
      if (next.name) {
        next.instance.props.onOpen();
        afterSetState = () => this._initOpen(next);
      }
    }
    this.setState({ openedMenu: next === NULL ? undefined : next }, afterSetState);
  }

  render() {
    const shouldRenderMenu = this.isMenuOpen() && this._isInitialized();
    debug('render menu', this.isMenuOpen(), this._ownLayout);
    return (
      <View style={{flex:1}} onLayout={e => this._onLayout(e)}>
        <View style={this.props.style}>
          { this.props.children }
        </View>
        {shouldRenderMenu &&
          <Backdrop onPress={() => this._onBackdropPress()} />
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
    const trigger = menu.instance._getTrigger();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements', triggerLayout);
      this._menuRegistry.updateLayoutInfo(menu.name, { triggerLayout });
      this._notify();
    });
  }

  _onOptionsLayout(e, name) {
    debug('got options layout', e.nativeEvent.layout);
    this._menuRegistry.updateLayoutInfo(name, { optionsLayout: e.nativeEvent.layout });
    this._notify();
  }

  _makeOptions({ instance, triggerLayout, optionsLayout }) {
    const options = instance._getOptions();
    const name = instance.getName();
    const windowLayout = this._ownLayout;
    const { top, left, isVisible } = computeBestMenuPosition(windowLayout, triggerLayout, optionsLayout);
    debug('got best size', { windowLayout, triggerLayout, optionsLayout }, { top, left, isVisible });
    const MenuComponent = isVisible ? AnimatedView : View;
    const { optionsContainerStyle, renderOptionsContainer } = options.props;
    const style = [ styles.optionsContainer, optionsContainerStyle, { top, left } ];
    const renderer = renderOptionsContainer || defaultOptionsContainerRenderer;
    const onLayout = e => this._onOptionsLayout(e, name);
    const ref = 'menu-options';
    const collapsable = false;
    return React.createElement(MenuComponent, { style, onLayout, ref, collapsable }, renderer(options));
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
      this._notify();
    });
  }

}

MenuContext.childContextTypes = {
  menuRegistry: React.PropTypes.object,
  menuActions: React.PropTypes.object,
};

const styles = StyleSheet.create({
  optionsContainer: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: 200,

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});
