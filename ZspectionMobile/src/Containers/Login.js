import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
	Container, Header, Content, Button, Card, CardItem,
	Icon, Text, Body, Form, Item, Input
} from 'native-base';
import { CheckBox } from 'react-native-elements';
import Errors from '../Components/Errors';
import Loader from '../Components/Loader';
import Notification from '../Components/Notification';
import Social from '../Components/Social';
import Common from '../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';
import { API } from "../network/API";
import { COMPANY_ROLE, INSPECTOR_ROLE, REAL_AGENT_ROLE, ROLE_ID, showToastMsg } from '../utils.js';
import colors from '../utils/colors.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default class Login extends Social {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			role: 0,
			errors: [],
			remember: false,
			roleLink: '',
			loading: false,
			passwordShow: true
		}
		this.common = new Common();
	}

	componentDidMount() {
		var role = this.props.navigation.getParam('role');
		console.log("Role on login screen: ", role);
		this.setState({ role: role });
		this.getRoleLink(role);
	}

	async getRoleLink(role) {
		// await AsyncStorage.clear();
		await AsyncStorage.setItem('role', role.toString());
		if (role == REAL_AGENT_ROLE) {
			this.setState({ roleLink: 'Register' })
		}
		else if (role == COMPANY_ROLE) {
			this.setState({ roleLink: 'RegisterCompanySecond' })
		}
		// 4 is for inspector , no need to register directly.
	}

	navigateToRegister() {
		// this.props.navigation.navigate("InspectorRegisterMatrix");
		// this.props.navigation.navigate("CreateInspector")
		// this.props.navigation.navigate("Maps")

		console.log("dnkdbsabdsadjsada >>", this.state.roleLink)
		this.props.navigation.navigate(this.state.roleLink, {
			roleID: this.state.role
		});
		//  this.props.navigation.navigate("CompanyTrial");
		// this.props.navigation.navigate('RealEstateHome')
		// this.props.navigation.navigate("Inspector");
		// this.props.navigation.navigate("InspectorDetails");
		// this.props.navigation.navigate("CreateOfflineBooking");
		// this.props.navigation.navigate("RealEstateInspection");
		// this.props.navigation.navigate("CompanyInspection");

	}

	printFooter() {
		if (this.state.role == 3 || this.state.role == 1) {
			return (
				<View>
					{/* <View style={styles.orWrapper}>
						<View style={styles.orLine}></View>
						<View style={styles.orTextContainer}>
							<Text>OR</Text>
						</View>
						<View style={styles.orLine}></View>
					</View>
					<Text style={styles.loginWithStyle}>LOGIN WITH</Text>
					<View style={styles.socialWrapper}>
						<TouchableOpacity onPress={() => this.facebookLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/facebook.png')} /></TouchableOpacity>
						<TouchableOpacity onPress={() => this.twitterLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/twitter.png')} /></TouchableOpacity>
						<TouchableOpacity onPress={() => this.googleLogin()}><Image style={styles.loginSocialImage} source={require('../../assets/images/googleplus.png')} /></TouchableOpacity>
					</View> */}
					<View style={styles.newUserWrapper}>
						<TouchableOpacity><Text>New User! </Text></TouchableOpacity>
						<Text>then </Text>
						<TouchableOpacity onPress={() => this.navigateToRegister()}><Text style={styles.primaryColor}>SIGN UP</Text></TouchableOpacity>
					</View>
				</View>
			)
		}
	}
	validateEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
			return true;
		}
		return false;
	}

	validate() {
		var messages = [];
		messages.push(!this.state.username && 'Email required');
		messages.push(!this.state.password && 'Password required');
		if (this.state.username && !this.validateEmail(this.state.username)) {
			messages.push('Invalid Email');
		}

		messages = messages.filter((msg) => {
			if (msg) {
				return msg;
			}
		})
		this.setState({ errors: messages });
		if (messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}


	async success(profile) {
		// await AsyncStorage.setItem("roleid", profile.RoleId); // will discuss later
		console.log('Login profile is : ', profile);
		let version = await DeviceInfo.getVersion();
		await AsyncStorage.setItem("userid", profile.userId.toString());
		await AsyncStorage.setItem("companyId", profile.companyId.toString());
		await AsyncStorage.setItem("inspectorID", profile.inspectorId.toString());
		await AsyncStorage.setItem("authToken", profile.token);
		await AsyncStorage.setItem('role', profile.roleId.toString())
		await AsyncStorage.setItem('reAgentID', profile.reAgentId.toString())
		await AsyncStorage.setItem('appVersion', version);
		console.log("Current version installed is ", await AsyncStorage.getItem("appVersion"))
		if (profile.inspectorId !== undefined) {
			await AsyncStorage.setItem('inspectorID', profile.inspectorId.toString())
		}
		//this.common.showToast(profile.message);
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
		console.log("bsbdsabdsabdjsa >>", this.state.role)
		if (this.state.role == REAL_AGENT_ROLE) {
			this.props.navigation.navigate('RealEstateHome')
		}
		else if (this.state.role == COMPANY_ROLE) {
			this.props.navigation.navigate('CompanyHome')
		}
		else if (this.state.role == INSPECTOR_ROLE) {
			this.props.navigation.navigate('InspectorHome')
		}
		this.setState({ loading: false });
	}

	loginRes = {
		success: (response) => {
			console.log("login_res>>>", response)
			this.success(response.data);
		},
		error: (error) => {
			console.log("login_res_error>>>", error)
			showToastMsg(error.message)
			this.setState({ loading: false })
		}
	}

	Login = async () => {
		if (!this.state.username) {
			this.common.showToast('Please Enter your Email ID')
			this.email.focus()
		}
		else if (this.state.username && !this.common.validateEmail(this.state.username.trim())) {
			this.common.showToast('Please enter valid Email ID');
			this.email.focus()
		}
		else if (!this.state.password) {
			this.common.showToast('Please Enter your Password')
			this.password.focus()
		}
		else {
			//	this.setState({ loading: true });
			this.getRequestData().then((data) => {
				this.setState({ loading: true })
				API.login(this.loginRes, data)
			})
			// let data = {
			// 	"username": this.state.username,
			// 	"password": this.state.password
			// }

			// await this.getRequestData().then(data => {
			// 	console.log("login request: ", data);
			// 	var response = new API('CompanyLogin', data).getResponse();
			// 	console.log("login result: ", response);
			// 	response.then(result => {
			// 		if (result.response == 201) {
			// 			this.success(result);
			// 		}
			// 		else {
			// 			var errors = [];
			// 			errors.push(result.response.data.message);
			// 			this.common.showToast(result.response.data.message)
			// 			this.setState({ loading: false });
			// 		}
			// 	})
			// });
		}
	}


	async getRequestData() {
		const deviceId = await AsyncStorage.getItem("deviceId");
		const fcmToken = await AsyncStorage.getItem("fcmToken");
		console.log("role_iddddd >>", this.state.role)
		//	let roleType = this.state.role == 2 ? 1 : this.state.role == 3 ? 3 : 2
		return {
			"username": this.state.username.trim(),
			"password": this.state.password,
			// "roleid": this.state.role
			"roleId": this.state.role
		}
	}


	render() {
		return (
			<ScrollView>
				<View>
					<View style={styles.loginTopContainer}>
						<View style={styles.loginSearchIconWrapper}>
							<Image style={styles.loginSearchIcon} resizeMode="contain" source={require('../../assets/images/search.png')} />
						</View>
					</View>
					<View style={styles.loginCardContainer}>
						<Card style={styles.loginCard}>
							<View style={[styles.wid100, styles.loginCardWraper]}>
								<View style={styles.center}>
									<View style={styles.loginTextWrapper}><Text style={styles.loginText}>Log in</Text></View>
								</View>
								<View style={styles.loginFormWrapper}>
									<Form>
										<Errors errors={this.state.errors} />
										<Item>
											<Icon active name='person' style={styles.greyColor} />
											<Input keyboardType="email-address" autoCompleteType="off" ref={email => { this.email = email }} placeholder="Email" value={this.state.username} onChangeText={(text) => this.setState({ 'username': text })} style={styles.font15} autoCapitalize='none' />
										</Item>
										<Item>
											<Icon type="MaterialIcons" name='lock' style={styles.greyColor} />
											<View style={{ flexDirection: 'row', width: '90%', }}>
												<Input autoCompleteType="off"
													ref={password => { this.password = password }}
													secureTextEntry={this.state.passwordShow} value={this.state.password}
													placeholder="Password"
													onChangeText={(text) => this.setState({ 'password': text })}
													style={styles.font15} autoCapitalize='none' />
												<TouchableOpacity style={{ marginTop: 16 }}
													onPress={() => this.setState({
														passwordShow: !this.state.passwordShow
													})}>
													<MaterialCommunityIcons name={this.state.passwordShow ? 'eye-off' : 'eye'} color='black' size={20} />
												</TouchableOpacity>
											</View>
										</Item>
									</Form>
								</View>
								<View style={[styles.rememberAndForgotWrapper]}>
									<View style={styles.row}>
										{/* <CheckBox checked={this.state.remember} onPress={() => this.setState({ remember: !this.state.remember })} checkedColor="#28558E" size={16} containerStyle={styles.loginContainerStyle} color="#808080" style={styles.loginCheckbox} />
										<Text style={[styles.greyColor, styles.font14]}>Remember Me</Text> */}
									</View>
									<View>
										<TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword', { role: this.state.role })}>
											<Text style={[styles.greyColor, styles.font14, { color: colors.toolbar_bg_color }]}>Forgot Password?</Text>
										</TouchableOpacity>
									</View>
								</View>

								<View style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
								}}>
									{this.state.loading ? <ActivityIndicator color={colors.toolbar_bg_color} size='large' style={{ marginVertical: 15 }} /> :
										<TouchableOpacity style={{
											width: 100, height: 40, borderRadius: 15,
											backgroundColor: colors.toolbar_bg_color, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 20
										}}
											onPress={() => this.Login()}>
											<Text style={{ color: colors.white, fontSize: 15 }}>Log in</Text>
										</TouchableOpacity>
									}
								</View>
							</View>
						</Card>
					</View>
					<View style={styles.loginBottomContainer}>
						<View style={styles.loginFooter}>
							{this.printFooter()}
						</View>
					</View>
				</View>
			</ScrollView>
		);
	}
}