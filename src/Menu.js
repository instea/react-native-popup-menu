import React, { Component } from 'react';
import { View } from 'react-native';
import { MenuOptions, MenuTrigger } from './index';
import { makeName } from './helpers';
import { debug } from './logger';

const isRegularComponent = c => c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = c => c.type === MenuTrigger;
const isMenuOptions = c => c.type === MenuOptions;

const normalizeChildren = children => {
  if (children) {
    return Array.isArray(children) ? children : [ children ];
  }
  return [];
};

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this._name = this.props.name || makeName();
    this._forceClose = false;
  }

  componentDidMount() {
    if (!this._validateChildren()) {
      return;
    }
    debug('subscribing menu', this._name);
    this.context.menuRegistry.subscribe(this);
    this.context.menuActions._notify();
  }

  getName() {
    return this._name;
  }

  componentWillUnmount() {
    debug('unsubscribing menu', this._name);
    if (this._isOpen()) {
      this._forceClose = true;
      this.context.menuActions._notify();
    }
    this.context.menuRegistry.unsubscribe(this);
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
    return normalizeChildren(this.props.children).reduce((r, child) => {
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
    const { children, onSelect } = this.props;
    const optionsElem = normalizeChildren(children).find(isMenuOptions);
    return React.cloneElement(optionsElem, { onSelect });
  }

  _getOpened() {
    return this._opened;
  }

  _setOpened(opened) {
    this._opened = opened;
  }

  _validateChildren() {
    const children = normalizeChildren(this.props.children);
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

Menu.propTypes = {
  name: React.PropTypes.string,
  onSelect: React.PropTypes.func,
  onOpen: React.PropTypes.func,
  onClose: React.PropTypes.func,
};

Menu.defaultProps = {
  onSelect: () => {},
  onOpen: () => {},
  onClose: () => {},
};

Menu.contextTypes = {
  menuRegistry: React.PropTypes.object,
  menuActions: React.PropTypes.object,
};
