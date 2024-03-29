import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import InspectorAvailability from '../InspectorAvailability';

import UpdatePriceMatrix from '../UpdatePriceMatrix';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
const InspectorAvailabilityStack = createStackNavigator({
  InspectorAvailability: {
    screen: InspectorAvailability,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector Availability',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                        <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
                      </TouchableOpacity>,
      
    })
  },
  UpdatePriceMatrix:{
    screen: UpdatePriceMatrix,
    navigationOptions: ({ navigation }) => ({
        headerTitle:'Price Martix',
        headerStyle: {backgroundColor:'#28558E'},
        headerTintColor: '#FFF',
    }),
  }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'InspectorAvailability'
});

module.exports = InspectorAvailabilityStack;