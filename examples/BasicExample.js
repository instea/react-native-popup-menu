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
      <MenuTrigger>
        <Text>Select option...</Text>
      </MenuTrigger>
      <MenuOptions>
        <MenuOption value={1}>
          <Text>One</Text>
        </MenuOption>
        <MenuOption value={2}>
          <Text>Two</Text>
        </MenuOption>
      </MenuOptions>
    </Menu>
  </MenuContext>
);

export default BasicExample;
