import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

export default class ControlledExample extends Component {

  onOptionSelect(value) {
    alert(`Selected number: ${value}`);
    if (value === 1) {
      this.refs.menu.close();
    }
    return false;
  }

  openMenu() {
    this.refs.menu.open();
  }

  render() {
    return (
      <MenuContext style={{flexDirection: 'column', padding: 30}}>
        <Menu onSelect={value => this.onOptionSelect(value)} ref='menu'>
          <MenuTrigger text='Select option'/>
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2} text='Two (not closing)' />
          </MenuOptions>
        </Menu>
        <TouchableOpacity style={{ paddingTop: 50 }} onPress={() => this.openMenu()}>
          <Text>Open menu from outside</Text>
        </TouchableOpacity>
      </MenuContext>
    );
  }

}
