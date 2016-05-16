import React from 'react';
import { Animated } from 'react-native';

export default class AnimatedView extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scaleAnim: new Animated.Value(0.001),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.scaleAnim, {
      duration: 80,
      toValue: 1
    }).start();
  }

  render() {
    const style = [
      this.props.style,
      { transform: [ { scale: this.state.scaleAnim } ] }
    ];
    return (
      <Animated.View style={style} onLayout={this.props.onLayout}>
        {this.props.children}
      </Animated.View>
    );
  }

}
