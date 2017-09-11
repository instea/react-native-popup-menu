import React from 'react';
import { Text, View, } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

import {Scene, Router, Actions} from 'react-native-router-flux';

const Page = () => (
    <View style={{flexDirection: 'column', padding: 70}}>
      <Text>Hello world with react-native-router-flux!</Text>
      <Menu>
        <MenuTrigger text='Select option' />
        <MenuOptions>
          <MenuOption onSelect={() => Actions.login()} text='Login' />
          <MenuOption onSelect={() => Actions.register()} text='Register' />
          <MenuOption onSelect={() => Actions.home()} text='Home' />
        </MenuOptions>
      </Menu>
    </View>
);

const NavigatorMenu = () => (
  <Menu>
    <MenuTrigger text='...' />
    <MenuOptions>
      <MenuOption onSelect={() => Actions.login()} text='Navigation Login' />
      <MenuOption onSelect={() => Actions.register()} text='Navigation Register' />
      <MenuOption onSelect={() => Actions.home()} text='Navigation Home' />
    </MenuOptions>
  </Menu>
);

class NavigatorExample extends React.Component {
  render() {
    return (
      <MenuContext>
        <Router>
          <Scene key="root" >
            <Scene key="login" component={Page} title="Login" renderRightButton={NavigatorMenu}/>
            <Scene key="register" component={Page} title="Register"/>
            <Scene key="home" component={Page}/>
          </Scene>
        </Router>
      </MenuContext>
    );
  }
}

export default NavigatorExample;
