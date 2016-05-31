import React from 'react';
import { Text } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const CheckedOption = (props) => (
  <MenuOption {...props} text={'\u2713 ' + props.text} />
)

const ExtensionExample = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>
    <Text>Extensible hello world!</Text>
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />
      <MenuOptions>
        <MenuOption value={1} text='One' />
        <CheckedOption value={2} text='Two' />
      </MenuOptions>
    </Menu>
  </MenuContext>
);

export default ExtensionExample;
