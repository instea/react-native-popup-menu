# react-native-popup-menu

Popup menu component for React Native.
It is inspired by [react-native-menu](https://github.com/jaysoo/react-native-menu) component which has some limitations.
Target platforms are both Android and iOS. The library is prepared for React Native 0.26.

## Installation

```
npm install react-native-popup-menu --save
```

## Demo

![](./android.demo.gif)

## Basic Usage

### Uncontrolled example

```js
import React from 'react';
import { Text, AppRegistry } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

export const App = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>
    <Text>Hello world!</Text>
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />
      <MenuOptions>
        <MenuOption value={1} text='One' />
        <MenuOption value={2} text='Two' />
      </MenuOptions>
    </Menu>
  </MenuContext>
);
```

### Controlled example

```js
export default class ControlledExample extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this.state = { opened: true };
  }

  onOptionSelect(value) {
    alert(`Selected number: ${value}`);
    this.setState({ opened: false });
  }

  render() {
    return (
      <MenuContext
        style={{flexDirection: 'column', padding: 30}}>
        <Text>Hello world!</Text>
        <Menu
          opened={this.state.opened}
          onBackdropPress={() => this.setState({ opened: false })}
          onSelect={value => this.onOptionSelect(value)}>
          <MenuTrigger
            onPress={() => this.setState({ opened: true })}
            text='Select option'/>
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2} text='Two' />
          </MenuOptions>
        </Menu>
      </MenuContext>
    );
  }

}
```

## Documentation

- [API](doc/api.md)
- [Examples](examples/)
