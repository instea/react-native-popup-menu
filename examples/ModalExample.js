import React, { Component } from 'react';
import { Text, Modal } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

class ModalExample extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this.state = { modalVisible: false, menuVisible: true };
  }

  render() {
    return (
      <MenuContext style={{flexDirection: 'column', padding: 30}}>
        <Text>Main window:</Text>
        {
          this.state.menuVisible &&
          <Menu>
            <MenuTrigger text='Select option' />
            <MenuOptions>
              <MenuOption onSelect={() => this.setState({ modalVisible: true })} text='Open modal' />
              <MenuOption onSelect={() => this.setState({ menuVisible: false })} text='Remove menu' />
            </MenuOptions>
          </Menu>
        }
        <Modal visible={this.state.modalVisible} onRequestClose={() => this.setState({ visible: false })}>
          <MenuContext style={{flexDirection: 'column', padding: 30, backgroundColor: 'white'}}>
            <Text>Modal window:</Text>
            <Menu onSelect={value => alert(`Selected number: ${value}`)}>
              <MenuTrigger text='Select option' />
              <MenuOptions>
                <MenuOption value={1} text='One' />
                <MenuOption value={2} text='Two' />
                <MenuOption onSelect={() => this.setState({ visible: false })} text='Close modal' />
              </MenuOptions>
            </Menu>
          </MenuContext>
        </Modal>
      </MenuContext>
    );
  }

}

export default ModalExample;
