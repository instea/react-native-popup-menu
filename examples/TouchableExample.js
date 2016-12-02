import React from 'react';
import {
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Button,
} from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

const TouchableExample = () => (
  <MenuContext style={{flexDirection: 'column', padding: 30}}>

    <Menu>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: Button,
          triggerTouchable: { title: 'Select (Custom Touchables)' }
        }}
      />
      <MenuOptions>
        <MenuOption text='Default' />
        <MenuOption text='TouchableOpacity' customStyles={{
          OptionTouchableComponent: TouchableOpacity,
          optionTouchable: touchableOpacityProps,
        }} />
        <MenuOption text='TouchableHighlight' customStyles={{
          OptionTouchableComponent: TouchableHighlight,
          optionTouchable: touchableHighlightProps,
        }} />
        <MenuOption text='TouchableWithoutFeedback' customStyles={{
          OptionTouchableComponent: TouchableWithoutFeedback,
        }} />
      </MenuOptions>
    </Menu>

    <Menu style={{paddingTop: 30}}>
      <MenuTrigger
        customStyles={{
          TriggerTouchableComponent: Button,
          triggerTouchable: { title: 'Select (all TouchableOpacity)' }
        }}
      />
      <MenuOptions customStyles={{
        OptionTouchableComponent: TouchableOpacity,
        optionTouchable: touchableOpacityProps,
      }}>
        <MenuOption text='Option 1' />
        <MenuOption text='Option 2' />
        <MenuOption text='Option 3' />
        <MenuOption text='Option 4' />
      </MenuOptions>
    </Menu>

  </MenuContext>
);

const touchableOpacityProps = {
  activeOpacity: 0.6,
};

const touchableHighlightProps = {
  activeOpacity: 0.5,
  underlayColor: 'green',
};

export default TouchableExample;
