//This is an example code for Bottom Navigation//
import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
//import all the basic component we have used
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
//import Ionicons to show the icon for bottom options
 
//For React Navigation 3+
//import {
//  createStackNavigator,
//  createBottomTabNavigator,
//  createAppContainer,
//} from 'react-navigation';
 
//For React Navigation 4+
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
 
import Profile from '../Containers/Company/Profile';
import History from '../Containers/Company/History';
import Inspector from '../Containers/Company/inspector';
import Notification from '../Containers/Company/Notification';
import Services from '../Containers/Company/Services';
//import CreateInspector from '../Containers/Company/inspector/CreateInspector';

export default createBottomTabNavigator(
  {
    Services: { screen: Services },
    // Notification: { screen: Notification },
    Inspectors: { screen: Inspector },
    Profile: { screen: Profile },
    // History: { screen: History },
  },
  {
    initialRoutename: 'Inspectors',
    defaultNavigationOptions: ({ navigation }) => ({
        
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Profile') {
          iconName = 'user';
        } else if (routeName === 'Services') {
          iconName = 'gear';
        }
        else if (routeName === 'Inspectors') {
          iconName = 'user-secret';
        }
        else if (routeName === 'History') {
          iconName = 'history';
        }
        else if (routeName === 'Notification') {
          iconName = 'bell';
        }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor:'red',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom:3
      },
      // tabStyle: {
      //   justifyContent:'space-around'
      // }
    },
  }
);