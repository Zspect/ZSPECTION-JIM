import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import Splash from '../Containers/Splash';
import { withNavigation } from 'react-navigation';
import Notification from './Notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { COMPANY_ROLE, INSPECTOR_ROLE, REAL_AGENT_ROLE, ROLE_ID } from '../utils';
import SplashScreen from 'react-native-splash-screen'

class Auth extends Component {
	constructor(props) {
		super(props);
	}
	componentDidMount() {
		SplashScreen.hide();
		this._bootstrapAsync();
	}

	_bootstrapAsync = async () => {
		let installedVersion = await AsyncStorage.getItem("appVersion");
		let currentVersion = await DeviceInfo.getVersion();

		console.log("Installed version : ", installedVersion)
		console.log("Current version : ", currentVersion)

		var role = await AsyncStorage.getItem("role");
		var userId = await AsyncStorage.getItem("userid");
		console.log("Role found in Auth / Component : ", role)
		console.log("UserId found in Auth / Component : ", userId)
		console.log("Installed version in Auth / Component : ", installedVersion)
		console.log("Current version in Auth / Component : ", currentVersion)
		if (installedVersion == null || (installedVersion != currentVersion)) {
			await AsyncStorage.removeItem('roleid');
			await AsyncStorage.removeItem('userid');
			await AsyncStorage.removeItem('authToken');
			await AsyncStorage.removeItem('profile');
			this.props.navigation.navigate('UserSelection');
			console.log("Logout done successfully.");
		} else {
			//setTimeout(() => {
				console.log("role_id >>",role,userId)
				if (role && userId !== null) {
					if (role == REAL_AGENT_ROLE) {
						this.props.navigation.navigate('RealEstateHome');
					}
					else if (role == COMPANY_ROLE) {
						this.props.navigation.navigate('CompanyHome');
					}
					else if (role == INSPECTOR_ROLE) {
						this.props.navigation.navigate('InspectorHome');
					}
				}
				else {
					this.props.navigation.navigate('UserSelection');
				}
		//	}, 800)
		}

	};

	render() {
		return (
			<View>
				<StatusBar backgroundColor="#28558E" barStyle="light-content" />
				{/* <Splash /> */}
				{/* <Notification /> */}
			</View>
		)
	}
}

export default withNavigation(Auth);