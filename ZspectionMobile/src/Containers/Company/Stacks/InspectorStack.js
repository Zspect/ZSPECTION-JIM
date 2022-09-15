import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import Inspector from '../inspector';
import CreateInspector from '../inspector/CreateInspector';
import { Icon, Button } from 'react-native-elements';
import InspectorRegisterMatrix from '../inspector/RegisterMatrix';
import Maps from "../../../Maps";
import InspectorHolidayLeave from '../inspector/InspectorHolidayLeave';
import InspectorDetails from '../inspector/InspectorDetail';
import { TouchableOpacity } from 'react-native';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import CompanyPriceMatrix from '../CompanyPriceMatrix';
import InspectionDetail from '../Services/InspectionDetail';
import CompanyInspectorDetails from '../inspector/CompanyInspectorDetails';

const InspectorStack = createStackNavigator({
  Inspector: {
    screen: Inspector,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspectors',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
    })
  },
  Maps: {
    screen: Maps,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector Territory',
      headerStyle: {
        backgroundColor: '#28558E',
      },
      headerTintColor: '#fff',
      headerRight: <Icon iconStyle={{ marginRight: 15, fontWeight: 'normal', }} size={20} color="#FFF" name='notifications' type='material' />
    }),
  },
  CreateInspector: {
    screen: CreateInspector,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Create Inspector',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <Icon iconStyle={{ marginRight: 15, fontWeight: 'normal', }} size={20} color="#FFF" name='notifications' type='material' />
    }),
  },
  InspectorDetail: { // remove s from router
    screen: InspectorDetails,
  },
 
  InspectionDetail: {
    screen: InspectionDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Appointments',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
    }),
  },

  HolidayLeave: {
    screen: InspectorHolidayLeave,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector Leave',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
    }),
  },
  
  InspectorRegisterMatrix: {
    screen: InspectorRegisterMatrix,
    navigationOptions: ({ navigation }) => ({
      header: null
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

  CompanyPriceMatrixsss: {
    screen: CompanyPriceMatrix,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Company Price Matrix',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
    })
  },

},
  { headerLayoutPreset: 'center' }
  , {
    initialRouteName: 'Inspector'
  });

module.exports = InspectorStack;