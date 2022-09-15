import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Auth from '../Components/Auth';
import LoginStack from './LoginStack';
import Notification from '../Components/Notification';
import Logout from '../Components/Logout';

const AuthStack = createStackNavigator({
  Auth: {
    screen: Auth,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  // Notification:{
  //   screen: Notification,
  //   navigationOptions: ({ navigation }) => ({
  //     header: null,
  //   })
  // },
  Logout: {
    screen: Logout,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  LoginStack: {
    screen: LoginStack,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  }
},{
    initialRouteName: 'Notification'
});

module.exports = AuthStack;