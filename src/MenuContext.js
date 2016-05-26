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
      rerender: () => this.rerender()
    };
    const menuRegistry = this._menuRegistry;
    return { menuRegistry, menuActions };
  }

  isMenuOpen() {
    return this._menuRegistry.getAll().some(m => m.instance.isOpen());
  }

  openMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      return console.warn(`menu with name ${name} does not exist`);
    }
    debug('open menu', name);
    const { trigger } = menu.instance._getMenuData();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements', triggerLayout);
      menu.instance._open();
      this._menuRegistry.updateLayoutInfo(name, { triggerLayout });
      this.setState({});
    });
  }

  closeMenu() {
    if (!this.isMenuOpen()) {
      return;
    }
    debug('close menu');
    this._menuRegistry.getAll().filter(m => m.instance.isOpen()).forEach(m => {
      m.instance._close();
    });
    this.setState({});
  }

  toggleMenu(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (!menu) {
      return console.warn(`menu with name ${name} does not exist`);
    }
    debug('toggle menu', name);
    menu.instance._toggle();
    this.setState({});
  }

  rerender() {
    return new Promise(resolve => {
      this.setState({}, resolve);
    });
  }

  render() {
    const isMenuOpen = this.isMenuOpen();
    debug('render menu', isMenuOpen, this._ownLayout);
    return (
      <View style={{flex:1}} onLayout={e => this._onLayout(e)}>
        <View style={this.props.style}>
          { this.props.children }
        </View>
        {isMenuOpen && this._isInitialized() &&
          <Backdrop onPress={() => this.closeMenu()} />
        }
        {isMenuOpen && this._isInitialized() &&
          this._makeOptions(this._findOpenedMenu())
        }
      </View>
    );
  }

  _findOpenedMenu() {
    return this._menuRegistry.getAll().find(m => m.instance.isOpen());
  }

  _isInitialized() {
    return !!this._ownLayout;
  }

  _refresh(name) {
    const menu = this._menuRegistry.getMenu(name);
    if (menu && menu.instance.isOpen()) {
      this.setState({});
    }
  }

  _onOptionsLayout(e, name) {
    debug('got options layout', e.nativeEvent.layout);
    this._menuRegistry.updateLayoutInfo(name, { optionsLayout: e.nativeEvent.layout });
    this._refresh(name);
  }

  _makeOptions({ instance, triggerLayout, optionsLayout }) {
    const { options } = instance._getMenuData();
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
    const { instance } = this._findOpenedMenu();
    const { trigger } = instance._getMenuData();
    measure(trigger).then(triggerLayout => {
      debug('got trigger measurements after context layout change', triggerLayout);
      this._menuRegistry.updateLayoutInfo(instance.getName(), { triggerLayout });
      this.setState({});
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
