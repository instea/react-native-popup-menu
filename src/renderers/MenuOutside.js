import React from 'react';
import { View, StyleSheet } from 'react-native';
import { computePositionOutside } from '../helpers';

const MenuOutside = props => {
  const { style, children, layouts, ...other } = props;
  const position = computePositionOutside(layouts);
  return (
    <View {...other} style={[styles.options, style, position]} collapsable={false}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  options: {
    position: 'absolute',
  },
});

export default MenuOutside;
