import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import Search from '../Containers/RealEstate/Search';
import Profile from '../Containers/RealEstate/Profile';
import History from '../Containers/RealEstate/History';
import Favorites from '../Containers/RealEstate/Favorites';
//import CreateOffline from '../Containers/RealEstate/Backup/CreateOffline';


export default createBottomTabNavigator(
  {
    Search: { 
      screen: Search,
      navigationOptions: ({navigation}) => {
        return {tabBarLabel:"Inspection"}
      },
     },
    History: { screen: History },
    //CreateOffline: { screen: CreateOffline },
    Favorites: { screen: Favorites },
    Profile: { screen: Profile },
  },
  {
    initialRouteName:'Search',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Profile') {
          iconName = 'user';
        } else if (routeName === 'Search') {
          iconName = 'user-secret';
        }
        else if (routeName === 'Favorites') {
          iconName = 'heart';
        }
        else if (routeName === 'History') {
          iconName = 'history';
        }
        // else if (routeName === 'Notification') {
        //   iconName = 'bell';
        // }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      allowFontScaling: false,
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