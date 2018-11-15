import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, Text } from 'react-native';
import { debug } from './logger.js';
import { makeTouchable } from './helpers';
import { withCtx } from './MenuProvider';

export class MenuTrigger extends Component {

  _onPress() {
    debug('trigger onPress');
    this.props.onPress && this.props.onPress();
    this.props.ctx.menuActions.openMenu(this.props.menuName);
  }

  render() {
    const { disabled, onRef, text, children, style, customStyles, menuName, triggerOnLongPress, onSelect, ...other } = this.props;
    const openMenu = () => !disabled && this._onPress();
    const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.TriggerTouchableComponent);
    return (
      <View ref={onRef} collapsable={false} style={customStyles.triggerOuterWrapper}>
        <Touchable
          onPress={triggerOnLongPress ? openMenu : onSelect}
          onLongPress={triggerOnLongPress ? onSelect : openMenu}
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
  disabled: PropTypes.bool,
  text: PropTypes.string,
  onPress: PropTypes.func,
  customStyles: PropTypes.object,
  triggerOnLongPress: PropTypes.bool,
  onSelect: PropTypes.func,
};

MenuTrigger.defaultProps = {
  disabled: false,
  customStyles: {},
};

export default withCtx(MenuTrigger)
