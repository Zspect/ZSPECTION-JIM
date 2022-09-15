import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Profile from '../Profile';
import ChangeCompanyPassword from '../Profile/ChangeCompanyPassword';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
const CompanyProfileStack = createStackNavigator({
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
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Profile'
});

module.exports = CompanyProfileStack;