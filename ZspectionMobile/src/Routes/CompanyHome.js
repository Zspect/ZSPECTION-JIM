import React from 'react';
import {Button, Text, View, TouchableOpacity, StyleSheet} from 'react-native';
import {CheckBox, Avatar, Input, Icon} from 'react-native-elements';
import {createAppContainer} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import Notification from '../Containers/Company/Notification';
import ServicesStack from '../Containers/Company/Stacks/ServicesStack';
import ProfileStack from '../Containers/Company/Stacks/CompanyProfileStack';
import InspectorStack from '../Containers/Company/Stacks/InspectorStack';
import CreateOfflineBooking from '../Containers/Company/Services/CreateOfflineBooking';
import {createStackNavigator} from 'react-navigation-stack';
import CompanyInspectorList from '../Containers/Company/inspector/CompanyInspectorList';
import CompanyInspectorDetails from '../Containers/Company/inspector/CompanyInspectorDetails';
//import CreateInspector from '../Containers/Company/inspector/CreateInspector';
import Icon2 from 'react-native-vector-icons/EvilIcons';
const offlineBookingStack = createStackNavigator({
  // OfflineBookingInspectorsList:{
  //   screen: CompanyInspectorList,
  //     navigationOptions: ({ navigation }) => ({
  //       headerTitle:'Company Inspectors',
  //       headerStyle: {backgroundColor:'#28558E'},
  //       headerTintColor: '#FFF',
  //       headerTitleContainerStyle:{justifyContent:'center'}
  //     }),
  // },
  CompanyOfflineBooking: {
    screen: CreateOfflineBooking,
    navigationOptions: ({navigation}) => ({
      headerTitle: 'Offline Booking',
      headerStyle: {backgroundColor: '#28558E'},
      headerTintColor: '#FFF',
      headerTitleContainerStyle: {justifyContent: 'center'},
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            navigation.toggleDrawer();
          }}>
          <Icon2
            iconStyle={{marginLeft: 15, fontWeight: 'normal'}}
            size={30}
            color="#FFF"
            name="navicon"
            type="material"
          />
        </TouchableOpacity>
      ),
    }),
  },
});

export default createBottomTabNavigator(
  {
    Services: ServicesStack,
    Inspectors: InspectorStack,
    OfflineBooking: offlineBookingStack,
  },
  {
    initialRoutename: 'Services',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, horizontal, tintColor}) => {
        const {routeName} = navigation.state;
        console.log('Route name : ', routeName);
        let iconName;
        if (routeName === 'Profile') {
          iconName = 'user';
        } else if (routeName === 'Services') {
          iconName = 'gear';
        } else if (routeName === 'Inspectors') {
          iconName = 'user-secret';
        } else if (routeName === 'History') {
          iconName = 'history';
        } else if (routeName === 'Notification') {
          iconName = 'bell';
        } else if (routeName === 'OfflineBooking') {
          iconName = 'calendar';
        }
        return (
          <Icon
            type="font-awesome"
            name={iconName}
            size={20}
            color={tintColor}
          />
        );
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor: 'red',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom: 3,
      },
      // tabStyle: {
      //   justifyContent:'space-around'
      // }
    },
  },
);
