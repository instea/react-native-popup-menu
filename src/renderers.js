import React from 'react';
import { View } from 'react-native';
import AnimatedView from './AnimatedView';
import { computeContextMenuPosition, computePositionOutside } from './helpers';

const toArray = obj => Array.isArray(obj) ? obj : [ obj ];

// TODO: debug logging
// TODO: js docs
// TODO: tests

export const ContextMenu = props => {
  const { style, children, layouts, ...other } = props;
  const { windowLayout, triggerLayout, optionsLayout } = layouts;
  const { top, left } = computeContextMenuPosition(windowLayout, triggerLayout, optionsLayout);
  const newStyle = [...toArray(style), { top, left }];
  return (
    <AnimatedView {...other} style={newStyle} collapsable={false}>
      {children}
    </AnimatedView>
  );
};

export const MenuOutsideOfTheScreen = props => {
  const { style, children, layouts, ...other } = props;
  const { windowLayout } = layouts;
  const { top, left } = computePositionOutside(windowLayout);
  const newStyle = [...toArray(style), { top, left }];
  return (
    <View {...other} style={newStyle} collapsable={false}>
      {children}
    </View>
  );
};

