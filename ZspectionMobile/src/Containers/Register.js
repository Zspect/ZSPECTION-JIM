import React, { Component, createRef } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, PermissionsAndroid, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
	Container, Header, Content, Button, Card, CardItem,
	Text, Body, Form, Item, Root
} from 'native-base';
import { CheckBox, Avatar, Input, Icon } from 'react-native-elements';
import Errors from '../Components/Errors';
import Loader from '../Components/Loader';
import GoogleSearch from '../Components/GoogleSearch';
import Common from '../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ifEmailExists, showToastMsg } from '../utils.js';
import ImageResizer from 'react-native-image-resizer';
import { API } from "../network/API";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import { formatPhoneNumber } from '../utils/utils.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from '../utils/colors.js';

const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
	mediaType: 'photo',
	cameraType: 'back'
};
const optionsGallery = {
	noData: true,
	mediaType: 'photo',
};

export default class Register extends Component {
	constructor(props) {
		super(props)
		console.log("dsadsadsbajd >>", this.props.navigation.state.params.roleID)
		this.state = {
			mapAddress: [],
			avatarSource: '',
			profilePic: '',
			errors: [],
			fname: '',
			lname: '',
			title: '',
			email: '',
			phone: '',
			agencyName: '',
			assistantName: '',
			assistantEmail: '',
			address: '',
			password: '',
			confirmPassword: '',
			role: 1,
			loading: false,
			submit: false,
			pic_data: {},
			passwordISShow: true,
			confirmPAssIsShow: true,
			draLicenseNo: '',
		}
		this.common = new Common();
	}

	async success(profile) {
		console.log("RealEstate Result : ", profile);
		await AsyncStorage.setItem("roleid", profile.reagentId.toString()); // agentID
		await AsyncStorage.setItem("userid", profile.userId.toString()); // userID
		await AsyncStorage.setItem("authToken", profile.token);
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
		console.log("Agent Id : ", profile.reagentId.toString())
		console.log("User Id : ", profile.userId.toString())
		this.props.navigation.navigate('RealEstateHome', { "profile": profile })
		// this.setState({ loading: false }, async () => {
		// 	if (this.state.profilePic !== "") {
		// 		this.setState({ loading: true });
		// 		let picData = this.state.pic_data;
		// 		var body = new FormData();
		// 		let fileNAmeSplit = picData.fileName.split('.')
		// 		//body.append('Id', profile.reagentId)
		// 		body.append('File', {
		// 			uri: Platform.OS === 'android' ? 'file://' + picData.path : picData.uri.replace('file://', ''),
		// 			name: fileNAmeSplit[0],
		// 			type: picData.type
		// 		});
		// 		console.log("image_upload >>", body)
		// 		API.uploadProfilePic(this.uploadProfilePic, body, profile.reagentId)
		// 		// var photoResult = await new API('UploadAgentPic', body).getResponse2("/" + profile.resultID1.toString());
		// 		// console.log("Photo Result : ", photoResult);
		// 		// if (photoResult.response == 201) {
		// 		// 	this.setState({ loading: false })
		// 		// 	this.common.showToast(photoResult.message)
		// 		// 	this.props.navigation.navigate('RealEstateHome', { "profile": profile })
		// 		// } else {
		// 		// 	this.setState({ loading: false })
		// 		// 	this.common.showToast(photoResult.message)
		// 		// }
		// 	} else {
		// 		this.props.navigation.navigate('RealEstateHome', { "profile": profile })
		// 	}
		// });
	}

	uploadProfilePic = {
		success: (response) => {
			console.log("upload_pics", response)
			showToastMsg(response.message)
			this.setState({ loading: false });
			this.props.navigation.navigate('Login')
		},
		error: (error) => {
			console.log("upload_pics_error>>>", error)
			this.setState({ loading: false });

		}
	}

	componentDidMount() {
		console.log("On Agent register screen");
	}

	onRegister = async () => {

		if (!this.state.fname) {
			this.common.showToast('Please enter your First Name');
			this.fname.focus()
		}
		else if (!this.state.lname) {
			this.common.showToast('Please enter your Last Name');
			this.lname.focus()
		}
		else if (!this.state.title) {
			this.common.showToast('Please enter your Title');
			this.title.focus()
		}
		else if (!this.state.email) {
			this.common.showToast('Please enter your Email ID');
			this.email.focus()
		}
		else if (this.state.email && !this.common.validateEmail(this.state.email)) {
			this.common.showToast('Please enter valid Email ID');
			this.email.focus()
		}
		else if (!this.state.phone) {
			this.common.showToast('Please enter your Phone Number');
			this.phone.focus()
		}
		else if (this.state.phone.length < 13) {
			this.common.showToast('Please enter valid Phone Number');
			this.phone.focus()
		}
		else if (!this.state.agencyName) {
			this.common.showToast('Please enter your Agency Name');
			this.agencyName.focus()
		}
		else if (this.state.assistantEmail && !this.common.validateEmail(this.state.assistantEmail)) {
			this.common.showToast('Please enter valid assistant Email ID');
			this.assistantEmail.focus()
		}
		else if (!this.state.address) {
			this.common.showToast('Please enter your Address');
			this.address.focus()
		}
		else if (!this.state.draLicenseNo) {
			this.common.showToast('Please enter your DRE License no');
			this.draLicenseNoRef.focus()
		}
		else if (!this.state.password) {
			this.common.showToast('Please enter your Password');
			this.password.focus()
		}
		else if (!this.state.confirmPassword) {
			this.common.showToast('Please enter your Confirm Password');
			this.confirmPassword.focus()
		}
		else if (this.state.password != this.state.confirmPassword) {
			this.common.showToast('Password cannot be same');
			this.confirmPassword.focus()
		}
		else {
			//this.setState({ loading: true })
			await this.getRequestData().then(data => {
				console.log("request : ", data);


				API.signUp(this.signupRes, data)
			});
			//}
			// let res = await ifEmailExists(this.state.email);
			// this.setState({ loading: false })
			// console.log("Validate email response is :", res);
			// if (res.values && res.values == true) {
			// 	this.setState({ loading: true });
			// 	await this.getRequestData().then(data => {
			// 		console.log("request : ", data);
			// 		var response = new API('RegisterEstateAgent', data).getResponse();
			// 		console.log("Register agent api response : ", response);
			// 		response.then(result => {
			// 			if (result.response == 201) {
			// 				this.success(result);
			// 			}
			// 			else {
			// 				this.common.showToast(result.message)
			// 				this.setState({ loading: false });
			// 			}
			// 		})
			// 	});
			// }
			// else {
			// 		this.email.focus();
			// 		this.common.showToast('Email address already exists!')
			// 	}
		}
		return false;
	}


	uploadAgentProfilePic = {
		success: (response) => {
			console.log("response_image>data>>>", response)
		},
		error: (error) => {
			console.log("error>data>>>", response)

		}
	}

	signupRes = {
		success: (response) => {
			console.log("login_res>>>", response)
			showToastMsg(response.message)
			this.success(response.data);
			this.setState({ loading: false })

			if (response.code == 1000) {
				let data = {
					uri: Platform.OS === 'android' ? this.state.pic_data.uri : this.state.pic_data.uri.replace('file://', ''),
					name: this.state.pic_data.fileName,
					type: this.state.pic_data.type
				}
				console.log("profile_pci >> ", this.state.pic_data)
				var body = new FormData();
				body.append('File', data);
				API.uploadAgentProfilePic(this.uploadAgentProfilePic, body, response.data.reagentId)
				this.props.navigation.navigate('Login')
			} else {

			}

		},
		error: (error) => {
			console.log("login_res_error>>>", error)
			showToastMsg(error.message)
			this.setState({ loading: false })
		}
	}

	async getRequestData() {
		let roleType = this.state.role == 2 ? 1 : this.state.role == 3 ? 3 : 2
		return {
			"firstName": this.state.fname,
			"lastName": this.state.lname,
			"agencyName": this.state.agencyName,
			"title": this.state.title,
			"emailId": this.state.email,
			//"userID": 0,
			"mobileNumber": this.state.phone,
			"assistantName": this.state.assistantName,
			"assistantEmail": this.state.assistantEmail,
			"address": this.state.address,
			"state": this.state.state,
			"city": this.state.city,
			"zipCode": this.state.zipcode,
			"password": this.state.password,
			"isActive": true,
			"roleId": this.state.role,
			"dreLicenseNo":this.state.draLicenseNo
		}
	}

	requestCameraPermission = async () => {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.CAMERA,
				{
					title: 'ZSPECTION Camera Permission',
					message:
						'ZSPECTION needs access to your camera ' +
						'to set profile picture.',
					buttonNegative: 'Cancel',
					buttonPositive: 'OK',
				},
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				console.log('You can use the camera');
				//this.UploadPicture();
				actionSheetRef.current?.setModalVisible(true);
			} else {
				console.log('Camera permission denied');
			}
		} catch (err) {
			console.warn(err);
		}
	}

	async photoFromGallery() {
		const result = await launchImageLibrary(optionsGallery);
		this.imageResize(result)
		console.log("image_first>", result);
	}
	async photoUsingCamera() {
		const result = await launchCamera(optionsCamera);
		this.imageResize(result)
	}
	async imageResize(resp) {
		console.log('Picker Response = ', resp);
		if (resp.didCancel) {
			console.log('User cancelled image picker');
		} else if (resp.error) {
			console.log('ImagePicker Error: ', resp);
		} else if (resp.customButton) {
			console.log('User tapped custom button: ', resp.customButton);
		} else {
			this.setState({ loading: true })
			let response = resp.assets[0]
			console.log('response: ', response);

			ImageResizer.createResizedImage(response.uri, 300, 300, 'PNG', 100).then((response2) => {
				const source = { uri: response2.uri };
				let imageData = {};
				imageData['fileName'] = response.fileName;
				imageData['fileSize'] = response2.size;
				imageData['height'] = response2.height;
				imageData['isVertical'] = response.isVertical;
				imageData['originalRotation'] = response.originalRotation;
				imageData['path'] = response.path;
				imageData['type'] = response.type;
				imageData['uri'] = response.uri;
				imageData['width'] = response2.width;
				this.setState({ pic_data: imageData, avatarSource: source, profilePic: response2.uri, loading: false }, () => {
					console.log("Picture data is :", this.state.pic_data)
					let data = {
						uri: Platform.OS === 'android' ? 'file://' + imageData.path : imageData.uri.replace('file://', ''),
						name: imageData.imageData,
						type: imageData.type
					}
					console.log("adnksda >", data)
				});
			})
		}
	}


	mapAddress = (data, details) => {
		this.setState({ address: data.description, mapAddress: details })
		var parseAdderss = this.common.parseAddress(details);
		this.setState({
			zipcode: parseAdderss.zipcode,
			state: parseAdderss.state,
			city: parseAdderss.city,
		})
	}


	render() {
		if (this.state.loading) {
			return <Loader />
		}
		var fname = !this.state.fname && this.state.submit ? true : false;
		var lname = !this.state.lname && this.state.submit ? true : false;
		var title = !this.state.title && this.state.submit ? true : false;
		var email = !this.state.email && this.state.submit ? true : false;
		var phone = !this.state.phone && this.state.submit ? true : false;
		var agencyName = !this.state.agencyName && this.state.submit ? true : false;
		var assistantName = !this.state.assistantName && this.state.submit ? true : false;
		var assistantEmail = !this.state.assistantEmail && this.state.submit ? true : false;
		var address = !this.state.address && this.state.submit ? true : false;
		var password = !this.state.password && this.state.submit ? true : false;
		var draLicenseNo = !this.state.draLicenseNo && this.state.submit ? true : false;
		var confirmPassword = !this.state.confirmPassword && this.state.submit ? true : false;


		return (
			<Root>
				<ScrollView keyboardShouldPersistTaps='always'
					ref='_scrollView'
				>
					<View style={styles.container}>
						<View style={styles.registerImageContainer}>
							<Avatar
								size={100}
								onPress={() => this.requestCameraPermission()}
								overlayContainerStyle={{ backgroundColor: '#FFF' }}
								rounded icon={{ name: 'person', color: '#C39666', size: 72 }}
								containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
								source={this.state.avatarSource}
								imageProps={{ resizeMode: 'cover' }}
							/>
						</View>
						<View>
							<Form>
								{/* <Errors errors={this.state.errors} /> */}
								<View style={styles.sectionRow}>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" ref={fname => { this.fname = fname }} inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.common.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
									</View>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" ref={lname => { this.lname = lname }} inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.common.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
									</View>
								</View>
								<Input autoCompleteType="off" ref={title => { this.title = title }} inputContainerStyle={title && styles.inputError} rightIcon={title && this.common.getIcon()} errorMessage={title && "Title required"} value={this.state.title} onChangeText={(text) => this.setState({ 'title': text })} placeholder="Title (Real State Agent, Broker, etc)" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" ref={email => { this.email = email }} keyboardType="email-address" inputContainerStyle={email && styles.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[styles.font15]} autoCapitalize='none' />
								<Input autoCompleteType="off" ref={phone => { this.phone = phone }}
									keyboardType="numeric"
									inputContainerStyle={phone && styles.inputError}
									rightIcon={phone && this.common.getIcon()}
									errorMessage={phone && "Mobile No required"}
									maxLength={14}
									value={this.state.phone}
									onChangeText={(text) => this.setState({ 'phone': formatPhoneNumber(text) })}
									placeholder="Mobile Number" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" ref={agencyName => { this.agencyName = agencyName }} inputContainerStyle={agencyName && styles.inputError} rightIcon={agencyName && this.common.getIcon()} errorMessage={agencyName && "Agency name required"} value={this.state.agencyName} onChangeText={(text) => this.setState({ 'agencyName': text })} placeholder="Agency Name" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" ref={assistantName => { this.assistantName = assistantName }} inputContainerStyle={assistantName && styles.inputError} rightIcon={assistantName && this.common.getIcon()} errorMessage={assistantName && "Assistance name required"} value={this.state.assistantName} onChangeText={(text) => this.setState({ 'assistantName': text })} placeholder="Assistance Name" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" ref={assistantEmail => { this.assistantEmail = assistantEmail }} keyboardType="email-address" inputContainerStyle={assistantEmail && styles.inputError} rightIcon={assistantEmail && this.common.getIcon()} errorMessage={assistantEmail && "Assistance email required"} value={this.state.assistantEmail} onChangeText={(text) => this.setState({ 'assistantEmail': text })} placeholder="Assistance Email" inputStyle={[styles.font15]} />
								<GoogleSearch value={this.state.address} mapAddress={this.mapAddress.bind(this)} />
								<View style={[styles.twoRow]}>
									<Input autoCompleteType="off" ref={stateName => { this.stateName = stateName }} containerStyle={styles.threeRow} onChangeText={(text) => this.setState({ 'state': text })} placeholder="State" value={this.state.state} inputStyle={[styles.font15]} />
								</View>
								<View style={styles.sectionRow}>
									<View style={[styles.threeRow]}>
										<Input autoCompleteType="off" ref={cityName => { this.cityName = cityName }} containerStyle={styles.threeRow} onChangeText={(text) => this.setState({ 'city': text })} placeholder="City" value={this.state.city} inputStyle={[styles.font15]} />
									</View>
									<View style={[styles.threeRow]}>
										<Input autoCompleteType="off" ref={zipCode => { this.zipCode = zipCode }} containerStyle={styles.threeRow} keyboardType="numeric" value={this.state.zipcode} onChangeText={(text) => this.setState({ 'zipcode': text })} placeholder="Zip" inputStyle={[styles.font15]} />
									</View>
								</View>
								{/* <Input autoCompleteType="off" inputContainerStyle={address && styles.inputError} rightIcon={address && this.common.getIcon()} errorMessage={address && "Address required"} value={this.state.address} onChangeText={(text) => this.setState({'address': text})}  placeholder="Address" inputStyle={[styles.font15]}  /> */}

								<Input autoCompleteType="off"
								ref={draLicenseNoRef => { this.draLicenseNoRef = draLicenseNoRef }} 
									inputContainerStyle={draLicenseNo && styles.inputError}
									rightIcon={draLicenseNo && this.common.getIcon()}
									errorMessage={draLicenseNo && "DRE licenses no. required"}
									value={this.state.draLicenseNo}
									onChangeText={(text) => this.setState({ draLicenseNo: text })}
									placeholder="DRE License No."
									maxLength={15}
									inputStyle={[styles.font15]} />
									

								<View style={{ flexDirection: 'row', }}>
									<Input autoCompleteType="off"
										ref={password => { this.password = password }}
										inputContainerStyle={password && styles.inputError}
										errorMessage={password && "Password required"}
										secureTextEntry={this.state.passwordISShow} value={this.state.password}
										rightIcon={() => {
											return (
												<TouchableOpacity
													onPress={() => this.setState({
														passwordISShow: !this.state.passwordISShow
													})}>
													<MaterialCommunityIcons name={this.state.passwordISShow ? 'eye-off' : 'eye'} color={colors.black} size={20} />
												</TouchableOpacity>
											)
										}}
										onChangeText={(text) => this.setState({ 'password': text })}
										placeholder="Password" inputStyle={[styles.font15]}
									/>
								</View>


								<Input autoCompleteType="off"
									ref={confirmPassword => { this.confirmPassword = confirmPassword }}
									inputContainerStyle={confirmPassword && styles.inputError}
									errorMessage={confirmPassword && "Confirm Password required"}
									secureTextEntry={this.state.confirmPAssIsShow} value={this.state.confirmPassword}
									onChangeText={(text) => this.setState({ 'confirmPassword': text })}
									rightIcon={() => {
										return (
											<TouchableOpacity
												onPress={() => this.setState({
													confirmPAssIsShow: !this.state.confirmPAssIsShow
												})}>
												<MaterialCommunityIcons name={this.state.confirmPAssIsShow ? 'eye-off' : 'eye'} color={colors.black} size={20} />
											</TouchableOpacity>
										)
									}}
									placeholder="Confirm Password" inputStyle={[styles.font15]} />

								<View style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center', marginTop: 20
								}}>
									<Button style={styles.loginButton} onPress={() => this.onRegister()}>
										<Text style={styles.textCenter}>SIGN UP</Text>
									</Button>
								</View>
							</Form>
						</View>
						<View style={{ justifyContent: "center", flex: 1, }}>
							<ActionSheet ref={actionSheetRef}>
								<View >
									<Text style={{ paddingLeft: 15, paddingTop: 5, fontWeight: 'bold', }}>Select Option</Text>
								</View>

								<View style={{ padding: 15 }}>
									<TouchableOpacity
										onPress={() => {
											this.photoUsingCamera();
											actionSheetRef.current?.setModalVisible();
										}}
									>
										<Text>Camera</Text>
									</TouchableOpacity>
								</View>
								<View style={{ marginBottom: 30, padding: 15 }}>
									<TouchableOpacity
										onPress={() => {
											this.photoFromGallery();
											actionSheetRef.current?.setModalVisible();
										}}
									>
										<Text>Photo Gallery</Text>
									</TouchableOpacity>
								</View>

							</ActionSheet>
						</View>
					</View>
				</ScrollView>
			</Root>
		);
	}
}