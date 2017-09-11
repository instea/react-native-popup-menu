import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import Backdrop from './Backdrop';
import { debug } from './logger.js';

export default class MenuPlaceholder extends Component {
  constructor(props) {
    super(props)
    this.state = {};
  }

  render() {
    const { ctx } = this.props;
    const shouldRenderMenu = ctx.isMenuOpen() && ctx._isInitialized();
    debug('MenuPlaceholder should render', shouldRenderMenu);
    if (!shouldRenderMenu) {
      return null;
    }
    const { customStyles } = ctx.props;
    return (
      <View style={styles.placeholder}>
        <Backdrop
          onPress={() => ctx._onBackdropPress()}
          style={customStyles.backdrop}
          ref={ctx.onBackdropRef}
        />
        {
          ctx._makeOptions(this.state.openedMenu)
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }
});
