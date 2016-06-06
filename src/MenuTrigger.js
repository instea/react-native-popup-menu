import React, { Component } from 'react';
import { View, TouchableHighlight, Text } from 'react-native';
import { debug } from './logger.js';

export default class MenuTrigger extends Component {

  _onPress() {
    debug('trigger onPress');
    this.props.onPress && this.props.onPress();
    this.context.menuActions.openMenu(this.props.menuName);
  }

  render() {
    const { disabled, onRef, text, children, style, customStyles, ...other } = this.props;
    const onPress = () => !disabled && this._onPress();
    return (
      <View ref={onRef} collapsable={false}>
        <TouchableHighlight onPress={onPress} style={[customStyles.triggerWrapper, style]}
          {...defaultTouchableStyles} {...customStyles.triggerTouchable}>
          <View {...other}>
            {text ? <Text style={customStyles.triggerText}>{text}</Text> : children}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

}

MenuTrigger.propTypes = {
  disabled: React.PropTypes.bool,
  text: React.PropTypes.string,
  onPress: React.PropTypes.func,
  customStyles: React.PropTypes.object,
};

MenuTrigger.defaultProps = {
  disabled: false,
  customStyles: {},
};

MenuTrigger.contextTypes = {
  menuActions: React.PropTypes.object,
};

const defaultTouchableStyles = {
  underlayColor: 'rgba(0, 0, 0, 0.1)',
};

export default MenuTrigger;
