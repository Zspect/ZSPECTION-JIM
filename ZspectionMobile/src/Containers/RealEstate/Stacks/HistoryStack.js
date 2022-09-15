import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';

import History from '../History';
import { Button, Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import NotificationBell from '../../../Components/NotificationBell';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import Icon2 from 'react-native-vector-icons/EvilIcons';
import AgentInspectionDetails from '../AgentInspectionDetails';
import REAInspectorDetails from '../../RealEstate/HistoryList/REAInspectorDetails'

const HistoryStack = createStackNavigator({
  HistoryMain: {
    screen: History,
  },
  REAInspectorDetailsMain: {
    screen: REAInspectorDetails,
  },
  AgentInspectionDetailsMain: {
    screen: AgentInspectionDetails,
  }
  // History2: {
  //   screen: History,
  //   navigationOptions: ({ navigation }) => ({
  //     headerTitle: 'Inspection History',
  //     headerStyle: {backgroundColor:'#28558E'},
  //     headerTintColor: '#FFF',
  //     headerRight: <NotificationBell />,
  //     headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
  //     <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
  //   </TouchableOpacity>,
  //   })
  // },
  // InspectorDetail: {
  //   screen: InspectorDetail,
  //   navigationOptions: ({ navigation }) => ({
  //       headerTitle: 'Inspector Detail',
  //       headerStyle: {backgroundColor:'#28558E'},
  //       headerTintColor: '#FFF',
  //       headerRight: <Text style={{color:'#FFF', marginRight:10, fontSize:12}}>Holiday / Leave</Text>
  //   })
  // }
},
  {
    headerLayoutPreset: 'center',
    headerMode: 'none'
  }
  , {
    initialRouteName: 'HistoryMain'
  });

module.exports = HistoryStack;