import React, { Component } from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';

export default class MenuTrigger extends Component {

  _openMenu() {
    this.context.menuActions.openMenu(this.props.menuName);
  }

  render() {
    const { disabled, onRef, text, children } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => !disabled && this._openMenu()}>
        <View {...this.props} ref={onRef} collapsable={false}>
          {text ? <Text>{text}</Text> : children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

}

MenuTrigger.propTypes = {
  disabled: React.PropTypes.bool,
  text: React.PropTypes.string,
};

MenuTrigger.defaultProps = {
  disabled: false,
};

MenuTrigger.contextTypes = {
  menuActions: React.PropTypes.object,
};

export default MenuTrigger;
