import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Favorites from '../Favorites';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationBell from '../../../Components/NotificationBell';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import VendorScreen from '../VendorScreen';
import VendorDetail from '../VendorDetail';

const VendorStack = createStackNavigator({
  // VendorSscren: VendorScreen
  VendorSscren: {
    screen: VendorScreen,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Partner Directory',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
    })
  },

  VendorDetails: {
    screen: VendorDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Partner Details',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },

},
  { headerLayoutPreset: 'center' }
  , {
    initialRouteName: 'VendorSscren'
  });

module.exports = VendorStack;