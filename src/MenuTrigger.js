import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { debug } from './logger.js';
import { makeTouchable } from './helpers';

export default class MenuTrigger extends Component {

  _onPress() {
    debug('trigger onPress');
    this.props.onPress && this.props.onPress();
    this.context.menuActions.openMenu(this.props.menuName);
  }

  render() {
    const { disabled, onRef, text, children, style, customStyles, ...other } = this.props;
    const onPress = () => !disabled && this._onPress();
    const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.TriggerTouchableComponent);
    return (
      <View ref={onRef} collapsable={false} style={customStyles.triggerOuterWrapper}>
        <Touchable
          onPress={onPress}
          {...defaultTouchableProps}
          {...customStyles.triggerTouchable}
        >
          <View {...other} style={[customStyles.triggerWrapper, style]}>
            {text ? <Text style={customStyles.triggerText}>{text}</Text> : children}
          </View>
        </Touchable>
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

