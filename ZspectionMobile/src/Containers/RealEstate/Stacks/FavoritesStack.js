import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Favorites from '../Favorites';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationBell from '../../../Components/NotificationBell';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
const FavoritesStack = createStackNavigator({
    Favorites: {
    screen: Favorites,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Favorite List',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
      <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
    </TouchableOpacity>,
    })
  },
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Favorites'
});

module.exports = FavoritesStack;