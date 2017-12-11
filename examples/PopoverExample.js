import {
  Menu,
  MenuContext,
  MenuOptions,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import { Text, View, StyleSheet } from 'react-native';
import React from 'react';

const { Popover } = renderers

const MyPopover = () => (
  <Menu renderer={Popover} rendererProps={{ preferredPlacement: 'bottom' }}>
    <MenuTrigger style={styles.menuTrigger} >
      <Text style={styles.triggerText}>{'\u263A'}</Text>
    </MenuTrigger>
    <MenuOptions style={styles.menuOptions}>
      <Text style={styles.contentText}>Hello world!</Text>
    </MenuOptions>
  </Menu>
)

const Row = () => (
  <View style={styles.row}>
    <MyPopover />
    <MyPopover />
    <MyPopover />
    <MyPopover />
    <MyPopover />
    <MyPopover />
  </View>
)

const PopoverExample = () => (
  <MenuContext style={styles.container} customStyles={{ backdrop: styles.backdrop }}>
    <Row />
    <Row />
    <Row />
    <Row />
    <Row />
    <Row />
    <Row />
    <Row />
  </MenuContext>
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  backdrop: {
  },
  menuOptions: {
    padding: 50,
  },
  menuTrigger: {
    padding: 5,
  },
  triggerText: {
    fontSize: 20,
  },
  contentText: {
    fontSize: 18,
  },
})

export default PopoverExample;
