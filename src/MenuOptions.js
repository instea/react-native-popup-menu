import React from 'react';
import PropTypes from 'prop-types';
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
  onSelect: PropTypes.func,
  customStyles: PropTypes.object,
  renderOptionsContainer: PropTypes.func,
  optionsContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.number,
    PropTypes.array,
  ]),
};

MenuOptions.defaultProps = {
  customStyles: {},
};

export default MenuOptions;
