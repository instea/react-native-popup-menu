import React, { Component } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Menu, {
  MenuContext,
  MenuTrigger,
  MenuOptions,
  MenuOption,
  renderers
} from 'react-native-popup-menu';

let unique = 0;
const { SlideInMenu } = renderers;

export default class Example extends Component {

  constructor(props, ctx) {
    super(props, ctx);
    this.state = { log: [] };
  }

  selectNumber(value) {
    this.addLog(`selecting number: ${value}`);
  }

  selectOptionType(value) {
    const v = typeof value === 'object' ? JSON.stringify(value) : value;
    this.addLog(`selecting type: ${v}`);
    return value !== 'Do not close';
  }

  addLog(value) {
    this.setState({
      log: [...this.state.log, {
        value,
        id: ++unique
      }]
    });
  }

  toggleHighlight(id) {
    const log = this.state.log.map(l => {
      if (l.id === id) {
        return Object.assign({}, l, {highlighted: !l.highlighted});
      }
      return l;
    })
    this.setState({ log });
  }

  deleteLogItem(id) {
    const log = this.state.log.filter(l => l.id !== id);
    this.setState({ log });
  }

  render() {
    return (
      <MenuContext style={{flex: 1}}>
        <View style={styles.container}>

          <View style={styles.topbar}>
            <Menu name="numbers" renderer={SlideInMenu} onSelect={value => this.selectNumber(value)}>
              <MenuTrigger style={styles.trigger}>
                <Text style={[styles.text, styles.triggerText]}>Slide-in menu...</Text>
              </MenuTrigger>
              <MenuOptions customStyles={{ optionText: [styles.text, styles.slideInOption] }}>
                <MenuOption value={1} text='Option one'  />
                <MenuOption value={2} text='Option two' />
                <MenuOption value={3} text='Option three' />
                <MenuOption value={4} text='Option four' />
                { null /* conditional not rendered option */ }
                <MenuOption value={5} text='Option five' />
              </MenuOptions>
            </Menu>
            <View style={{flex:1}}></View>
            <Menu name="types" onSelect={value => this.selectOptionType(value)}
              onBackdropPress={() => this.addLog('menu will be closed by backdrop')}
              onOpen={() => this.addLog('menu is opening')}
              onClose={() => this.addLog('menu is closing')}
              >
              <MenuTrigger style={styles.trigger}>
                <Text style={[styles.text, styles.triggerText]}>Context menu...</Text>
              </MenuTrigger>
              <MenuOptions customStyles={{ optionText: styles.text }}>
                <MenuOption value="Normal" text='Normal' />
                <MenuOption value="N/A" disabled={true} text='Disabled' />
                <MenuOption value="N/A" disableTouchable={true} text='Non-selectable' />
                <MenuOption value="Do not close" text='Do not close' />
                <View style={styles.divider}/>
                <MenuOption value={{ text: 'Hello world!' }} text='Object as value' />
              </MenuOptions>
            </Menu>
          </View>

          <ScrollView style={styles.logView}>
            {this.state.log.map((l, i) => {
              const wrapperStyle = {backgroundColor: i % 2 ? 'white' : 'whitesmoke'};
              const textStyle = {color: l.highlighted ? 'red' : 'gray'};
              return (
                <View style={[styles.logItem, wrapperStyle]} key={l.id}>
                  <Text style={[styles.text, textStyle]}>{l.value}</Text>
                  <View style={{flex:1}}></View>
                  <Menu>
                    <MenuTrigger text='edit' customStyles={{ triggerText: styles.text }} />
                    <MenuOptions customStyles={{ optionText: styles.text }}>
                      <MenuOption onSelect={() => this.toggleHighlight(l.id)} text={l.highlighted ? 'Unhighlight' : 'Highlight'} />
                      <MenuOption onSelect={() => this.deleteLogItem(l.id)} text='Delete' />
                    </MenuOptions>
                  </Menu>
                </View>
              );
            })}
          </ScrollView>

        </View>
      </MenuContext>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'lightgray',
  },
  topbar: {
    flexDirection: 'row',
    backgroundColor: 'dimgray',
    paddingTop : 15,
  },
  trigger: {
    padding: 5,
    margin: 5,
  },
  triggerText: {
    color: 'white',
  },
  disabled: {
    color: '#ccc',
  },
  divider: {
    marginVertical: 5,
    marginHorizontal: 2,
    borderBottomWidth: 1,
    borderColor: '#ccc'
  },
  logView: {
    flex: 1,
    flexDirection: 'column',
  },
  logItem: {
    flexDirection: 'row',
    padding: 8,
  },
  slideInOption: {
    padding: 5,
  },
  text: {
    fontSize: 18,
  }
});
