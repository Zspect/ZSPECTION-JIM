import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Services from '../Services';
import CreateOfflineBooking from '../Services/CreateOfflineBooking';
import InspectionDetail from '../Services/InspectionDetail';
import { Icon, Button } from 'react-native-elements';
import CompanyInspectorDetails from '../../Company/inspector/CompanyInspectorDetails' 

import  Icon2 from 'react-native-vector-icons/EvilIcons';
import { TouchableOpacity } from 'react-native';

const ServicesStack = createStackNavigator({
  Service: {
    screen: Services,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                    <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
                  </TouchableOpacity>,
      headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    })
  },
  InspectionDetail: {
    screen: InspectionDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Appointments',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    }),
  },
  CompanyInspectorDetails: {
    screen: CompanyInspectorDetails,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector Detail',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    }),
  },
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'Service'
});

module.exports = ServicesStack;