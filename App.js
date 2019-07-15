

import React, { Component } from 'react';
import {Easing,Animated} from 'react-native';
import IntroPage from './app/users/index'
import ReportPage from './app/users/reportPage'
import MainPage from './app/admin/mainPage'
import Login from './app/admin/login'
import {createStackNavigator,createSwitchNavigator} from 'react-navigation'
import AuthScreen from './app/authScreen'

const Nav = createStackNavigator({
  IntroPage:{
    screen:IntroPage
  },
  ReportPage:{
    screen:ReportPage
  }
},{
  headerMode:'none',

   transitionConfig: () => ({
       transitionSpec: {
         duration: 500,
         easing: Easing.out(Easing.poly(4)),
         timing: Animated.timing,
       },
       screenInterpolator: sceneProps => {
         const { layout, position, scene } = sceneProps;
         const { index } = scene;
         const thisSceneIndex = scene.index
         const width = layout.initWidth
  
         const translateX = position.interpolate({
           inputRange: [thisSceneIndex - 1, thisSceneIndex],
           outputRange: [width, 0],
         })
  
          // const opacity2 = position.interpolate({
          //     inputRange: [0,1],
          //     outputRange: [0,1]
          // })
  
         const height = layout.initHeight;
         const translateY = position.interpolate({
           inputRange: [index - 1, index, index + 1],
           outputRange: [height, 0, 0],
         });
  
         const opacity = position.interpolate({
           inputRange: [index - 1, index - 0.99, index],
           outputRange: [0, 1, 1],
         });
  
         return { opacity, transform: [{ translateX }] };
       },
       
     })
})


const MainNav = createStackNavigator({
  MainPage:{
    screen:MainPage,
  }
},{
  headerMode:'none',

   transitionConfig: () => ({
       transitionSpec: {
         duration: 500,
         easing: Easing.out(Easing.poly(4)),
         timing: Animated.timing,
       },
       screenInterpolator: sceneProps => {
         const { layout, position, scene } = sceneProps;
         const { index } = scene;
         const thisSceneIndex = scene.index
         const width = layout.initWidth
  
         const translateX = position.interpolate({
           inputRange: [thisSceneIndex - 1, thisSceneIndex],
           outputRange: [width, 0],
         })
  
          // const opacity2 = position.interpolate({
          //     inputRange: [0,1],
          //     outputRange: [0,1]
          // })
  
         const height = layout.initHeight;
         const translateY = position.interpolate({
           inputRange: [index - 1, index, index + 1],
           outputRange: [height, 0, 0],
         });
  
         const opacity = position.interpolate({
           inputRange: [index - 1, index - 0.99, index],
           outputRange: [0, 1, 1],
         });
  
         return { opacity, transform: [{ translateX }] };
       },
       
     })
})


const LoginNav = createStackNavigator({
  Login:{
    screen:Login,
  }
},{
  headerMode:'none',

   transitionConfig: () => ({
       transitionSpec: {
         duration: 500,
         easing: Easing.out(Easing.poly(4)),
         timing: Animated.timing,
       },
       screenInterpolator: sceneProps => {
         const { layout, position, scene } = sceneProps;
         const { index } = scene;
         const thisSceneIndex = scene.index
         const width = layout.initWidth
  
         const translateX = position.interpolate({
           inputRange: [thisSceneIndex - 1, thisSceneIndex],
           outputRange: [width, 0],
         })
  
          // const opacity2 = position.interpolate({
          //     inputRange: [0,1],
          //     outputRange: [0,1]
          // })
  
         const height = layout.initHeight;
         const translateY = position.interpolate({
           inputRange: [index - 1, index, index + 1],
           outputRange: [height, 0, 0],
         });
  
         const opacity = position.interpolate({
           inputRange: [index - 1, index - 0.99, index],
           outputRange: [0, 1, 1],
         });
  
         return { opacity, transform: [{ translateX }] };
       },
       
     })
})

const Switch= createStackNavigator({
  MainNav:MainNav,
  LoginNav:LoginNav,
  AuthScreen:AuthScreen
},{
  initialRouteName:'AuthScreen',
  headerMode:'none'
})

export default class App extends Component {
  render() {
    return (
     <Switch/>
    );
  }
}
