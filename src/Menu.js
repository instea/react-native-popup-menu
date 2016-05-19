import React, { Component } from 'react';
import { View } from 'react-native';
import { MenuOptions, MenuTrigger } from './index';
import { makeName } from './helpers';

const isRegularComponent = c => c.type !== MenuOptions && c.type !== MenuTrigger;
const isTrigger = c => c.type === MenuTrigger;
const isMenuOptions = c => c.type === MenuOptions;

export default class Menu extends Component {

  constructor(props) {
    super(props);
    this._openMenu = this._openMenu.bind(this);
    this._onSelect = this._onSelect.bind(this);
  }

  componentDidMount() {
    this._name = this.props.name || makeName();
    this.context.menuRegistry.subscribe(this._name, this._buildMenuData());
  }

  componentDidUpdate() {
    this.context.menuRegistry.update(this._name, this._buildMenuData());
  }

  componentWillUnmount() {
    this.context.menuRegistry.unsubscribe(this._name);
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
    return this.props.children.reduce((r, child) => {
      if (isTrigger(child)) {
        r.push(React.cloneElement(child, {
          key: null,
          events: {
            onPress: this._openMenu,
            onRef: t => this._trigger = t
          }
        }));
      }
      if (isRegularComponent(child)) {
        r.push(child);
      }
      return r;
    }, []);
  }

  _openMenu() {
    this.context.menuActions.openMenu(this._name);
  }

  _onSelect(value) {
    const shouldClose = this.props.onSelect(value) !== false;
    if (shouldClose) {
        this.context.menuActions.closeMenu();
    }
  }

  _buildMenuData() {
    const { children, onOpen, onClose } = this.props;
    const name = this._name;
    const optionsElem = children.find(isMenuOptions);
    const options = React.cloneElement(optionsElem, { onSelect: this._onSelect });
    const trigger = this._trigger;
    return { name, options, trigger, events: { onOpen, onClose } };
  }

}

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
