import React, { Component } from "react";
import { Text, Button } from "react-native";
import {
  Menu,
  MenuProvider,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

class CloseOnBackExample extends Component {
  state = {
    customBackHandler: false,
    additionalMenu: false,
  };

  customBackHandler = (instance) => {
    alert(
      `Back button was pressed. Current menu state: ${
        instance.isMenuOpen() ? "opened" : "closed"
      }`
    );
    return true;
  };

  render() {
    const { additionalMenu } = this.state;
    return (
      <MenuProvider
        style={{ flexDirection: "column", padding: 50 }}
        backHandler={
          this.state.customBackHandler ? this.customBackHandler : true
        }
      >
        <Button
          title={
            this.state.customBackHandler
              ? "Change to default"
              : "Change to custom"
          }
          onPress={() =>
            this.setState({ customBackHandler: !this.state.customBackHandler })
          }
        />
        <Menu>
          <MenuTrigger text="Select option" />
          <MenuOptions>
            <MenuOption value={1} text="One" />
            <MenuOption value={2}>
              <Text style={{ color: "red" }}>Two</Text>
            </MenuOption>
            <MenuOption value={3} disabled={true} text="Three" />
          </MenuOptions>
        </Menu>
        <Button
          title={additionalMenu ? "Remove 2nd menu" : "Add 2nd menu"}
          onPress={() => this.setState({ additionalMenu: !additionalMenu })}
        />
        {additionalMenu && (
          <Menu>
            <MenuTrigger text="Select option 2" />
            <MenuOptions>
              <MenuOption value={1} text="One" />
              <MenuOption value={2} text="Two" />
            </MenuOptions>
          </Menu>
        )}
      </MenuProvider>
    );
  }
}

export default CloseOnBackExample;
