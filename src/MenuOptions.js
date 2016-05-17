import React from 'react';
import { View } from 'react-native';

const MenuOptions = props => (
  <View style={props.style}>
    {
      React.Children.map(props.children, c =>
               React.cloneElement(c, { onPress: props.onSelect }))
    }
  </View>
);

MenuOptions.propTypes = {
  onSelect: React.PropTypes.func,
};

export default MenuOptions;
