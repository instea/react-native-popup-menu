import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
} from 'react-native-popup-menu';

const data = new Array(100)
  .fill(0)
  .map((a, i) => ({ key: '' + i, value: 'item' + i }));

export default class App extends Component {
  render() {
    return (
      <MenuProvider style={styles.container}>
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <Menu onSelect={value => Alert.alert(value)}>
              <MenuTrigger text={'Select option ' + item.value} />
              <MenuOptions>
                <MenuOption value="A" text="A" />
                <MenuOption value="B" text="B" />
                <MenuOption value="C" text="C" />
            </MenuOptions>
          </Menu>
          )}
          style={{ height: 200 }}
        />
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
