import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  createStackNavigator,
} from 'react-navigation-stack';
import CompanyPriceMatrix from '../CompanyPriceMatrix';
import Icon2 from 'react-native-vector-icons/EvilIcons';

const CompanyPriceMatrixStack = createStackNavigator({
  ComPriceMatrix: {
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
    initialRouteName: 'ComPriceMatrix'
  });

module.exports = CompanyPriceMatrixStack;