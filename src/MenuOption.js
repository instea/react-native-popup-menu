import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Text } from 'react-native';
import { debug } from './logger';
import { makeTouchable } from './helpers';

export default class MenuOption extends Component {

  _onSelect() {
    const { value, onSelect } = this.props;
    const shouldClose = onSelect(value) !== false;
    debug('select option', value, shouldClose);
    if (shouldClose) {
        this.context.menuActions.closeMenu();
    }
  }

  render() {
    const { text, disabled, disableTouchable, children, style, customStyles } = this.props;
    if (text && React.Children.count(children) > 0) {
      console.warn("MenuOption: Please don't use text property together with explicit children. Children are ignored.");
    }
    if (disabled) {
      const disabledStyles = [defaultStyles.optionTextDisabled, customStyles.optionText];
      return (
        <View style={[defaultStyles.option, customStyles.optionWrapper, style]}>
          {text ? <Text style={disabledStyles}>{text}</Text> : children}
        </View>
      );
    }
    const rendered = (
      <View style={[defaultStyles.option, customStyles.optionWrapper, style]}>
        {text ? <Text style={customStyles.optionText}>{text}</Text> : children}
      </View>
    );
    if (disableTouchable) {
      return rendered;
    }
    else {
      const { Touchable, defaultTouchableProps } = makeTouchable(customStyles.OptionTouchableComponent);
      return (
        <Touchable
          onPress={() => this._onSelect()}
          {...defaultTouchableProps}
          {...customStyles.optionTouchable}
        >
          {rendered}
        </Touchable>
      );
    }
  }
}

MenuOption.propTypes = {
  disabled: PropTypes.bool,
  disableTouchable: PropTypes.bool,
  onSelect: PropTypes.func,
  text: PropTypes.string,
  value: PropTypes.any,
  customStyles: PropTypes.object,
};

MenuOption.defaultProps = {
  disabled: false,
  customStyles: {},
};

MenuOption.contextTypes = {
  menuActions: PropTypes.object,
};

const defaultStyles = StyleSheet.create({
  option: {
    padding: 5,
    backgroundColor: 'transparent',
    flex: 1,
  },
  optionTextDisabled: {
    color: '#ccc',
  },
});
