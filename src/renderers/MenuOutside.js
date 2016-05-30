import React from 'react';
import { View } from 'react-native';
import { computePositionOutside } from '../helpers';

const MenuOutside = props => {
  const { style, children, layouts, ...other } = props;
  const position = computePositionOutside(layouts);
  return (
    <View {...other} style={[style, position]} collapsable={false}>
      {children}
    </View>
  );
};

export default MenuOutside;
