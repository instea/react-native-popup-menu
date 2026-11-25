import React, { Component } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
} from 'react-native-popup-menu';

const Openner = (props) => (
  <TouchableOpacity style={{ paddingTop: 50 }}
    onPress={() => props.ctx.menuActions.openMenu('menu-1')}>
    <Text>Open menu from context</Text>
  </TouchableOpacity>
);

const ContextOpenner = withMenuContext(Openner);

export default class ControlledExample extends Component {

  onOptionSelect(value) {
    alert(`Selected number: ${value}`);
    if (value === 1) {
      this.menu.close();
    }
    return false;
  }

  openMenu() {
    this.menu.open();
  }

  onRef = r => {
    this.menu = r;
  }

  render() {
    return (
      <MenuProvider style={{flexDirection: 'column', padding: 30}}>
        <Menu onSelect={value => this.onOptionSelect(value)}
          name="menu-1" ref={this.onRef}>
          <MenuTrigger text='Select option'/>
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2} text='Two (not closing)' />
          </MenuOptions>
        </Menu>
        <TouchableOpacity style={{ paddingTop: 50 }} onPress={() => this.openMenu()}>
          <Text>Open menu from outside</Text>
        </TouchableOpacity>
        <ContextOpenner />
      </MenuProvider>
    );
  }

}
