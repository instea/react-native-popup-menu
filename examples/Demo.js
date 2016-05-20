import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import Menu from 'react-native-popup-menu';

import Example from './Example';
import BasicExample from './BasicExample';
import OriginalExample from './OriginalExample';

const demos = [
  { Component: BasicExample, name: 'Basic example' },
  { Component: Example, name: 'Advanced example' },
  { Component: OriginalExample, name: 'Original example' },
];

// show debug messages for demos.
Menu.debug = true;

export default class Demo extends Component {
  constructor(props, ctx) {
    super(props, ctx);
    this.state = {
      selected: undefined,
    };
  }
  render() {
    if (this.state.selected) {
      return <this.state.selected/>;
    }
    return (
        <View style={styles.container}>
          <View>
            <Text>Select example:</Text>
            {demos.map(this.renderDemo, this)}
          </View>
        </View>
    );
  }

  renderDemo(demo, idx) {
    const type = idx + '. ' + demo.name;
    return (
      <TouchableHighlight key={type} onPress={()=> this.setState({selected: demo.Component})}>
        <View>
          <Text>{type}</Text>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
  },
});
