import React from 'react';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { CheckBox, Avatar, Input, Icon  } from 'react-native-elements';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import InspectionStack from '../Containers/Inspector/Stacks/InspectionStack';
import InspectorDetails from '../Containers/Company/inspector/InspectorDetail';
import { createStackNavigator } from 'react-navigation-stack';
import InspectorBooking from '../Containers/Company/inspector/InspectorBooking';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
const offlineBookingStack = createStackNavigator({
  // OfflineBookingInspector:{
  //   screen: InspectorDetails,
  //     navigationOptions: ({ navigation }) => ({
  //       headerTitle:'Inspector',
  //       headerStyle: {backgroundColor:'#28558E'},
  //       headerTintColor: '#FFF',
  //       headerTitleContainerStyle:{justifyContent:'center'}
  //     }),
  // },
  InspectorBooking: {
      screen: InspectorBooking,
      navigationOptions: ({ navigation }) => ({
        headerTitle:'Create Offline Booking',
        headerStyle: {backgroundColor:'#28558E'},
        headerTintColor: '#FFF',
        headerTitleContainerStyle:{justifyContent:'center'},
        headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
        <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
      </TouchableOpacity>,
      }),
    },
  })
export default createBottomTabNavigator(
  {
    Inspections: InspectionStack,
  },
  {
    initialRouteName:'Inspections',
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        console.log("Bottom route name :",routeName)
        let iconName;
        if (routeName === 'Inspections') {
          iconName = 'user-secret';
        }
        else if(routeName==='OfflineBooking'){
          iconName = 'calendar';
        }
        return <Icon type='font-awesome' name={iconName}  size={20} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#fff',
      activeBackgroundColor:'#B9183A',
      inactiveTintColor: '#fff',
      style: {
        backgroundColor: '#28558E',
      },
      labelStyle: {
        fontSize: 12,
        marginBottom:3
      },
    },
  }
);