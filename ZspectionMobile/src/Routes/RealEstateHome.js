import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import SearchStack from '../Containers/RealEstate/Stacks/SearchStack';
import HistoryStack from '../Containers/RealEstate/Stacks/HistoryStack';
import History from '../Containers/RealEstate/History';
import FavoritesStack from '../Containers/RealEstate/Stacks/FavoritesStack';

export default createBottomTabNavigator(
  {
    Inspection: SearchStack,
    History: HistoryStack,
    //Inspections: { screen: Inspections },
    // PoolInspection: { screen: PoolInspection },
    Favorites: { screen: FavoritesStack },
    // Profile: ProfileStack,
  },
  {
    initialRouteName:'Inspection',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        // if (routeName === 'Profile') {
        //   iconName = 'user';
        // } else 
        if (routeName === 'Inspection') {
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