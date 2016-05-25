import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';

const MenuOption = ({ text, disabled, children, onPress, onSelect, value, style }) => (
  <TouchableWithoutFeedback onPress={() => !disabled && onPress(value, onSelect)}>
    <View style={[styles.option, style]}>
      {text ? <Text>{text}</Text> : children}
    </View>
  </TouchableWithoutFeedback>
);

MenuOption.propTypes = {
  disabled: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  text: React.PropTypes.string,
  value: React.PropTypes.any,
};

MenuOption.defaultProps = {
  disabled: false,
};

const styles = StyleSheet.create({
  option: {
    padding: 5,
    backgroundColor: 'transparent',
    flex: 1,
  }
});

export default MenuOption;
