import React, { Component } from 'react';
import { Text, StyleSheet } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from 'react-native-popup-menu';

const { ContextMenu, SlideInMenu } = renderers;

export default class BasicExample extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this.state = { renderer: ContextMenu };
  }

  render() {
    return (
      <MenuContext customStyles={menuContextStyles}>
        <Menu renderer={this.state.renderer} style={{ height: 50 }}>
          <MenuTrigger text='Select option' customStyles={triggerStyles} />
          <MenuOptions customStyles={optionsStyles}>
            <MenuOption text='Context Menu'
              onSelect={() => this.setState({renderer: ContextMenu})}/>
            <MenuOption text='Slide-in Menu'
              onSelect={() => this.setState({renderer: SlideInMenu})}/>
            <MenuOption text='Three (custom)' customStyles={optionStyles}
              onSelect={() => alert('Selected custom styled option')} />
            <MenuOption disabled={true}>
              <Text style={{color: '#ccc'}}>Four (disabled)</Text>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </MenuContext>
    );
  }

}

const triggerStyles = {
  triggerText: {
    color: 'white',
  },
  triggerOuterWrapper: {
    backgroundColor: 'orange',
    padding: 5,
    flex: 1,
  },
  triggerWrapper: {
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  triggerTouchable: {
    underlayColor: 'darkblue',
    activeOpacity: 70,
  },
};

const optionsStyles = {
  optionsContainer: {
    backgroundColor: 'green',
    padding: 5,
  },
  optionsWrapper: {
    backgroundColor: 'purple',
  },
  optionWrapper: {
    backgroundColor: 'yellow',
    margin: 5,
  },
  optionTouchable: {
    underlayColor: 'gold',
    activeOpacity: 70,
  },
  optionText: {
    color: 'brown',
  },
};

const optionStyles = {
  optionTouchable: {
    underlayColor: 'red',
    activeOpacity: 40,
  },
  optionWrapper: {
    backgroundColor: 'pink',
    margin: 5,
  },
  optionText: {
    color: 'black',
  },
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 30,
  },
  backdrop: {
    backgroundColor: 'red',
    opacity: 0.5,
  },
});

const menuContextStyles = {
  menuContextWrapper: styles.container,
  backdrop: styles.backdrop,
};
