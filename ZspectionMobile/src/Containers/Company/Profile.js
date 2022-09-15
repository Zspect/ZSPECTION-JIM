import React, { Component, createRef } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, Alert, PermissionsAndroid, TouchableOpacity } from 'react-native';
import styles from '../../../assets/styles/style.js';
import {
	Container, Header, Content, Card, CardItem, Right,
	Text, Body, Form, Item
} from 'native-base';
import { CheckBox, Avatar, Input, Icon, Button } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import Logout from '../../Components/Logout';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "../..//network/API";
import GoogleSearch from '../../Components/GoogleSearch.js';
import ImageResizer from 'react-native-image-resizer';
import styles2 from '../../../assets/styles/style.js';
import { showToastMsg } from '../../utils.js';
import { formatPhoneNumber } from '../../utils/utils.js';
const actionSheetRef = createRef();

let actionSheet;
let companyId = 0
const optionsCamera = {
	mediaType: 'photo',
	cameraType: 'back'
};
const optionsGallery = {
	mediaType: 'mixed',
};

export default class Profile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			avatarSource: '',
			errors: [],
			profilePic: '',
			fname: '',
			lname: '',
			email: '',
			mobile: '',
			companyPhone: '',
			companyName: '',
			companyEmail: '',
			address: '',
			state: '',
			city: '',
			zipCode: '',
			inspectionType: '',
			password: '',
			confirmPassword: '',
			availability: false,
			distance: 1,
			inspectionState: '',
			inspectionCity: '',
			role: 3,
			stateList: [],
			cityList: [],
			inspectioncityList: [],
			inspectionZipcode: '',
			loading: false,
			submit: false,
			profile: {},
			disableMode: true,
			pic_data: {},
			companyName: '',
			companyBio: '',
			isPicClicked: false,
		}
		this.common = new Common();
	}

	async componentDidMount() {
		this.getUserProfile()
	}
	getData = async () => {
		companyId = await AsyncStorage.getItem('companyId');
		let userId = await AsyncStorage.getItem('userid');
		let data = {};
		data["companyID"] = companyId;
		data["firstName"] = this.state.fname;
		data["lastName"] = this.state.lname;
		data["emailID"] = this.state.email;
		data["mobileNumber"] = this.state.mobile;
		data["companyName"] = this.state.companyName;
		data["companyPhone"] = this.state.companyPhone;
		data["companyBio"] = this.state.companyBio;
		return data;
	}
	updateProfile = async () => {
		const reg = /^[a-z]+$/i;
		if (this.state.fname.length == 0) {
			showToastMsg("Firstname cannot be blank")
		}else if(!reg.test(this.state.fname)){
			showToastMsg("No numbers or special characters allowed in First Name")
		}
		else if (this.state.lname.length == 0) {
			showToastMsg("Lastname cannot be blank")
		}else if(!reg.test(this.state.lname)){
			showToastMsg("No numbers or special characters allowed in Last Name")
		}
		else if (this.state.mobile.length == 0) {
			showToastMsg("Enter valid Mobile number")
		}
		else if (this.state.companyName.length == 0) {
			showToastMsg("Company name cannot be blank")
		}
		else if (this.state.companyPhone.length == 0) {
			showToastMsg("Company number should not be blank")
		}
		else if (this.state.companyBio.length == 0) {
			showToastMsg("Company bio cannot be blank")
		} else {
			let data = await this.getData();
			companyId = await AsyncStorage.getItem('companyId');
			this.setState({ loading: true })
			API.updateCompanyProfile(this.updateCompanyRes, data, companyId)
		}



		// let response = await new API('updateCompany', data).getResponse();
		// this.setState({ loading: false })
		// console.log("Company Profile update response is : ", response);
		// if (response.response == 201) {
		// 	this.setState({ disableMode: true })
		// 	this.common.showToast(response.message)
		// 	if (Object.keys(this.state.pic_data).length > 0 && this.state.isPicClicked == true) {
		// 		this.setState({ loading: false }, async () => {
		// 			this.setState({ loading: true });
		// 			let picData = this.state.pic_data;
		// 			var body = new FormData();
		// 			console.log("pic data : ", picData);
		// 			body.append('PhotoFile', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });
		// 			var photoResult = await new API('saveCompanyPic', body).getResponse2("/" + companyId);
		// 			console.log("Company Photo upload result is:", photoResult);
		// 			if (photoResult.response == 201) {
		// 				this.setState({ loading: false, isPicClicked: false })
		// 				this.common.showToast(photoResult.message)
		// 			} else {
		// 				this.setState({ loading: false, isPicClicked: false })
		// 				this.common.showToast(photoResult.message)
		// 			}
		// 		});
		// 	}
		// }
	}

	updateCompanyRes = {
		success: (response) => {
			console.log("company_login_res>>>", response)
			this.setState({ loading: false })
			this.setState({ disableMode: true })
			this.common.showToast(response.message)
			if (Object.keys(this.state.pic_data).length > 0 && this.state.isPicClicked == true) {
				this.setState({ loading: false }, async () => {
					this.setState({ loading: true });
					let picData = this.state.pic_data;
					var body = new FormData();
					console.log("pic data : ", picData);
					body.append('File', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });

					API.updateCompanyProfilePic(this.compayProfileRes, body, companyId)
					// var photoResult = await new API('saveCompanyPic', body).getResponse2("/" + companyId);
					// console.log("Company Photo upload result is:", photoResult);
					// if (photoResult.response == 201) {
					// 	this.setState({ loading: false, isPicClicked: false })
					// 	this.common.showToast(photoResult.message)
					// } else {
					// 	this.setState({ loading: false, isPicClicked: false })
					// 	this.common.showToast(photoResult.message)
					// }
				});
			}
		},
		error: (error) => {
			console.log("company_login_error>>>", error)
		}
	}

	compayProfileRes = {
		success: (response) => {
			this.setState({ loading: false, isPicClicked: false })
			console.log("company_profile_res>>>", response)
			this.common.showToast(response.message)
		},
		error: (error) => {
			this.setState({ loading: false, isPicClicked: false })
			console.log("company_profile_error>>>", error)
			this.common.showToast(error.message)
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
		console.log(result);
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
			ImageResizer.createResizedImage(response.uri, 150, 150, 'PNG', 100).then((response2) => {
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
				this.setState({ pic_data: imageData, avatarSource: source, profilePic: response2.uri, loading: false, disableMode: false, isPicClicked: true }, () => {
					console.log("Picture data is :", this.state.pic_data)
				});
			})
		}
	}
	getUserProfile = async () => {
		this.setState({ loading: true })
		let companyId = await AsyncStorage.getItem('companyId');
		console.log("User id found is :", companyId)
		API.fetchCompanyDetails(this.companyRes, companyId)
		/*let response = await new API('CompanyOwner', {}).getApiResponse('/' + companyId).then((data) => {
			console.log("Profile detail response is :", data);
		});

		if (response.status == 200) {
			this.setState({ profile: response.data }, () => {
				this.setState(
					{
						companyName: response.data.companyName,
						companyBio: response.data.companyBio,
						fname: response.data.firstName,
						lname: response.data.lastName,
						email: response.data.emailID,
						mobile: response.data.mobileNumber,
						companyPhone: response.data.companyPhone,
						address: response.data.address,
						stateName: response.data.state,
						cityName: response.data.city,
						zipCode: response.data.zipCode,
						avatarSource: response.data.companyPhoto
					}
				)
			})
		}*/
		this.setState({ loading: false })
	}

	companyRes = {
		success: (response) => {
			console.log("company_profile>>>", response)
			if (response.data) {
				this.setState({ profile: response.data }, () => {
					this.setState(
						{
							companyName: response.data.companyName,
							companyBio: response.data.companyBio,
							fname: response.data.firstName,
							lname: response.data.lastName,
							email: response.data.emailId,
							mobile: response.data.mobileNumber,
							companyPhone: response.data.companyPhone,
							address: response.data.address,
							stateName: response.data.state,
							cityName: response.data.city,
							zipCode: response.data.zipCode,
							avatarSource: response.data.companyPhoto
						}
					)
				})
			}
		},
		error: (error) => {
			console.log("company_profile_error>>>", error)
		}
	}

	render() {
		let picDataLength = Object.keys(this.state.pic_data).length;
		if (this.state.loading) {
			return <Loader />
		}
		var companyName = !this.state.companyName && this.state.submit ? true : false;
		var fname = !this.state.fname && this.state.submit ? true : false;
		var lname = !this.state.lname && this.state.submit ? true : false;
		var title = !this.state.title && this.state.submit ? true : false;
		var email = !this.state.email && this.state.submit ? true : false;
		var mobile = !this.state.mobile && this.state.submit ? true : false;
		var companyPhone = !this.state.companyPhone && this.state.submit ? true : false;
		var agencyName = !this.state.agencyName && this.state.submit ? true : false;
		var assistantName = !this.state.assistantName && this.state.submit ? true : false;
		var assistantEmail = !this.state.assistantEmail && this.state.submit ? true : false;
		var address = !this.state.address && this.state.submit ? true : false;
		var companyBio = !this.state.companyBio && this.state.submit ? true : false;
		var stateName = !this.state.stateName && this.state.submit ? true : false;
		var cityName = !this.state.cityName && this.state.submit ? true : false;
		var zipCode = !this.state.zipCode && this.state.submit ? true : false;

		return (
			<ScrollView
				ref='_scrollView'
				onContentSizeChange={() => { this.refs._scrollView.scrollTo({ x: 0, y: 0, animated: true }); }}
			>
				<View style={styles.container}>
					<View style={styles.registerImageContainer}>
						<Avatar
							size={100}
							overlayContainerStyle={{ backgroundColor: '#FFF' }}
							rounded icon={{ name: 'person', color: '#C39666', size: 72 }}
							containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
							source={picDataLength < 1 ? { uri: this.state.avatarSource } : this.state.avatarSource}
							imageProps={{ resizeMode: 'cover' }}
							showEditButton
							onEditPress={() => { this.setState({ disableMode: false }) }}
							onPress={() => this.requestCameraPermission()}
						/>
					</View>
					<View style={styles.registerFormContainer}>
						<Form>
							<Errors errors={this.state.errors} />

							<View style={styles.twoRow}>
								<Item style={[styles.formItem, styles.halfRow]}>
									<Input disabled={this.state.disableMode} inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.common.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({ fname: text })} placeholder="First Name*" inputStyle={[styles.font15]}/>
								</Item>
								<Item style={[styles.formItem, styles.halfRow]}>
									<Input disabled={this.state.disableMode} inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.common.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({ lname: text })} placeholder="Last Name*" inputStyle={[styles.font15]} />
								</Item>
							</View>

							<Item style={[styles.formItem]}>
								<Input disabled={true} inputContainerStyle={email && styles.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({ email: text })} placeholder="Email*" inputStyle={[styles.font15]} autoCapitalize='none' />
							</Item>
							<Item style={[styles.formItem]}>
								<Input disabled={this.state.disableMode} inputContainerStyle={mobile && styles.inputError}
									rightIcon={mobile && this.common.getIcon()}
									errorMessage={mobile && "Mobile No required"}
									value={this.state.mobile}
									onChangeText={(text) => this.setState({ mobile: formatPhoneNumber(text) })}
									placeholder="Mobile No"
									inputStyle={[styles.font15]}
									maxLength={14}
									keyboardType='number-pad'
								/>
							</Item>
							<Item style={styles.formItem}>
								<Input disabled={this.state.disableMode}
									inputContainerStyle={companyName && styles.inputError} rightIcon={companyName && this.common.getIcon()} errorMessage={companyName && "Company Name required"} value={this.state.companyName} onChangeText={(text) => this.setState({ 'companyName': text })} placeholder="Company Name*" inputStyle={[styles.font15]} />
							</Item>
							<Item style={[styles.formItem]}>
								<Input disabled={this.state.disableMode} inputContainerStyle={companyPhone && styles.inputError}
									rightIcon={companyPhone && this.common.getIcon()}
									errorMessage={companyPhone && "Company Phone No required"}
									value={this.state.companyPhone}
									onChangeText={(text) => this.setState({ companyPhone: formatPhoneNumber(text) })} placeholder="Company Phone No*"
									inputStyle={[styles.font15]}
									maxLength={14}
									keyboardType='number-pad'
								/>
							</Item>
							{/* <Item style={[styles.formItem]}>
							<Input disabled inputContainerStyle={title && styles.inputError} rightIcon={title && this.common.getIcon()} errorMessage={title && "Title required"} value={this.state.title} onChangeText={(text) => this.setState({'title': text})}  placeholder="Title (Real State Agent, Broker, etc)" inputStyle={[styles.font15]}  />
						</Item> */}
							<Item style={[styles.formItem]}>
								<Input disabled={this.state.disableMode} inputContainerStyle={companyBio && styles.inputError} rightIcon={companyBio && this.common.getIcon()} errorMessage={companyBio && "Company Bio required"} value={this.state.companyBio} onChangeText={(text) => this.setState({ companyBio: text })} placeholder="Company Bio*" inputStyle={[styles.font15]} />
							</Item>
							<View style={styles2.nextButtonWrapper}>
								<Button
									title="Save"
									disabled={this.state.disableMode}
									buttonStyle={styles2.btnNext}
									onPress={() => this.updateProfile()}
								/>
							</View>
						</Form>
					</View>
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
			</ScrollView>
		);
	}
}
