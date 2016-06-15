import React from 'react';
import { View } from 'react-native';

import { computePosition, styles } from './ContextMenu';

/**
Simplified version of ContextMenu without animation.
*/
export default class NotAnimatedContextMenu extends React.Component {

  render() {
    const { style, children, layouts, ...other } = this.props;
    const position = computePosition(layouts);
    return (
      <View {...other} style={[styles.options, style, position]}>
        {children}
      </View>
    );
  }

}
