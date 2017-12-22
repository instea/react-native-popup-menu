import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION } from '../constants';

export default class Dialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fadeAnim: new Animated.Value(0.1),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.fadeAnim, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    }).start();
  }

  close() {
    return new Promise(resolve => {
      Animated.timing(this.state.fadeAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true
      }).start(resolve);
    });
  }

  render() {
    const { style, children, layouts, ...other } = this.props;
    const animation = {
      opacity: this.state.fadeAnim,
    };
    return (
      <View style={styles.conatiner}>
        <Animated.View {...other} style={[styles.options, style, animation]}>
          {children}
        </Animated.View>
      </View>
    );
  }

}

export const styles = StyleSheet.create({
  conatiner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    position: 'absolute',
    borderRadius: 2,
    backgroundColor: 'white',
    width: 200,

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
});
