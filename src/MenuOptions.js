import React from 'react';
import { View } from 'react-native';

const MenuOptions = ({ style, children, onSelect, customStyles }) => (
  <View style={[customStyles.optionsWrapper, style]}>
    {
      React.Children.map(children, c =>
        React.isValidElement(c) ?
          React.cloneElement(c, {
            onSelect: c.props.onSelect || onSelect,
            customStyles: Object.keys(c.props.customStyles || {}).length ? c.props.customStyles : customStyles
          }) : c
      )
    }
  </View>
);

MenuOptions.propTypes = {
  onSelect: React.PropTypes.func,
  customStyles: React.PropTypes.object,
  renderOptionsContainer: React.PropTypes.func,
  optionsContainerStyle: View.propTypes.style,
};

MenuOptions.defaultProps = {
  customStyles: {},
};

export default MenuOptions;
