import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import CompanyListing from '../Search/CompanyListing';
import CompanyDetail from '../Search/CompanyDetail';
import SearchSummary from '../Search/SearchSummary';
import Search from '../Search';
import { Avatar, Icon } from 'react-native-elements';
import NotificationBell from '../../../Components/NotificationBell';
import Invites from '../../../Components/Invites';
import RealEstateInspections from '../RealEstateInspections';
import InspectionArea from '../InspectionArea';
import { TouchableOpacity } from 'react-native';
import Icon2 from 'react-native-vector-icons/EvilIcons';
const SearchStack = createStackNavigator({
  RealEstateInspection: {
    screen: RealEstateInspections,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Select Inspections',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
      headerRight: <Icon iconStyle={{ marginRight: 15, fontWeight: 'normal', }} size={20} color="#FFF" name='notifications' type='material' />
    })
  },
  Area: {
    screen: InspectionArea,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspection Area',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
    })
  },
  Search: {
    screen: Search,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspection Request',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      // headerRight: <NotificationBell />
    })
  },
  CompanyListing: {
    screen: CompanyListing,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector list',
      headerStyle: {
        backgroundColor: '#28558E',
      },
      headerTintColor: '#fff',
      headerRight: <NotificationBell />
    }),
  },
  SearchSummary: {
    screen: SearchSummary,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Confirmation',
      headerStyle: {
        backgroundColor: '#28558E',
      },
      headerTintColor: '#fff',
      headerRight: <NotificationBell />
    }),
  },
  CompanyDetail: {
    screen: CompanyDetail,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'TIC Inspection',
      headerStyle: {
        backgroundColor: '#28558E',
      },
      headerTintColor: '#fff',
      headerRight: <NotificationBell />
    }),
  },
  Invites: {
    screen: Invites,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Invites',
      headerStyle: {
        backgroundColor: '#28558E',
      },
      headerTintColor: '#fff',

    }),
  },

},
  { headerLayoutPreset: 'center' }
  , {
    initialRouteName: 'Search'
  });

module.exports = SearchStack;