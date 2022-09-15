import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import InspectorPriceMatrix from '../Inspections/InspectorPriceMatrix';
import  Icon2 from 'react-native-vector-icons/EvilIcons';
import { TouchableOpacity } from 'react-native';
const InspectorPriceMatrixStack = createStackNavigator({
  InspectorPriceMatrix: {
    screen: InspectorPriceMatrix,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Inspector Price Matrix',
      headerStyle: {backgroundColor:'#28558E'},
      headerTintColor: '#FFF',
      headerLeft: <TouchableOpacity onPress={()=>{navigation.toggleDrawer()}}>
                        <Icon2 iconStyle={{ marginLeft:15, fontWeight:'normal',}} size={30} color="#FFF" name='navicon' type='material'/>
                      </TouchableOpacity>,
    })
  }
 
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'InspectorPriceMatrix'
});

module.exports = InspectorPriceMatrixStack;