import React from 'react';
import { Text } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const BasicExample = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>
    <Text>Hello world!</Text>
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />
      <MenuOptions>
        <MenuOption value={1} text='One' />
        <MenuOption value={2} text='Two' />
        <MenuOption value={3} disabled={true}>
          <Text style={{color: '#ccc'}}>Three</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </MenuContext>
);

export default BasicExample;
