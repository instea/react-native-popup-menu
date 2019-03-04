import React from 'react';
import { Animated, StyleSheet, Easing } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION, USE_NATIVE_DRIVER } from '../constants';

export const computePosition = (layouts) => {
  const { windowLayout, optionsLayout } = layouts
  const { height: wHeight } = windowLayout;
  const { height: oHeight } = optionsLayout;
  const top  = wHeight - oHeight;
  const left = 0, right = 0;
  const position = { top, left, right };
  // TODO what is the best way to handle safeArea?
  // most likely some extra paddings inside SlideInMenu 
  return position;
}

export default class SlideInMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      slide: new Animated.Value(0),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.slide, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: USE_NATIVE_DRIVER,
    }).start();
  }

  close() {
    return new Promise(resolve => {
      Animated.timing(this.state.slide, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(resolve);
    });
  }

  render() {
    const { style, children, layouts, ...other } = this.props;
    const { height: oHeight } = layouts.optionsLayout;
    const animation = {
      transform: [{
        translateY: this.state.slide.interpolate({
          inputRange: [0, 1],
          outputRange: [oHeight, 0],
        }),
      }],
    };
    const position = computePosition(layouts);
    return (
      <Animated.View style={[styles.options, style, animation, position]} {...other}>
        {children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
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
