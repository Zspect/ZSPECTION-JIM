import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import Inspections from '../Inspections';
import InspectionDetail from '../../Inspector/Inspections/InspectionDetail';
import CreateOfflineBooking from '../../Company/Services/CreateOfflineBooking';
import NotificationBell from '../../../Components/NotificationBell';
import { TouchableOpacity } from 'react-native';
import Icon2 from 'react-native-vector-icons/EvilIcons';
//import InspectorDetails from '../Inspections/InspectorDetails';
import InspectorsList from "../InspectorList";
import InspectorInspectionDetails from '../InspectionDetail'
import InspectorProfile from "../InspectorProfile";
import InspectorAvailability from '../InspectorAvailability';
import Booking from '../Booking';
import InspectionLocationTime from '../../Company/Booking/InspectionLocationTime';
import { InspectionType } from '../../../Api/URI';

const InspectionsStack = createStackNavigator({
  Service: {
    screen: Inspections,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
      headerRight: <NotificationBell />
    })
  },
  InspectorDetailss: {
    screen: InspectorsList,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections Details',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      // headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
      //   <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      // </TouchableOpacity>,
    })
  },

  InspectorInspectionType: {
    screen: InspectionType,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspections Type',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
    }),
  },
  InspectionLocationTime: {
    screen: InspectionLocationTime,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Add location or time',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
    }),
  },
  InspectorBooking: {
    screen: Booking,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Add Booking Information',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      // headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
      //   <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      // </TouchableOpacity>,
    })
  },

  InspectorInspectionDetails: {
    screen: InspectorInspectionDetails,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspection Details',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      // headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
      //   <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      // </TouchableOpacity>,
    })
  },


  InspectorProfilee: {
    screen: InspectorProfile,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspection Details',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
    })
  },


  // InspectorAvailabilityy: {
  //   screen: InspectorAvailability,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: 'Inspection Details',
  //     headerStyle: { backgroundColor: '#28558E' },
  //     headerTintColor: '#FFF',
  //     headerRight: <NotificationBell />,
  //     headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
  //       <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
  //     </TouchableOpacity>,
  //   })
  // },


  // InspectionDetail: {
  //   screen: InspectionDetail,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: 'Inspection Detail',
  //     headerStyle: { backgroundColor: '#28558E' },
  //     headerTintColor: '#FFF',
  //     headerRight: <NotificationBell />,
  //     headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
  //       <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
  //     </TouchableOpacity>,
  //   })
  // },
  // InspectorProfile: {
  //   screen: InspectorDetails,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: 'Inspector Details',
  //     headerStyle: { backgroundColor: '#28558E' },
  //     headerTintColor: '#FFF',
  //     headerRight: <NotificationBell />,
  //     headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
  //       <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
  //     </TouchableOpacity>,
  //   })
  // },

  CreateOfflineBooking: {
    screen: CreateOfflineBooking,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Create Offline Booking',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: <NotificationBell />,
      headerLeft: <TouchableOpacity onPress={() => { navigation.toggleDrawer() }}>
        <Icon2 iconStyle={{ marginLeft: 15, fontWeight: 'normal', }} size={30} color="#FFF" name='navicon' type='material' />
      </TouchableOpacity>,
    })
  }

},
  { headerLayoutPreset: 'center' }
  , {
    initialRouteName: 'Service'
  });

module.exports = InspectionsStack;