import React from 'react';
import { Text } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

import {Scene, Router, Actions} from 'react-native-router-flux';

class NavigatorExample extends React.Component {
  render() {
    return <Router>
      <Scene key="root">
        <Scene key="login" component={Page} title="Login"/>
        <Scene key="register" component={Page} title="Register"/>
        <Scene key="home" component={Page}/>
      </Scene>
    </Router>
  }
}

const Page = () => (
    <MenuContext style={{flexDirection: 'column', padding: 70}}>
      <Text>Hello world with react-native-router-flux!</Text>
      <Menu>
        <MenuTrigger text='Select option' />
        <MenuOptions>
          <MenuOption onSelect={() => Actions.login()} text='Login' />
          <MenuOption onSelect={() => Actions.register()} text='Register' />
          <MenuOption onSelect={() => Actions.home()} text='Home' />
        </MenuOptions>
      </Menu>
    </MenuContext>
);

export default NavigatorExample;
