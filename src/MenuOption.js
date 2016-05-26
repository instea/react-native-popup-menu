import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Text } from 'react-native';
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
    const { text, disabled, children, style  } = this.props;
    return (
      <TouchableWithoutFeedback onPress={() => !disabled && this._onSelect()}>
        <View style={[styles.option, style]}>
          {text ? <Text>{text}</Text> : children}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

MenuOption.propTypes = {
  disabled: React.PropTypes.bool,
  onSelect: React.PropTypes.func,
  text: React.PropTypes.string,
  value: React.PropTypes.any,
};

MenuOption.defaultProps = {
  disabled: false,
};

MenuOption.contextTypes = {
  menuActions: React.PropTypes.object,
};

const styles = StyleSheet.create({
  option: {
    padding: 5,
    backgroundColor: 'transparent',
    flex: 1,
  }
});
