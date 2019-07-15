

import React, { Component } from 'react';
import {Text,AsyncStorage} from 'react-native'
const storage = AsyncStorage


export default class AuthScreen extends Component {
  componentDidMount(){
      storage.getItem('userData').then((val)=>{
          if(val){
              let removeJson = JSON.parse(val)
              this.props.navigation.navigate('MainNav',{loginDetailes:removeJson})
          }else{
              this.props.navigation.navigate('LoginNav')
          }
      })
  }
  render() {
    return (
     <Text></Text>
    );
  }
}
