import React from 'react';
import { View } from 'react-native';

const MenuOptions = props => (
  <View style={props.style}>
    {
      React.Children.map(props.children, c =>
               React.cloneElement(c, { onSelect: c.props.onSelect || props.onSelect }))
    }
  </View>
);

MenuOptions.propTypes = {
  onSelect: React.PropTypes.func,
  renderOptionsContainer: React.PropTypes.func,
  optionsContainerStyle: View.propTypes.style,
};

export default MenuOptions;
