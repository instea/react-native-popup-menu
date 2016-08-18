# react-native-popup-menu

Extensible popup menu component for React Native.
It is inspired by [react-native-menu](https://github.com/jaysoo/react-native-menu) component which has some limitations.
Target platforms are both Android and iOS. The library is prepared for React Native 0.26.

## Installation

```
npm install react-native-popup-menu --save
```

## Demo

<kbd>
![](./android.demo.gif)
</kbd>

## Basic Usage

### Context menu - uncontrolled

```js
import React from 'react';
import { Text, AppRegistry } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export const App = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>
    <Text>Hello world!</Text>
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger text='Select option' />
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
```

### Context menu - controlled

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
```

### Slide-in menu

```js
import { ..., renderers} from 'react-native-popup-menu';

// NOTE: `onSelect` handler can be also passed to `MenuOption`'s props
export const App = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>
    <Text>Hello world!</Text>
    <Menu renderer={renderers.SlideInMenu}>
      <MenuTrigger text='Select option' />
      <MenuOptions>
        <MenuOption onSelect={() => alert('option one')} text='One' />
        <MenuOption onSelect={() => alert('option two')} text='Two' />
      </MenuOptions>
    </Menu>
  </MenuContext>
);
```

## Documentation

- [API](doc/api.md)
- [Extension points](doc/extensions.md)
- [Examples](examples/)
