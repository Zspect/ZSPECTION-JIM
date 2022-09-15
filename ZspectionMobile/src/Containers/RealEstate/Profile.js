import React, { Component, createRef } from 'react';
import { Platform, StyleSheet, View, ScrollView, Text, Image, Alert, PermissionsAndroid, TouchableOpacity } from 'react-native';
import styles from '../../../assets/styles/style.js';
import { Form, Root } from 'native-base';
import { CheckBox, Avatar, Input, Icon, Button } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles2 from '../../../assets/styles/style.js';
import ImageResizer from 'react-native-image-resizer';
import { API } from "../../network/API";
import { showToastMsg } from '../../utils';
import { formatBytes, isEmail, MAX_FILE_SIZE } from '../../utils/utils.js';


const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
	mediaType: 'photo',
	cameraType: 'back'
};
const optionsGallery = {
	mediaType: 'mixed',
};
export default class Register extends Component {
	constructor(props) {
		super(props)
		this.state = {
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
			role: 2,
			loading: false,
			submit: false,
			profile: {},
			disableMode: true,
			pic_data: {},
			isPicClicked: false,
		}
		this.common = new Common();
	}

	componentDidMount() {
		this.getUserProfile()
		// this.setProfile()
	}
	getUserProfile = async () => {
		this.setState({ loading: true })
		let agentId = await AsyncStorage.getItem('reAgentID');
		console.log("Agent id found is :", agentId)
		//let response = await new API('AgentDetail', {}).getApiResponse('/' + agentId);
		API.profileDetails(this.profileRes, agentId)

		// console.log("Agent profile response is :", response);
		// if(response.status==200){
		//     this.setState({profile:response.data},()=>{
		// 		this.setProfile()
		// 	})
		// }
		this.setState({ loading: false })
	}

	profileRes = {
		success: (response) => {
			console.log("profile_res>>>", response)
			this.setState({ loading: false })
			this.setState({ profile: response.data }, () => {
				this.setProfile()
			})
		},
		error: (error) => {
			console.log("profile_res_error>>>", error)
			this.setState({ loading: false })
		}
	}

	componentDidUpdate(prevProps, prevState) {
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

	imageResize(resp) {
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
			if (response.fileSize <= MAX_FILE_SIZE) {
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
			} else {
				this.setState({ loading: false })
				showToastMsg("Please select image below 2 MB")
			}
			// if (formatBytes(response.fileSize) <= '2 MB') {
			// 	ImageResizer.createResizedImage(response.uri, 150, 150, 'PNG', 100).then((response2) => {
			// 		const source = { uri: response2.uri };
			// 		let imageData = {};
			// 		imageData['fileName'] = response.fileName;
			// 		imageData['fileSize'] = response2.size;
			// 		imageData['height'] = response2.height;
			// 		imageData['isVertical'] = response.isVertical;
			// 		imageData['originalRotation'] = response.originalRotation;
			// 		imageData['path'] = response.path;
			// 		imageData['type'] = response.type;
			// 		imageData['uri'] = response.uri;
			// 		imageData['width'] = response2.width;
			// 		this.setState({ pic_data: imageData, avatarSource: source, profilePic: response2.uri, loading: false, disableMode: false, isPicClicked: true }, () => {
			// 			console.log("Picture data is :", this.state.pic_data)
			// 		});
			// 	})
			// } else {
			// 	this.setState({ loading: false })
			// 	showToastMsg("Please select image below 2 MB")
			// }

		}
	}
	async setProfile() {
		this.setState({
			fname: this.state.profile.firstName,
			lname: this.state.profile.lastName,
			title: this.state.profile.title,
			email: this.state.profile.emailId,
			phone: this.state.profile.mobileNumber,
			agencyName: this.state.profile.agencyName,
			assistantName: this.state.profile.assistantName,
			assistantEmail: this.state.profile.assistantEmail,
			address: this.state.profile.address,
			avatarSource: this.state.profile.profilePic
		})
	}

	updateProfilePic = {
		success: (response) => {
			console.log("profile_update_res>>>", response)
			showToastMsg(response.message)
			this.setState({ loading: false })
		},
		error: (error) => {
			console.log("profile__update__error>>>", error)
			this.setState({ loading: false })
		}
	}

	profileUpdateRes = {
		success: (response) => {
			console.log("profile_update_res>>>", response)
			showToastMsg(response.message)
			// this.setState({ loading: false })
			// this.setState({ profile: response.data }, () => {
			// 	this.setProfile()
			// })

			if (Object.keys(this.state.pic_data).length > 0 && this.state.isPicClicked == true) {
				this.setState({ loading: false }, async () => {
					this.setState({ loading: true });
					var body = new FormData();
					body.append('File', {
						uri: Platform.OS === 'android' ? this.state.pic_data.uri : this.state.pic_data.uri.replace('file://', ''),
						name: this.state.pic_data.fileName,
						type: this.state.pic_data.type
					});
					console.log("image_uploadsdada >>", body)
					let agentId = AsyncStorage.getItem('reAgentID').then((data) => {
						API.realAgentUpdateProfilePic(this.updateProfilePic, body, data)
					});

					// var body = new FormData();
					// console.log("Update Profile Request : ", picData);
					// body.append('PhotoFile', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });
					// //body.append('photofile', picData, picData.fileName);


					// //console.log("Url : ", body);
					// var photoResult = await new API('saveAgentPic', body).getResponse2("/" + agentId);
					// console.log("Photo upload result is:", photoResult);
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
			console.log("profile__update__error>>>", error)
			this.setState({ loading: false })
		}
	}


	getData = async () => {
		let agentId = await AsyncStorage.getItem('reAgentID');
		let userId = await AsyncStorage.getItem('userid');
		let data = {};
		data["reAgentID"] = agentId;
		data["firstName"] = this.state.fname;
		data["lastName"] = this.state.lname;
		data["agencyName"] = this.state.agencyName;
		data["title"] = this.state.title;
		data["assistantName"] = this.state.assistantName;
		data["assistantEmail"] = this.state.assistantEmail;
		return data;
	}
	updateProfile = async () => {
		if (this.state.agencyName.length == 0) {
			showToastMsg("Agency Name Cannot be Blank")
		}
		else if (this.state.title.length == 0) {
			showToastMsg("Title cannot be blank")
		}
		else if (this.state.address.length == 0) {
			showToastMsg("Address cannot be blank")
		}
		else if (this.state.assistantName.length == 0) {
			showToastMsg("Assistance Name Cannot be Blank")
		}
		else if (this.state.assistantEmail.length == 0) {
			showToastMsg("Assistance Email Cannot be Blank")
		}
		else if (isEmail(this.state.assistantEmail)) {
			showToastMsg("Enter valid Assistant email address")
		} else {
			let data = await this.getData();
			let agentId = await AsyncStorage.getItem('reAgentID');
			this.setState({ loading: true })
			console.log("Profile update response is : ", data);
			console.log("Update Profile Request : ", this.state.pic_data);
			//let response = await new API('saveAgentProfile', data).getResponse();
			API.realAgentProfileUpdate(this.profileUpdateRes, data, agentId)

			this.setState({ loading: false })
		}


		/*if (response.response == 201) {
			this.setState({ disableMode: true })
			this.common.showToast(response.message)
			if (Object.keys(this.state.pic_data).length > 0 && this.state.isPicClicked == true) {
				this.setState({ loading: false }, async () => {
					this.setState({ loading: true });
					let picData = this.state.pic_data;
					var body = new FormData();

					console.log("Update Profile Request : ", picData);
					body.append('PhotoFile', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });
					//body.append('photofile', picData, picData.fileName);


					//console.log("Url : ", body);
					var photoResult = await new API('saveAgentPic', body).getResponse2("/" + agentId);
					console.log("Photo upload result is:", photoResult);
					if (photoResult.response == 201) {
						this.setState({ loading: false, isPicClicked: false })
						this.common.showToast(photoResult.message)
					} else {
						this.setState({ loading: false, isPicClicked: false })
						this.common.showToast(photoResult.message)
					}
				});
			}
		}*/
	}

	render() {
		let picDataLength = Object.keys(this.state.pic_data).length;
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

		return (
			<Root>
				<ScrollView>
					<View style={styles.container}>
						<View style={styles.registerImageContainer}>
							<Avatar
								size={100}
								overlayContainerStyle={{ backgroundColor: '#FFF' }}
								rounded icon={{ name: 'person', color: '#C39666', size: 72 }}
								containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
								source={picDataLength < 1 ? { uri:this.state.avatarSource } : this.state.avatarSource}
								imageProps={{ resizeMode: 'cover' }}
								showEditButton
								onEditPress={() => { this.setState({ disableMode: false }) }}
								onPress={() => this.requestCameraPermission()}
							/>
						</View>
						<View>
							<Form>
								<Errors errors={this.state.errors} />
								<View style={styles.sectionRow}>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.common.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
									</View>
									<View style={styles.threeRow}>
										<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.common.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
									</View>
								</View>
								<Input autoCompleteType="off" disabled keyboardType="email-address" inputContainerStyle={email && styles.inputError} rightIcon={email && this.common.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[styles.font15]} autoCapitalize='none' />
								<Input autoCompleteType="off" disabled keyboardType="numeric" inputContainerStyle={phone && styles.inputError} rightIcon={phone && this.common.getIcon()} errorMessage={phone && "Phone No required"} value={this.state.phone} onChangeText={(text) => this.setState({ 'phone': text })} placeholder="Phone No" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={agencyName && styles.inputError} rightIcon={agencyName && this.common.getIcon()} errorMessage={agencyName && "Agency name required"} value={this.state.agencyName} onChangeText={(text) => this.setState({ 'agencyName': text })} placeholder="Agency Name" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={title && styles.inputError} rightIcon={title && this.common.getIcon()} errorMessage={title && "Title required"} value={this.state.title} onChangeText={(text) => this.setState({ 'title': text })} placeholder="Title (Real State Agent, Broker, etc)" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={address && styles.inputError} rightIcon={address && this.common.getIcon()} errorMessage={address && "Address required"}
									value={this.state.address}
									onChangeText={(text) => this.setState({ 'address': text })}
									placeholder="Address" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" disabled={this.state.disableMode} inputContainerStyle={assistantName && styles.inputError} rightIcon={assistantName && this.common.getIcon()} errorMessage={assistantName && "Assistance name required"} value={this.state.assistantName} onChangeText={(text) => this.setState({ 'assistantName': text })} placeholder="Assistance Name" inputStyle={[styles.font15]} />
								<Input autoCompleteType="off" disabled={this.state.disableMode} keyboardType="email-address" inputContainerStyle={assistantEmail && styles.inputError} rightIcon={assistantEmail && this.common.getIcon()} errorMessage={assistantEmail && "Assistance email required"} value={this.state.assistantEmail} onChangeText={(text) => this.setState({ 'assistantEmail': text })} placeholder="Assistance Email" inputStyle={[styles.font15]} />
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

				</ScrollView>
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
			</Root>
		);
	}
}