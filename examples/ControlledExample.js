import React, { Component } from 'react';
import { Text } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

export default class ControlledExample extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this.state = { opened: true };
  }

  onOptionSelect(value) {
    alert(`Selected number: ${value}`);
    this.setState({ opened: false });
  }

  onTriggerPress() {
    this.setState({ opened: true });
  }

  onBackdropPress() {
    this.setState({ opened: false });
  }

  render() {
    return (
      <MenuContext
        style={{flexDirection: 'column', padding: 30}}>
        <Text>Hello world!</Text>
        <Menu
          opened={this.state.opened}
          onBackdropPress={() => this.onBackdropPress()}
          onSelect={value => this.onOptionSelect(value)}>
          <MenuTrigger
            onPress={() => this.onTriggerPress()}
            text='Select option'/>
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2}>
              <Text style={{color: 'red'}}>Two</Text>
            </MenuOption>
            <MenuOption value={3} disabled={true} text='Three' />
          </MenuOptions>
        </Menu>
      </MenuContext>
    );
  }

}
