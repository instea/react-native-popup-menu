import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import { View } from 'react-native';

const MenuTrigger = props => (
  <TouchableWithoutFeedback onPress={e => !props.disabled && props.events.onPress(e)}>
    <View {...props} ref={props.events.onRef} collapsable={false}>
      {props.children}
    </View>
  </TouchableWithoutFeedback>
);

MenuTrigger.propTypes = {
  disabled: React.PropTypes.bool,
};

MenuTrigger.defaultProps = {
  disabled: false,
};

export default MenuTrigger;
