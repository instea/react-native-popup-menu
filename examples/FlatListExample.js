import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

Menu.debug = true;

const data = new Array(500)
  .fill(0)
  .map((a, i) => ({ key: i, value: 'item' + i }));

export default class App extends Component {
  render() {
    return (
      <MenuProvider style={styles.container}>
        <Menu onSelect={value => Alert.alert(value)}>
          <MenuTrigger text="Select option" />
          <MenuOptions>
            <FlatList
              data={data}
              renderItem={({ item }) => (
                <MenuOption value={item.value} text={item.value} />
              )}
              style={{ height: 200 }}
            />
          </MenuOptions>
        </Menu>
      </MenuProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
});
