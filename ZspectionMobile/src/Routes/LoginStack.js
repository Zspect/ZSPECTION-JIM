import React, { Component } from 'react';
import {
  createStackNavigator,
} from 'react-navigation-stack';


import Login from '../Containers/Login';
import Register from '../Containers/Register';
import RegisterCompany from '../Containers/RegisterCompany';
import Logout from '../Components/Logout';
import UserSelection from '../Containers/UserSelection';
import ForgotPassword from '../Containers/ForgotPassword';
import ChangePassword from '../Containers/ChangePassword';
import RegisterCompanySecond from '../Containers/RegisterCompanySecond';
import ResetPassword from '../Containers/ResetPassword';

const LoginStack = createStackNavigator({
  UserSelection: {
    screen: UserSelection,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  Logout: {
    screen: Logout,
    navigationOptions: ({ navigation }) => ({
      header: null,
    })
  },
  Login: {
    screen: Login,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Login',
      header: null,
    })
  },
  Register: {
    screen: Register,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Sign Up',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Forgot Password',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },
  ResetPassword:{
    screen: ResetPassword,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Reset Password',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },

  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Change Password',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },
  RegisterCompany: {
    screen: RegisterCompany,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Sign Up',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },
  RegisterCompanySecond: {
    screen: RegisterCompanySecond,
    navigationOptions: ({ navigation }) => ({
      headerTitle: 'Sign Up',
      headerStyle: {
        backgroundColor:'#28558E',
      },
      headerTintColor: '#fff',
    })
  },
  
},
{headerLayoutPreset: 'center'}
,{
    initialRouteName: 'UserSelection'
});

module.exports = LoginStack;