import React from 'react';
import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const Backdrop = props => {
  const { width, height } = props.dimensions;
  return (
    <TouchableWithoutFeedback onPress={props.onPress}>
      <View style={[styles.backdrop, { width, height }]} />
    </TouchableWithoutFeedback>
  );
};

Backdrop.propTypes = {
  dimensions: React.PropTypes.object.isRequired,
  onPress: React.PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  backdrop: {
    opacity: 0,
    position: 'absolute',
    top: 0,
    left: 0,
  },
});

export default Backdrop;
