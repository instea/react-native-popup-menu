import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { MenuOptions, MenuTrigger } from './index';
import ContextMenu from './renderers/ContextMenu';
import { makeName } from './helpers';
import { debug } from './logger';

const isRegularComponent = c => c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = c => c.type === MenuTrigger;
const isMenuOptions = c => c.type === MenuOptions;

export default class Menu extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this._name = this.props.name || makeName();
    this._forceClose = false;
    if(!(ctx && ctx.menuActions)) {
      throw new Error("Menu component must be ancestor of MenuProvider");
    }
  }

  componentDidMount() {
    if (!this._validateChildren()) {
      return;
    }
    debug('subscribing menu', this._name);
    this.context.menuRegistry.subscribe(this);
    this.context.menuActions._notify();
  }

  componentDidUpdate() {
    // force update if menu is opened as its content might have changed
    const force = this._isOpen();
    debug('component did update', this._name, force);
    this.context.menuActions._notify(force);
  }

  componentWillUnmount() {
    debug('unsubscribing menu', this._name);
    if (this._isOpen()) {
      this._forceClose = true;
      this.context.menuActions._notify();
    }
    this.context.menuRegistry.unsubscribe(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.name !== nextProps.name) {
      console.warn('Menu name cannot be changed');
    }
  }

  open() {
    this.context.menuActions.openMenu(this._name);
  }

  close() {
    this.context.menuActions.closeMenu();
  }

  getName() {
    return this._name;
  }

  render() {
    const { style } = this.props;
    const children = this._reduceChildren();
    return (
      <View style={style}>
        {children}
      </View>
    );
  }

  _reduceChildren() {
    return React.Children.toArray(this.props.children).reduce((r, child) => {
      if (isTrigger(child)) {
        r.push(React.cloneElement(child, {
          key: null,
          menuName: this._name,
          onRef: (t => this._trigger = t)
        }));
      }
      if (isRegularComponent(child)) {
        r.push(child);
      }
      return r;
    }, []);
  }

  _isOpen() {
    if (this._forceClose) {
      return false;
    }
    return this.props.hasOwnProperty('opened') ? this.props.opened : this._opened;
  }

  _getTrigger() {
    return this._trigger;
  }

  _getOptions() {
    return React.Children.toArray(this.props.children).find(isMenuOptions);
  }

  _getOpened() {
    return this._opened;
  }

  _setOpened(opened) {
    this._opened = opened;
  }

  _validateChildren() {
    const children = React.Children.toArray(this.props.children);
    const options = children.find(isMenuOptions);
    if (!options) {
      console.warn('Menu has to contain MenuOptions component');
    }
    const trigger = children.find(isTrigger);
    if (!trigger) {
      console.warn('Menu has to contain MenuTrigger component');
    }
    return options && trigger;
  }

}

Menu.debug = false;
Menu.setDefaultRenderer = (renderer) => {
  Menu.defaultProps.renderer = renderer;
}
Menu.setDefaultRendererProps = (rendererProps) => {
  Menu.defaultProps.rendererProps = rendererProps;
}

Menu.propTypes = {
  name: PropTypes.string,
  renderer: PropTypes.func,
  rendererProps: PropTypes.object,
  onSelect: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  opened: PropTypes.bool,
  onBackdropPress: PropTypes.func,
};

Menu.defaultProps = {
  renderer: ContextMenu,
  rendererProps: {},
  onSelect: () => {},
  onOpen: () => {},
  onClose: () => {},
  onBackdropPress: () => {},
};

Menu.contextTypes = {
  menuRegistry: PropTypes.object,
  menuActions: PropTypes.object,
};
