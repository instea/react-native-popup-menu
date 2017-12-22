import React, { Component } from 'react';
import { FlatList, Alert, StyleSheet } from 'react-native';
import {
  MenuProvider,
  Menu,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers,
} from 'react-native-popup-menu';

const { SlideInMenu } = renderers;

Menu.debug = true;

const listData = new Array(500)
  .fill(0)
  .map((a, i) => ({ key: i, value: 'item' + i }));

const simpleData = new Array(15)
  .fill(0)
  .map((a, i) => ({ key: i, value: 'item' + i }));

export default class AdvancedSlideinExample extends Component {
  render() {
    return (
      <MenuProvider style={styles.container}>
        <Menu
          onSelect={value => Alert.alert(value)}
          renderer={SlideInMenu}
          rendererProps={{
            initialHeight: 200,
          }}
        >
          <MenuTrigger style={styles.trigger} text="Select option (Simple)" />
          <MenuOptions>
            {simpleData.map(item => (
              <MenuOption key={item.key} value={item.value} text={item.value} />
            ))}
          </MenuOptions>
        </Menu>
        <Menu
          onSelect={value => Alert.alert(value)}
          renderer={SlideInMenu}
          rendererProps={{
            initialHeight: 200,
          }}
        >
          <MenuTrigger style={styles.trigger} text="Select option (FlatList)" />
          <MenuOptions>
            <FlatList
              data={listData}
              renderItem={({ item }) => (
                <MenuOption value={item.value} text={item.value} />
              )}
              style={{ height: 400 }}
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
  trigger: {
    padding: 20,
  },
});
