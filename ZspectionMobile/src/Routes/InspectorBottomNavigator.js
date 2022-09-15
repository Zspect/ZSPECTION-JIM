import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';
 
import Profile from '../Containers/Inspector/Profile';
import Notification from '../Containers/Inspector/Notification';
import Inspections from '../Containers/Inspector/Inspections/index';
import ChangePassword from '../Containers/Inspector/ChangePassword';


export default createBottomTabNavigator(
  {
    Inspections: { screen: Inspections },
    Notification: { screen: Notification },
    Profile: { screen: Profile },
    ChangePassword: { 
      screen: ChangePassword,
      navigationOptions: ({ navigation }) => ({
        title:"Change Password",
       
      }),
     },
  },
  {
    initialRouteName:'Inspections',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Inspections') {
          iconName = 'search';
        } else if (routeName === 'Notification') {
          iconName = 'clone';
        }
        else if (routeName === 'Profile') {
          iconName = 'user';
        }
        else if (routeName === 'ChangePassword') {
          iconName = 'key';
        }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor:'#B9183A',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom:3
      },
    },
  }
);