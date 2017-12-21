import React from 'react';
import PropTypes from 'prop-types';
import { View, PanResponder, Animated, StyleSheet, Easing } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION } from '../constants';

export const computePosition = ({ windowLayout, optionsLayout }) => {
  const { height: wHeight } = windowLayout;
  const { height: oHeight } = optionsLayout;
  const top  = wHeight - oHeight;
  const left = 0;
  return { top, left };
}

export default class SlideInMenu extends React.Component {

  constructor(props) {
    super(props);
    this.slideValue = 0;
    this.state = {
      slide: new Animated.Value(this.slideValue),
    };
    this.state.slide.addListener(this.onSlideAnimation);
  }

  componentDidMount() {
    Animated.timing(this.state.slide, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }

  componentWillUnmount() {
    this.state.slide.removeListener(this.onSlideAnimation);
  }

  onSlideAnimation = ({ value }) => {
    this.slideValue = value;
  }

  close() {
    if (this.slideValue === 0) {
      return;
    }
    return new Promise(resolve => {
      Animated.timing(this.state.slide, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      }).start(resolve);
    });
  }

  render() {
    const { style, children, layouts, ...other } = this.props;
    const { height: oHeight } = layouts.optionsLayout;
    const { width } = layouts.windowLayout;
    const animation = {
      transform: [{
        translateY: this.state.slide.interpolate({
          inputRange: [0, 1],
          outputRange: [oHeight, 0]
        }),
      }]
    };
    const position = computePosition(layouts);
    return (
      <View
        {...this.panResponder.panHandlers}
        style={styles.panResponder}
        collapsable={false}
      >
        <Animated.View
          style={[styles.options, { width }, style, animation, position]}
          {...other}
        >
          {children}
        </Animated.View>
      </View>
    );
  }

  panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => false, // don't suppress menu options handlers
    onPanResponderMove: (evt, gestureState) => {
      const { height } = this.props.layouts.optionsLayout;
      const newValue = Math.max(Math.min(1 - gestureState.dy / height, 1), 0);
      this.state.slide.setValue(newValue);
    },
    onPanResponderRelease: (evt, gestureState) => {
      if (gestureState.vy < 0) {
        // open
        Animated.timing(this.state.slide, {
          duration: (1 - this.slideValue) * OPEN_ANIM_DURATION,
          toValue: 1,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }).start();
      } else {
        // close
        Animated.timing(this.state.slide, {
          duration: this.slideValue * OPEN_ANIM_DURATION,
          toValue: 0,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true
        }).start(() => {
          this.context.menuActions.closeMenu();
        });
      }
    },
  })

}

SlideInMenu.contextTypes = {
  menuActions: PropTypes.object,
};

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
  panResponder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
