import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Dimensions, View } from 'react-native';
import AnimatedView from './AnimatedView';
import makeMenuRegistry from './menuRegistry';
import { measure, computeBestMenuPosition } from './helpers';

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
    measure(openedMenu.trigger).then(triggerLayout => {
      openedMenu.events.onOpen();
      this._menuRegistry.updateLayoutInfo(name, { triggerLayout });
      this.setState({ openedMenu: this._menuRegistry.getMenu(name) });
    });
  }

  closeMenu() {
    this.isMenuOpen() && this.state.openedMenu.events.onClose();
    this.setState({ openedMenu: null });
  }

  toggleMenu(name) {
    this.isMenuOpen() ? this.closeMenu() : this.openMenu(name);
  }

  render() {
    const dimensions = this._getWindowDimensions();
    const { width, height } = dimensions;
    return (
      <View style={{flex:1}} onLayout={e => this._onLayout(e)}>
        <View style={this.props.style}>
          {this.props.children}
        </View>
        {this.isMenuOpen() &&
          <TouchableWithoutFeedback onPress={() => this.closeMenu()} ref='backdrop'>
            <View style={[styles.backdrop, { width, height }]} />
          </TouchableWithoutFeedback>
        }
        {this.isMenuOpen() &&
          this._makeOptions(this.state.openedMenu, dimensions)
        }
      </View>
    );
  }

  _refresh(name) {
    if (this.isMenuOpen() && name === this.state.openedMenu.name) {
      const openedMenu = this._menuRegistry.getMenu(this.state.openedMenu.name);
      this.setState({ openedMenu });
    }
  }

  _onOptionsLayout(e, name) {
    this._menuRegistry.updateLayoutInfo(name, { optionsLayout: e.nativeEvent.layout });
    this._refresh(name);
  }

  _makeOptions({ options, triggerLayout, optionsLayout, name }, windowLayout) {
    const { top, left, isVisible } = computeBestMenuPosition(windowLayout, triggerLayout, optionsLayout)
    const MenuComponent = isVisible ? AnimatedView : View;
    const style = [ styles.optionsContainer, this.props.optionsContainerStyle, { top, left } ];
    const onLayout = e => this._onOptionsLayout(e, name);
    const ref = 'menu-options';
    const collapsable = false;
    return React.createElement(MenuComponent, { style, onLayout, ref, collapsable }, options);
  }

  _getWindowDimensions() {
    const dim = Dimensions.get('window');
    const landscape = dim.width > dim.height;
    if (this._orientation === 'landscape') {
      return {
        width: landscape ? dim.width : dim.height,
        height: landscape ? dim.height : dim.width
      };
    }
    if (this._orientation === 'portrait') {
      return {
        width: landscape ? dim.height : dim.width,
        height: landscape ? dim.width : dim.height
      };
    }
    return dim;
  }

  _onLayout({ nativeEvent: { layout } }) {
    // handle screen rotation
    const orientation = layout.width > layout.height ? 'landscape' : 'portrait';
    if (this._orientation === orientation) {
      return;
    }
    this._orientation = orientation;
    if (this.isMenuOpen()) {
      const { openedMenu } = this.state;
      measure(openedMenu.trigger).then(triggerLayout => {
        this._menuRegistry.updateLayoutInfo(openedMenu.name, { triggerLayout });
        this.setState({
          openedMenu: this._menuRegistry.getMenu(openedMenu.name)
        });
      });
    }
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
  backdrop: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  }
});
