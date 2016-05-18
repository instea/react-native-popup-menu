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
  <MenuContext style={{flexDirection: 'column'}}>
    <Text>Hello world!</Text>
    <Menu onSelect={value => alert(`Selected number: ${value}`)}>
      <MenuTrigger>
        <Text>Select option</Text>
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

AppRegistry.registerComponent('examples', () => App);
```

## API

### MenuContext

It provides methods to handle popup menus imperatively.  The same methods are exposed to the child context with name `menuActions`.

#### Methods, `menuActions` context

| Method Name | Arguments | Notes
|---|---|---|
|`openMenu`|`name`|Opens menu by name|
|`toggleMenu`|`name`|Toggle menu by name|
|`closeMenu`||Closes currently opened menu|
|`isMenuOpen`||Returns `true` if any menu is open|

**Note:** It is important that `<MenuContext />` is on the top of the component hierarchy and wrap all `<Menu />` components.
This is needed in order to solve z-index issues.

### Menu

Root menu component defining menu name and providing menu events.

#### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`name`|`String`|Optional|`auto-generated`|Unique name of menu|

#### Events
| Event Name | Returns | Notes |
|---|---|---|
|`onSelect`|`optionValue`|Triggered when menu option is selected.<br>When handler returns `false`, the popup menu remains open|
|`onOpen`||Triggered when menu is opened|
|`onClose`||Triggered when menu is closed|

### MenuTrigger

It defines position where the popup menu will be rendered.
Menu can by opened by clicking on `<MenuTrigger />` or by calling context methods.

#### Options
| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`disabled`|`Boolean`|Optional|`false`|Indicates if trigger can be pressed|

**Note:** It is necessary that `<MenuTrigger />` is a direct child of `<Menu />`.

### MenuOptions

This component wrapps all menu options.

**Note:** It is necessary that `<MenuOptions />` is a direct child of `<Menu />`.


### MenuOption

Wrapper component of menu option.

| Option | Type | Opt/Required | Default | Note |
|---|---|---|---|---|
|`disabled`|`Boolean`|Optional|`false`|Indicates if option can be pressed|



