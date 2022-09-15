import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Alert, ActivityIndicator} from 'react-native';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Logout extends Component {
	constructor(props) {
		super(props)
	}
	componentDidMount() {
    // this.getData();
  }

  signout() {
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Yes', onPress: () => this.getData()},
      ],
      {cancelable: false},
    );
  }
  
  async getData() {
    await AsyncStorage.removeItem('roleid');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('profile');
    this.props.navigation.navigate('UserSelection');
  }

  render() {
    return (
      <Icon
        reverse
        name='power-off'
        type='font-awesome'
        color='#28558E'
        size={16}
        containerStyle={{position:'absolute',right:20,top:10}}
        onPress={() => this.signout()}
      />
    );
  }
}
export default withNavigation(Logout);