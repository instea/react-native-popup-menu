import React from 'react';
import { View, TouchableWithoutFeedback, Text } from 'react-native';

const MenuTrigger = props => {
  const { disabled, events, text, children } = props;
  return (
    <TouchableWithoutFeedback onPress={e => !disabled && events.onPress(e)}>
      <View {...props} ref={events.onRef} collapsable={false}>
        {text ? <Text>{text}</Text> : children}
      </View>
    </TouchableWithoutFeedback>
  );
};

MenuTrigger.propTypes = {
  disabled: React.PropTypes.bool,
  text: React.PropTypes.string,
};

MenuTrigger.defaultProps = {
  disabled: false,
};

export default MenuTrigger;
