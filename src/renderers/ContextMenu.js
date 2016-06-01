import React from 'react';
import { Animated, StyleSheet } from 'react-native';

export const computePosition = ({ windowLayout, triggerLayout, optionsLayout }) => {
  const { width: wWidth, height: wHeight } = windowLayout;
  // TODO: scroll bar for big menus
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  let top, left;
  if (oHeight > wHeight) {
    top = 0;
  } else {
    top  = (tY + oHeight > wHeight) ? tY + tHeight - oHeight : tY;
  }
  if (top < 0) {
    top = Math.round(tY + (tHeight / 2) - (oHeight / 2));
  }
  if (oWidth > wWidth) {
    left = 0;
  } else {
    left = (tX + oWidth > wWidth) ? tX - oWidth + tWidth : tX;
  }
  if (left < 0) {
    left = Math.round(tX + (tWidth / 2) - (oWidth / 2));
  }
  return { top, left };
}


export default class ContextMenu extends React.Component {

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
    const { style, children, layouts, ...other } = this.props;
    const animation = {
      transform: [ { scale: this.state.scaleAnim } ]
    };
    const position = computePosition(layouts);
    return (
      <Animated.View {...other} style={[styles.options, style, animation, position]}>
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
