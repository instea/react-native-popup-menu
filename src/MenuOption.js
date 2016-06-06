import React, { Component } from 'react';
import { View, StyleSheet, TouchableHighlight, Text } from 'react-native';
import { debug } from './logger';

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
    const { text, disabled, children, style, styles } = this.props;
    const onPress = () => !disabled && this._onSelect();
    return (
      <TouchableHighlight onPress={onPress}
        style={[defaultStyles.option, styles.optionWrapper, style]}
        {...styles.optionTouchable}>
        <View>
          {text ? <Text style={styles.optionText}>{text}</Text> : children}
        </View>
      </TouchableHighlight>
    );
  }
}

MenuOption.propTypes = {
  disabled: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  text: React.PropTypes.string,
  value: React.PropTypes.any,
  styles: React.PropTypes.object,
};

MenuOption.defaultProps = {
  disabled: false,
  styles: {},
};

MenuOption.contextTypes = {
  menuActions: React.PropTypes.object,
};

const defaultStyles = StyleSheet.create({
  option: {
    padding: 5,
    backgroundColor: 'transparent',
    flex: 1,
  }
});
