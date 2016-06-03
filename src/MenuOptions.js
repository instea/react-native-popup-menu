import React from 'react';
import { View } from 'react-native';

const MenuOptions = ({ style, children, onSelect, styles }) => (
  <View style={[styles.optionsWrapper, style]}>
    {
      React.Children.map(children, c => React.cloneElement(c, {
         onSelect: c.props.onSelect || onSelect,
         styles: Object.keys(c.props.styles || {}).length ? c.props.styles : styles
       }))
    }
  </View>
);

MenuOptions.propTypes = {
  onSelect: React.PropTypes.func,
  styles: React.PropTypes.object,
  renderOptionsContainer: React.PropTypes.func,
  optionsContainerStyle: View.propTypes.style,
};

MenuOptions.defaultProps = {
  styles: {},
};

export default MenuOptions;
