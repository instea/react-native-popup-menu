import React from 'react';
import { View, StyleSheet } from 'react-native';

export const computePosition = ({ windowLayout }) => ({
  top: windowLayout.height,
  left: windowLayout.width,
});


const MenuOutside = props => {
  const { style, children, layouts, ...other } = props;
  const position = computePosition(layouts);
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
