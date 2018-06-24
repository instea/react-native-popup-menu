import React, { Component } from 'react';
import { Text, Button } from 'react-native';
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

class CloseOnBackExample extends Component {
  state = {
    customBackHandler: false,
  }

  customBackHandler = (instance) => {
    alert(`Back button was pressed. Current menu state: ${instance.isMenuOpen() ? 'opened' : 'closed'}`);
    return true;
  }

  render() {
    return (
      <MenuProvider
        style={{flexDirection: 'column', padding: 30}}
        backHandler={this.state.customBackHandler ? this.customBackHandler : true}>
        <Menu>
          <MenuTrigger text='Select option' />
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2}>
              <Text style={{color: 'red'}}>Two</Text>
            </MenuOption>
            <MenuOption value={3} disabled={true} text='Three' />
          </MenuOptions>
        </Menu>
        <Button
          title={this.state.customBackHandler ? "Change to default" : "Change to custom"}
          onPress={() => this.setState({ customBackHandler: !this.state.customBackHandler })}/>
      </MenuProvider>
    );
  }
}

export default CloseOnBackExample;
