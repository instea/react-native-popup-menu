import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import MenuOptions from './MenuOptions';
import MenuTrigger from './MenuTrigger';
import ContextMenu from './renderers/ContextMenu';
import { makeName } from './helpers';
import { debug, CFG } from './logger';
import { withCtx } from './MenuProvider';

const isRegularComponent = c => c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = c => c.type === MenuTrigger;
const isMenuOptions = c => c.type === MenuOptions;

export class Menu extends Component {

  constructor(props) {
    super(props);
    this._name = this.props.name || makeName();
    this._forceClose = false;
    const { ctx } = props;
    if(!(ctx && ctx.menuActions)) {
      throw new Error("Menu component must be ancestor of MenuProvider");
    }
  }

  componentDidMount() {
    if (!this._validateChildren()) {
      return;
    }
    debug('subscribing menu', this._name);
    this.props.ctx.menuRegistry.subscribe(this);
    this.props.ctx.menuActions._notify();
  }

  componentDidUpdate(prevProps) {
    if (this.props.name !== prevProps.name) {
      console.warn('Menu name cannot be changed');
    }
    // force update if menu is opened as its content might have changed
    const force = this.isOpen();
    debug('component did update', this._name, force);
    this.props.ctx.menuActions._notify(force);
  }

  componentWillUnmount() {
    debug('unsubscribing menu', this._name);
    if (this.isOpen()) {
      this._forceClose = true;
      this.props.ctx.menuActions._notify();
    }
    this.props.ctx.menuRegistry.unsubscribe(this);
  }

  open() {
    return this.props.ctx.menuActions.openMenu(this._name);
  }

  close() {
    return this.props.ctx.menuActions.closeMenu();
  }

  isOpen() {
    if (this._forceClose) {
      return false;
    }
    return this.props.hasOwnProperty('opened') ? this.props.opened : this._opened;
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
          onRef: (t => this._trigger = t),
        }));
      }
      if (isRegularComponent(child)) {
        r.push(child);
      }
      return r;
    }, []);
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

const MenuExternal = withCtx(Menu);
Object.defineProperty(MenuExternal, 'debug', 
    { 
      get: function() { return CFG.debug }, 
      set: function(val) { CFG.debug = val }, 
    });
MenuExternal.setDefaultRenderer = (renderer) => {
  Menu.defaultProps.renderer = renderer;
}
MenuExternal.setDefaultRendererProps = (rendererProps) => {
  Menu.defaultProps.rendererProps = rendererProps;
}
export default MenuExternal;
