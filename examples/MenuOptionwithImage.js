import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import Menu, {
  MenuContext,
  MenuOptions,
  MenuOption,
  MenuTrigger
} from 'react-native-popup-menu';

const triggerStyles = {
  // triggerOuterWrapper: {
  //   backgroundColor: 'orange',
  //   flexDirection: 'row',
  // },
  // triggerWrapper: {
  //   backgroundColor: 'blue',
  //   alignItems: 'center',
  //   justifyContent: 'flex-start',
  //   flexDirection: 'row',
  // },
};

const menuContextStyles = {
  menuContextWrapper: {
    flex: null,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: 'black',
    borderWidth: 0.5,
    margin: 5,
    padding: 5,
    backgroundColor: 'gray',
  },
};

export default class MenuOptionwithImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      array: [1,2,3,4,5],
    };
  }

  render() {
    return(
    <View style={{flex:1}}>
    {this.state.array.map(() => (
     <MenuContext customStyles={menuContextStyles}>
        <View style={{flexDirection: 'row', marginRight: 50}}>
        <Image source={require('./images/user.png')} style={{width: 50, height: 50, marginRight: 20}}/>  
        <Text style={{fontSize: 18, fontWeight: 'bold', alignSelf: 'center'}}>Username</Text>
        </View>
        <Menu onSelect={value => alert(`Selected number: ${value}`)}>         
         <MenuTrigger>
           <Image source={require('./images/dot.png')} style={{width: 20, height: 20, marginRight: 20}}/>  
          </MenuTrigger>
          <MenuOptions>
            <MenuOption value={1} text='One' />
            <MenuOption value={2}>
              <Text style={{color: 'red'}}>Two</Text>
            </MenuOption>
            <MenuOption value={3} disabled={true} text='Three' />
          </MenuOptions>
        </Menu>
      </MenuContext>
    ))}
    </View>
  );
 }
}

