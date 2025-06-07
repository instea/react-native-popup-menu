import React from 'react';
import { Text, View } from 'react-native';
import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/FontAwesome';

const CheckedOption = (props) => (
  <MenuOption
    value={props.value}
    text={(props.checked ? '\u2713 ' : '') + props.text}
  />
)

const IconOption = ({iconName, text, value}) => (
  <MenuOption value={value}>
    <Text>
      <Icon name={iconName} />
      {' ' + text}
    </Text>
  </MenuOption>
)

const { computePosition } = renderers.ContextMenu;
const roundedStyles = {
  backgroundColor: 'yellow',
  borderRadius: 30,
}
class RoundedContextMenu extends React.Component {
  render() {
    const { style, children, layouts, ...other } = this.props;
    const position = computePosition(layouts);
    return (
      <View {...other} style={[roundedStyles, style, position]}>
        {children}
      </View>
    );
  }
}


/* You can set default renderer for all menus just once in your application: */
//Menu.setDefaultRenderer(renderers.NotAnimatedContextMenu);

const ExtensionExample = () => (
  <MenuProvider style={{flexDirection: 'column', padding: 30}}>
    <Text>Extensible hello world!</Text>
    <Menu
      onSelect={value => alert(`Selected number: ${value}`)}
      renderer={renderers.NotAnimatedContextMenu}
    >
      <MenuTrigger text='Select extension options' />
      <MenuOptions>
        <CheckedOption value={1} text='One' />
        <CheckedOption checked value={2} text='Two' />
        <IconOption value={3} iconName='rocket' text='Three' />
      </MenuOptions>
    </Menu>
    <Menu renderer={RoundedContextMenu}>
      <MenuTrigger text='Select rounded menu' />
      <MenuOptions>
        <MenuOption text="A"/>
        <MenuOption text="B"/>
      </MenuOptions>
    </Menu>
  </MenuProvider>
);

export default ExtensionExample;
