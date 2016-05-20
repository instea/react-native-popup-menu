import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, View } from 'react-native';
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
      isMenuOpen: () => this.isMenuOpen()
    };
    const menuRegistry = this._menuRegistry;
    return { menuRegistry, menuActions };
  }

  isMenuOpen() {
    return !!this.state.openedMenu;
  }

  openMenu(name) {
    const openedMenu = this._menuRegistry.getMenu(name)
    if (!openedMenu) {
      return console.warn(`menu with name ${name} does not exist`);
    }
    debug('open menu', name);
    measure(openedMenu.trigger).then(triggerLayout => {
      debug('got trigger measurements', triggerLayout);
      openedMenu.events.onOpen();
      this._menuRegistry.updateLayoutInfo(name, { triggerLayout });
      this.setState({ openedMenu: this._menuRegistry.getMenu(name) });
    });
  }

  closeMenu() {
    debug('close menu', this.isMenuOpen(), this.isMenuOpen() && this.state.openedMenu.name);
    this.isMenuOpen() && this.state.openedMenu.events.onClose();
    this.setState({ openedMenu: null });
  }

  toggleMenu(name) {
    debug('toggle menu', name);
    this.isMenuOpen() ? this.closeMenu() : this.openMenu(name);
  }

  render() {
    debug('render menu', this.isMenuOpen(), this._ownLayout);
    return (
      <View style={{flex:1}} onLayout={e => this._onLayout(e)}>
        <View style={this.props.style}>
          { this.props.children }
        </View>
        {this.isMenuOpen() && this._isInitialized() &&
          <Backdrop onPress={() => this.closeMenu()} dimensions={this._ownLayout} />
        }
        {this.isMenuOpen() && this._isInitialized() &&
          this._makeOptions(this.state.openedMenu)
        }
      </View>
    );
  }

  _isInitialized() {
    return !!this._ownLayout;
  }

  _refresh(name) {
    if (this.isMenuOpen() && name === this.state.openedMenu.name) {
      const openedMenu = this._menuRegistry.getMenu(this.state.openedMenu.name);
      this.setState({ openedMenu });
    }
  }

  _onOptionsLayout(e, name) {
    debug('got options layout', e.nativeEvent.layout);
    this._menuRegistry.updateLayoutInfo(name, { optionsLayout: e.nativeEvent.layout });
    this._refresh(name);
  }

  _makeOptions({ options, triggerLayout, optionsLayout, name }) {
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
    const { openedMenu } = this.state;
    measure(openedMenu.trigger).then(triggerLayout => {
      debug('got trigger measurements after context layout change', triggerLayout);
      this._menuRegistry.updateLayoutInfo(openedMenu.name, { triggerLayout });
      this.setState({
        openedMenu: this._menuRegistry.getMenu(openedMenu.name)
      });
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
