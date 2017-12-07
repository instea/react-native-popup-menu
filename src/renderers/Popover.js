import { Animated, Easing, StyleSheet, View } from 'react-native';
import React from 'react';

import { OPEN_ANIM_DURATION, CLOSE_ANIM_DURATION } from '../constants.js';

const popoverPadding = 7;
const anchorSize = 15;
const anchorHyp = Math.sqrt(anchorSize*anchorSize + anchorSize*anchorSize);
const anchorOffset = (anchorHyp + anchorSize) / 2 - popoverPadding;

const POSITIVE_DIRECTION = 1;
const NEGATIVE_DIRECTION = -1;

/**
 * Computes position properties of popover when trying to align it to the triger side.
 * It consideres window boundaries.
 * Returns object with keys:
 *   - position: <Number> Absolute position - top/left,
 *   - direction: <Number> Positive if position is above/left, negative if position is below/right the trigger
 */
function axisSidePositionProperties({ oDim, wDim, tPos, tDim }) {
  // if options are bigger than window dimension, then render at 0
  if (oDim > wDim) {
    return { position: 0, direction: POSITIVE_DIRECTION };
  }
  // render above trigger
  if (tPos - oDim >= 0) {
    return { position: tPos - oDim, direction: POSITIVE_DIRECTION };
  }
  // render under trigger
  if (tPos + tDim + oDim <= wDim) {
    return { position: tPos + tDim, direction: NEGATIVE_DIRECTION };
  }
  // compute center position
  let pos = tPos + (tDim / 2) - (oDim / 2);
  // check top boundary
  if (pos < 0) {
    return { position: 0, direction: NEGATIVE_DIRECTION };
  }
  // check bottom boundary
  if (pos + oDim > wDim) {
    return { position: wDim - oDim, direction: POSITIVE_DIRECTION };
  }
  // if everything ok, render in center position
  return { position: pos, direction: POSITIVE_DIRECTION };
}

// computes offsets (off screen overlap) of popover when trying to align it to the center
function centeringProperties({ oDim, wDim, tPos, tDim }) {
  const center = Math.round(tPos + (tDim / 2));
  const leftOffset = (oDim / 2) - center;
  const rightOffset = center + (oDim / 2) - wDim;
  return { center, leftOffset, rightOffset };
}

/**
 * Computes position and offset of popover when trying to align it to the triger center.
 * It consideres window boundaries.
 * Returns object with keys:
 *   - position: <Number> Absolute position - top/left,
 *   - offset: <Number> window overlapping size if window boundaries were not considered
 */
function axisCenteredPositionProperties(options) {
  const { oDim, wDim } = options;
  const { center, leftOffset, rightOffset } = centeringProperties(options);
  if (leftOffset > 0 || rightOffset > 0) {
    // right/bottom position is better
    if (leftOffset < rightOffset) {
      return { offset: rightOffset, position: wDim - oDim };
    }
    // left/top position is better
    if (rightOffset < leftOffset) {
      return { offset: -leftOffset, position: 0 };
    }
  }
  // centered position
  return { offset: 0, position: center - oDim / 2 };
}

// picks max offset for popover
function maxCenterOffset(options) {
  const { leftOffset, rightOffset } = centeringProperties(options);
  return Math.max(0, leftOffset, rightOffset);
}

/**
 * Computes properties needed for drawing popover.
 * Returns object with keys:
 *   - position: <Object> { top: Number, left: Number } - popover absolute position
 *   - placement: <Enum> top|left|top|bottom - position to the trigger
 *   - offset: <Number> value by which must be anchor shifted
 */
export function computeProperties ({ windowLayout, triggerLayout, optionsLayout }) {
  const { x: wX, y: wY, width: wWidth, height: wHeight } = windowLayout;
  const { x: tX, y: tY, height: tHeight, width: tWidth } = triggerLayout;
  const { height: oHeight, width: oWidth } = optionsLayout;
  const hOptions = {
    oDim: oHeight + popoverPadding * 2,
    wDim: wHeight,
    tPos: tY - wY,
    tDim: tHeight,
  }
  const vOptions = {
    oDim: oWidth + popoverPadding * 2,
    wDim: wWidth,
    tPos: tX - wX,
    tDim: tWidth,
  }
  const vCenterOffset = maxCenterOffset(vOptions);
  const hCenterOffset = maxCenterOffset(hOptions);

  const result = {};
  // prefer vertical centering
  if (vCenterOffset <= hCenterOffset) {
    const { position: left, offset } = axisCenteredPositionProperties(vOptions);
    const { position: top, direction } = axisSidePositionProperties(hOptions);
    result.position = { top, left }
    result.placement = direction > 0 ? 'bottom' : 'top';
    result.offset = offset;
    if (result.placement === 'top') {
      // substract anchor placeholder from the beginning
      result.position.top -= anchorSize;
    }
  } else {
    const { position: top, offset } = axisCenteredPositionProperties(hOptions);
    const { position: left, direction } = axisSidePositionProperties(vOptions);
    result.position = { top, left };
    result.placement = direction > 0 ? 'right' : 'left';
    result.offset = offset;
    if (result.placement === 'left') {
      // substract anchor placeholder from the beginning
      result.position.left -= anchorSize;
    }
  }
  return result;
}

export default class Popover extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scaleAnim: new Animated.Value(0.1),
    };
  }

  componentDidMount() {
    Animated.timing(this.state.scaleAnim, {
      duration: OPEN_ANIM_DURATION,
      toValue: 1,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }

  close() {
    return new Promise(resolve => {
      Animated.timing(this.state.scaleAnim, {
        duration: CLOSE_ANIM_DURATION,
        toValue: 0,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(resolve);
    });
  }

  render() {
    const { style, children, layouts, ...other } = this.props;
    const animation = {
      transform: [ { scale: this.state.scaleAnim } ],
      opacity: this.state.scaleAnim,
    };
    const { position, placement, offset } = computeProperties(layouts);
    return (
      <Animated.View style={[styles.animated, animation, position, containerStyle[placement]]}>
        <View style={[styles.anchor, anchorStyle({ placement, offset })]} />
        <View {...other} style={[styles.options, style]}>
          {children}
        </View>
      </Animated.View>
    );
  }

}

const containerStyle = {
  left: {
    flexDirection: 'row',
  },
  right: {
    flexDirection: 'row-reverse',
  },
  top: {
    flexDirection: 'column',
  },
  bottom: {
    flexDirection: 'column-reverse',
  },
}

const anchorStyle = ({ offset, placement }) => {
  switch (placement) {
    case 'right':
      return {
        top: offset,
        transform: [
          { translateX: -anchorOffset },
          { rotate: '45deg' },
        ],
      };
    case 'left':
      return {
        top: offset,
        transform: [
          { translateX: anchorOffset },
          { rotate: '45deg' },
        ],
      };
    case 'top':
      return {
        left: offset,
        transform: [
          { translateY: anchorOffset },
          { rotate: '45deg' },
        ],
      };
    case 'bottom':
      return {
        left: offset,
        transform: [
          { translateY: -anchorOffset },
          { rotate: '45deg' },
        ],
      };
  }
}

export const styles = StyleSheet.create({
  animated: {
    padding: popoverPadding,
    backgroundColor: 'transparent',
    position: 'absolute',
    alignItems: 'center',
  },
  options: {
    borderRadius: 2,
    minWidth: anchorHyp,
    minHeight: anchorHyp,
    backgroundColor: 'white',

    // Shadow only works on iOS.
    shadowColor: 'black',
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 3 },
    shadowRadius: 4,

    // This will elevate the view on Android, causing shadow to be drawn.
    elevation: 5,
  },
  anchor: {
    width: anchorSize,
    height: anchorSize,
    backgroundColor: 'white',
    elevation: 5,
  },
});
