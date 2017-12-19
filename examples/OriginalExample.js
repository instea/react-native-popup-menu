'use strict';
// original example from https://raw.githubusercontent.com/jaysoo/react-native-menu/master/Example/Example.js

const React = require('react');
const RN = require('react-native');
const {
  ScrollView,
  StyleSheet,
  Text,
  View
} = RN;

import Menu, {
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const OriginalExample = React.createClass({
  componentDidMount() {
    // We can use the public context API to open/close/toggle the menu.
    //setInterval(() => {
    //  this.refs.MenuProvider.toggleMenu('menu1');
    //}, 2000);
  },
  getInitialState() {
    return {
      message: 'Try clicking the top-right menus',
      firstMenuDisabled: false,
      dropdownSelection: '-- Choose --'
    };
  },
  setMessage(value) {
    if (typeof value === 'string') {
      this.setState({ message: `You selected "${value}"` });
    } else {
      this.setState({ message: `Woah!\n\nYou selected an object:\n\n${JSON.stringify(value)}` });
    }
    return value !== 'do not close';
  },
  setFirstMenuDisabled(disabled) {
    this.setState({
      message: `First menu is ${disabled ? 'disabled' : 'enabled'}`,
      firstMenuDisabled: disabled
    });
  },
  render() {
    return ( // eslint-disable-next-line react/no-string-refs
      <MenuProvider style={{ flex: 1 }} ref="MenuProvider">
        <View style={styles.topbar}>
          <Menu onSelect={this.setMessage} name="menu1">
            <MenuTrigger disabled={this.state.firstMenuDisabled} style={styles.menuTrigger}>
              <Text style={styles.menuTriggerText}>OPEN FIRST MENU</Text>
            </MenuTrigger>
            <MenuOptions style={styles.menuOptions}>
              <MenuOption value="normal">
                <Text>Normal option</Text>
              </MenuOption>
              <MenuOption value="do not close">
                <Text>Does not close menu</Text>
              </MenuOption>
              <MenuOption value="disabled" disabled={true}>
                <Text style={styles.disabled}>Disabled option</Text>
              </MenuOption>
              <View style={styles.divider}/>
              <MenuOption value={{ message: 'Hello World!' }}>
                <Text>Option with object value</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <View style={[styles.topbar, { backgroundColor: '#333' }]}>
          <Menu onSelect={this.setFirstMenuDisabled}>
            <MenuTrigger style={styles.menuTrigger}>
              <Text style={styles.menuTriggerText}>OPEN SECOND MENU</Text>
            </MenuTrigger>
            <MenuOptions>
              {
                this.state.firstMenuDisabled
                  ? (
                    <MenuOption value={false}>
                      <Text>enable first menu</Text>
                    </MenuOption>
                  )
                  : (
                  <MenuOption value={true}>
                    <Text>disable first menu</Text>
                  </MenuOption>
                )
              }
            </MenuOptions>
          </Menu>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>
            { this.state.message }
          </Text>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentText}>
            You can also make it a dropdown
          </Text>
          <Menu style={styles.dropdown} onSelect={(value) => this.setState({ dropdownSelection: value })}>
            <MenuTrigger>
              <Text>{this.state.dropdownSelection}</Text>
            </MenuTrigger>
            <MenuOptions optionsContainerStyle={styles.dropdownOptions}
                         renderOptionsContainer={(options) => <ScrollView><Text>CHOOSE SOMETHING....</Text>{options}</ScrollView>}>
              <MenuOption value="Option One">
                <Text>Option One</Text>
              </MenuOption>
              <MenuOption value="Option Two">
                <Text>Option Two</Text>
              </MenuOption>
              <MenuOption value="Option Three">
                <Text>Option Three</Text>
              </MenuOption>
              <MenuOption value="Option Four">
                <Text>Option Four</Text>
              </MenuOption>
              <MenuOption value="Option Five">
                <Text>Option Five</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </MenuProvider>
    );
  }
});

const styles = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: 'black',
    paddingHorizontal: 5,
    paddingVertical: 10
  },
  menuTrigger: {
    flexDirection: 'row',
    paddingHorizontal: 10
  },
  menuTriggerText: {
    color: 'lightgrey',
    fontWeight: '600',
    fontSize: 20
  },
  disabled: {
    color: '#ccc'
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  content: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  contentText: {
    fontSize: 18
  },
  dropdown: {
    width: 300,
    borderColor: '#999',
    borderWidth: 1,
    padding: 5
  },
  dropdownOptions: {
    marginTop: 24,
    margin: -6,
    borderColor: '#ccc',
    borderWidth: 2,
    width: 300,
    height: 200
  }
});

module.exports = OriginalExample;
