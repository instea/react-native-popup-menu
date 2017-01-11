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

class TouchableExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Touchable: Button
    };
  }

  render() {
    const { Touchable } = this.state;
    const buttonText = 'Select ' + (Touchable ? (getDisplayName(Touchable)) : 'default');
    return (
      <MenuContext style={{flexDirection: 'column', padding: 30}}>

        <Menu onSelect={Touchable => this.setState({ Touchable })}>
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
              }}
              value={TouchableOpacity}
            />
            <MenuOption text='TouchableHighlight' customStyles={{
                OptionTouchableComponent: TouchableHighlight,
                optionTouchable: touchableHighlightProps,
              }}
              value={TouchableHighlight}
            />
            <MenuOption text='TouchableWithoutFeedback' customStyles={{
              OptionTouchableComponent: TouchableWithoutFeedback,
              }}
              value={TouchableWithoutFeedback}
            />
            <MenuOption customStyles={{
                OptionTouchableComponent: Button,
                optionTouchable: { title: 'Button' }
              }}
              value={Button}
            />
          </MenuOptions>
        </Menu>

        <Menu style={{paddingTop: 30}}>
          <MenuTrigger
            customStyles={{
              TriggerTouchableComponent: Touchable,
              triggerTouchable: { title: buttonText }
            }}
            text={buttonText}
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

  }
}

const touchableOpacityProps = {
  activeOpacity: 0.6,
};

const touchableHighlightProps = {
  activeOpacity: 0.5,
  underlayColor: 'green',
};

const getDisplayName = Component => (
  Component.displayName ||
  Component.name ||
  (typeof Component === 'string' ? Component : 'Component')
);

export default TouchableExample;
