import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const MenuOption = props => (
  <TouchableWithoutFeedback onPress={() => !props.disabled && props.onPress(props.value)}>
    <View style={[styles.option, props.style]}>
      {props.children}
    </View>
  </TouchableWithoutFeedback>
);

MenuOption.propTypes = {
  disabled: React.PropTypes.bool,
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
