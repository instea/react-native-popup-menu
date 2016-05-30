import React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { computeSlideInMenuPosition } from '../helpers';

export default class ContextMenu extends React.Component {
  render() {
    const { style, children, layouts, ...other } = this.props;
    const animation = {};
    const position = computeSlideInMenuPosition(layouts);
    const width = layouts.windowLayout.width;
    return (
      <Animated.View style={[styles.options, { width }, style, animation, position]} {...other}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});

