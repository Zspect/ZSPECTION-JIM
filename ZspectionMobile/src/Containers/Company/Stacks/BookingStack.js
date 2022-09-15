import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation-stack';

import Services from '../Services';
import CreateOfflineBooking from '../Services/CreateOfflineBooking';
import InspectionDetail from '../Services/InspectionDetail';
import { Icon, Button } from 'react-native-elements';
import CompanyInspectorDetails from '../inspector/CompanyInspectorDetails';

import Icon2 from 'react-native-vector-icons/EvilIcons';
import { TouchableOpacity } from 'react-native';
import InspectionType from '../Booking/InspectionType';
import InspectionLocationTime from '../Booking/InspectionLocationTime';
import InspectionInputDetails from '../Booking/InspectionInputDetails';
import FindInspectorFrInspection from '../Booking/InspectionInputDetails/FindInspectorFrInspection';
import InformationSlider from '../Booking/InspectionInputDetails';
import CompanyListing from '../../RealEstate/Search/CompanyListing';
import SearchSummary from '../../RealEstate/Search/SearchSummary';
import NotificationBell from '../../../Components/NotificationBell';

const BookingStack = createStackNavigator(
  {
    Main: {
      screen: InspectionType,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Inspections Type',
        headerStyle: { backgroundColor: '#28558E' },
        headerTintColor: '#FFF',
        headerLeft: (
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}>
            <Icon2
              iconStyle={{ marginLeft: 15, fontWeight: 'normal' }}
              size={30}
              color="#FFF"
              name="navicon"
              type="material"
            />
          </TouchableOpacity>
        ),
        headerRight: (
          <Icon
            iconStyle={{ marginRight: 15, fontWeight: 'normal' }}
            size={20}
            color="#FFF"
            name="notifications"
            type="material"
          />
        ),
      }),
    },
    InspectionLocationTime: {
      screen: InspectionLocationTime,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Add location or date & time',
        headerStyle: { backgroundColor: '#28558E' },
        headerTintColor: '#FFF',
      }),
    },
    InformationSlider:{
      screen:InformationSlider,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Add Inspection Information',
        headerStyle: { backgroundColor: '#28558E' },
        headerTintColor: '#FFF',
      }),
    },
    // FindInspectorFrInspection:{
    //   screen: FindInspectorFrInspection,
    //   navigationOptions: ({ navigation }) => ({
    //     headerTitle: 'Add Inspection Information',
    //     headerStyle: { backgroundColor: '#28558E' },
    //     headerTintColor: '#FFF',
    //   }),
    // },
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

   

    // Service: {
    //   screen: Services,
    //   navigationOptions: ({ navigation }) => ({
    //     headerTitle: 'Inspections',
    //     headerStyle: {backgroundColor:'#28558E'},
    //     headerTintColor: '#FFF',
    //     headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
    //                   <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
    //                 </TouchableOpacity>,
    //     headerRight: <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={20} color="#FFF" name='notifications' type='material' />
    //   })
    // },
    // InspectionDetail: {
    //   screen: InspectionDetail,
    //   navigationOptions: ({ navigation }) => ({
    //     headerTitle: 'Appointments',
    //     headerStyle: {backgroundColor:'#28558E'},
    //     headerTintColor: '#FFF',
    //   }),
    // },
    // CompanyInspectorDetails: {
    //   screen: CompanyInspectorDetails,
    //   navigationOptions: ({ navigation }) => ({
    //     headerTitle: 'Inspector Detail',
    //     headerStyle: {backgroundColor:'#28558E'},
    //     headerTintColor: '#FFF',
    //   }),
    // },
  },
  { headerLayoutPreset: 'center' },
  {
    initialRouteName: 'Main',
  },
);

module.exports = BookingStack;
