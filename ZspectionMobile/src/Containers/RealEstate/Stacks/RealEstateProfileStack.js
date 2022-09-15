import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Profile from '../Profile';
import EditProfile from '../EditProfile';
import ChangeRealEstatePassword from '../ChangeRealEstatePassword';
import { TouchableOpacity } from 'react-native';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
const RealEstateProfileStack = createStackNavigator({
  Profile: {
    screen: Profile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                        <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
                      </TouchableOpacity>,
    })
  },
  EditProfile: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Profile',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
  ChangeRealEstatePassword: {
    screen: EditProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Password',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    })
  },
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Profile'
});

module.exports = RealEstateProfileStack;