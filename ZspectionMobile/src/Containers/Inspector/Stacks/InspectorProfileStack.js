import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import InspectorProfile from '../InspectorProfile';
import ChangeCompanyPassword from '../ChangePassword';

const InspectorProfileStack = createStackNavigator({
    ProfileRoute: {
    screen: InspectorProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  ChangeCompanyPassword: {
    screen: ChangeCompanyPassword,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Password',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Profile'
});

module.exports = InspectorProfileStack;