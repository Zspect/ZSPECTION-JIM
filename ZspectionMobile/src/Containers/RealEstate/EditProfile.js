import React, { Component, createRef} from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity,PermissionsAndroid } from 'react-native';
import styles from '../../../assets/styles/style.js';
import {
	Container, Header, Content, Button, Card, CardItem, Toast, Root,
	Text, Body, Form, Item
} from 'native-base';
import { CheckBox, Avatar, Input, Icon } from 'react-native-elements';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Errors from '../../Components/Errors';
import API from '../../Api/Api';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import GoogleSearch from '../../Components/GoogleSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
	mediaType: 'photo',
	cameraType: 'back'
};
const optionsGallery = {
	mediaType: 'mixed',
};

export default class EditProfile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			avatarSource: '',
			profilePic: '',
			errors: [],
			agentid: '',
			userid: '',
			fname: '',
			lname: '',
			mobileno: '',
			title: '',
			email: '',
			phone: '',
			agencyName: '',
			assistantName: '',
			assistantEmail: '',
			address: '',
			role: 2,
			loading: false,
			submit: false,
		}
		this.common = new Common();

	}

	componentDidMount() {
		this.props.navigation.setParams({ handleSave: this.saveProfile })
		this.setProfile()
	}



	async setProfile() {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));

		this.setState({
			fname: profile.Fname,
			lname: profile.Lname,
			title: profile.Title,
			email: profile.EmailId,
			phone: profile.MobileNumber,
			agencyName: profile.AgencyName,
			assistantName: profile.AssistanceName,
			assistantEmail: profile.AssistanceEmail,
			address: profile.Address,
			avatarSource: { uri: profile.ProfilePic }
		})
	}

	static navigationOptions = ({ navigation }) => {
		const { params = {} } = navigation.state
		return {
			title: 'Edit Profile',
			headerStyle: { backgroundColor: '#28558E' },
			headerTintColor: '#FFF',
			headerRight: <Icon iconStyle={{ marginRight: 15 }} color="#FFF" name='floppy-o' type='font-awesome' onPress={() => params.handleSave()} />
		};
	};

	validate = () => {
		var messages = [];
		this.setState({ submit: true });
		messages.push(!this.state.avatarSource && 'Select Profile Pic');
		messages.push(!this.state.fname && 'First Name required');
		messages.push(!this.state.lname && 'Last Name required');
		messages.push(!this.state.title && 'Title required');
		messages.push(!this.state.email && 'Email required');
		messages.push(!this.state.phone && 'Phone no required');
		messages.push(!this.state.agencyName && 'Agency Name required');
		messages.push(!this.state.address && 'Enter Address');

		if (this.state.email && !this.common.validateEmail(this.state.email)) {
			messages.push('Invalid Email');
		}
		if (this.state.assistantEmail && !this.common.validateEmail(this.state.assistantEmail)) {
			messages.push('Invalid Assistant Email');
		}
		var errorShow = [];

		messages = messages.filter((msg) => {
			if (msg) {
				return msg;
			}
		})
		for (var i = 0; i < messages.length; i++) {
			var required = messages[i].indexOf('required');
			if (required > 0) {

			}
			else {
				errorShow.push(messages[i]);
			}
		}

		this.setState({ errors: errorShow });

		if (messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
	}

	async success(profile) {

		await AsyncStorage.setItem("profile", JSON.stringify(profile));
		Toast.show({
			text: "Profile Update Successfully.",
			duration: 2000,
			type: "success"
		})
		setTimeout(() => {
			this.props.navigation.navigate('Profile', { 'profile': profile })
		}, 2000)
	}

	saveProfile = async () => {
		var authToken = await AsyncStorage.getItem("authToken");
		if (!this.state.avatarSource) {
			this.common.showToast('Please Select your Profile Picture');

		}
		else if (!this.state.fname) {
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
		else if (this.state.phone) {
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
		else {
			this.setState({ loading: true });
			var token = await AsyncStorage.getItem('authToken');
			await this.getRequestData().then(data => {
				var header = { 'authentication': token };
				var response = new API('AgentProfile', data, header).getResponse();

				response.then(result => {
					console.log("profile result: ", result)
					if (result.statuscode == 200) {
						this.success(result.result);
					}
					else {
						var errors = [];
						errors.push(result.message);
						this.setState({ errors: errors })
					}
				})
			});
			this.setState({ loading: false });
		}
		return false;
	}

	async getRequestData() {
		const profile = JSON.parse(await AsyncStorage.getItem("profile"));

		return {
			"agentid": profile.AgentId,
			"userid": profile.userid,
			"fname": this.state.fname,
			"lname": this.state.lname,
			"mobileno": this.state.phone,
			"address": this.state.address,
			"country": "USA",
			"state": "",
			"city": "",
			"zipcode": "",
			"title": this.state.title,
			"agencyname": this.state.agencyName,
			"assistancename": this.state.assistantName,
			"assistanceemail": this.state.assistantEmail,
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
  
	async photoFromGallery (){
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
			this.setState({loading:true})
			let response = resp.assets[0]
			console.log('response: ', response);
				this.uploadPicApi(response);
			}
	}

	mapAddress = (data, details) => {
		this.setState({ address: data.description })
	}

	async successProfileImg(result, pic) {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var profileUrl = result[0].mediaSource;
		this.setState({
			profilePic: profileUrl
		});
		const source = { uri: profileUrl };
		this.setState({
			avatarSource: source,
		});
		profile.ProfilePic = profileUrl;
		await AsyncStorage.setItem("profile", JSON.stringify(profile));
	}

	async uploadPicApi(response) {
		this.setState({ loading: true });
		var body = new FormData();
		var pic = response;
		var userid = await AsyncStorage.getItem("userid");
		body.append('file', { uri: response.uri, name: response.fileName, filename: response.fileName, type: response.type });
		body.append('recordid', userid);
		var response = await new API('UploadPic', body).getResponse();
		this.setState({ loading: false });
		try {
			if (response.statuscode == 200 && response.result) {
				this.successProfileImg(response.result, pic);
			}
			else {
				throw 'API Error in Upload Photo API';
			}
		} catch (error) {
			this.setState({ loading: false });

		}
	}

	render() {
		if (this.state.loading || !this.state.address) {
			return <Loader />
		}
		var fname = !this.state.fname && this.state.submit ? true : false;
		var lname = !this.state.lname && this.state.submit ? true : false;
		var title = !this.state.title && this.state.submit ? true : false;
		var email = !this.state.email && this.state.submit ? true : false;
		var phone = !this.state.phone && this.state.submit ? true : false;
		var agencyName = !this.state.agencyName && this.state.submit ? true : false;
		var address = !this.state.address && this.state.submit ? true : false;


		return (
			<Root>
				<ScrollView
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
								<Errors errors={this.state.errors} />
								<View style={styles.sectionRow}>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.common.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
									</View>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.common.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
									</View>
								</View>

								<Input autoCompleteType="off" inputContainerStyle={email && styles.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[styles.font15]} autoCapitalize = 'none' />


								<Input autoCompleteType="off" inputContainerStyle={phone && styles.inputError} rightIcon={phone && this.common.getIcon()} errorMessage={phone && "Phone No required"} value={this.state.phone} onChangeText={(text) => this.setState({ 'phone': text })} placeholder="Phone No" inputStyle={[styles.font15]} />


								<Input autoCompleteType="off" inputContainerStyle={agencyName && styles.inputError} rightIcon={agencyName && this.common.getIcon()} errorMessage={agencyName && "Agency name required"} value={this.state.agencyName} onChangeText={(text) => this.setState({ 'agencyName': text })} placeholder="Agency Name" inputStyle={[styles.font15]} />


								<Input autoCompleteType="off" inputContainerStyle={title && styles.inputError} rightIcon={title && this.common.getIcon()} errorMessage={title && "Title required"} value={this.state.title} onChangeText={(text) => this.setState({ 'title': text })} placeholder="Title (Real State Agent, Broker, etc)" inputStyle={[styles.font15]} />


								<GoogleSearch value={this.state.address} mapAddress={this.mapAddress.bind(this)} />



								<Input autoCompleteType="off" value={this.state.assistantName} onChangeText={(text) => this.setState({ 'assistantName': text })} placeholder="Assistance Name" inputStyle={[styles.font15]} />


								<Input autoCompleteType="off" value={this.state.assistantEmail} onChangeText={(text) => this.setState({ 'assistantEmail': text })} placeholder="Assistance Email" inputStyle={[styles.font15]} />

							</Form>
						</View>
					</View>
				</ScrollView>
				<View style={{justifyContent: "center",flex: 1,}}>
				<ActionSheet ref={actionSheetRef}>
				<View >
					<Text style={{paddingLeft:15, paddingTop:5, fontWeight: 'bold',}}>Select Option</Text>
				</View>

				<View style={{padding:15}}>
					<TouchableOpacity
						onPress={() => {
							this.photoUsingCamera();
							actionSheetRef.current?.setModalVisible();
						}}
						>
						<Text>Camera</Text>
					</TouchableOpacity>
				</View>
				<View style={{marginBottom:30, padding:15}}>
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
			</Root>
		);
	}
}