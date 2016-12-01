import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const Backdrop = props => (
  <TouchableWithoutFeedback onPress={props.onPress}>
    <View style={[styles.backdrop, props.style]} />
  </TouchableWithoutFeedback>
);

Backdrop.propTypes = {
  onPress: React.PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backdrop: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});

export default Backdrop;
