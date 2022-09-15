import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class Auth extends Component {
	constructor(props) {
	   super(props);
	}
	componentDidMount() {
	   this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		const userid = await AsyncStorage.getItem('userid');
		console.log("User token found in Auth/Container:" , userid);
	   	this.props.navigation.navigate(userid ? 'DashboardStack' : 'LoginStack');
	};

  	render() {
    	return(
    		<View>
    			<StatusBar barStyle="light-content" />
    			<ActivityIndicator />
    		</View>
    	)
  	}
}

