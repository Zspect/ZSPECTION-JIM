import React, { Component, createRef } from 'react';
import {
    Platform, StyleSheet, View, TextInput, ScrollView, Image,
    TouchableOpacity, BackHandler, PermissionsAndroid, FlatList
} from 'react-native';
import styles from '../../assets/styles/style.js';
import {
    Container, Root, Header, Content, Card, Textarea, CardItem, Right, Left, Switch,
    Text, Body, Form, Item, Picker
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Errors from '../Components/Errors';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import { API } from "../network/API";
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HeaderBackButton } from 'react-navigation-stack';
import DeviceInfo from 'react-native-device-info';
import { ROLE_ID } from '../utils.js';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { showToastMsg } from '../utils.js';
import { formatPhoneNumber, range } from '../utils/utils.js';
import Modal from "react-native-modal";
import { deviceHeight, deviceWidth } from '../constants/Constants.js';
import colors from '../utils/colors.js';


const actionSheetRef = createRef();

let actionSheet;
let profileObj = ''
let compayID = 0
const optionsCamera = {
    mediaType: 'photo',
    cameraType: 'back'
};
const optionsGallery = {
    mediaType: 'mixed',
};

export default class RegisterCompany extends Component {
    constructor(props) {
        super(props)
        console.log("dsadsadsbajd >>",this.props.navigation)
        this.state = {
            avatarSource: '',
            errors: [],
            profilePic: '',
            fname: '',
            lname: '',
            phone: '',
            bio: '',
            password: '',
            confirmPassword: '',
            loading: false,
            pic_data: {},
            infectionType: [],
            isModalOpen: false,
            inspectorSelect: [],
            setSaveInsStr: [],
            passwordShow: true,
            confirmPasswordShow: true,
        }
        this.common = new Common();
    }
    async componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: (<HeaderBackButton onPress={() => params.backHandle()} tintColor={'white'} />)
        }
    }
    handleBack = () => {
        let stateToSave = {};
        stateToSave["fname"] = this.state.fname,
            stateToSave["lname"] = this.state.lname,
            stateToSave["phone"] = this.state.phone,
            stateToSave["bio"] = this.state.bio,
            stateToSave["password"] = this.state.password,
            stateToSave["confirmPassword"] = this.state.confirmPassword,
            AsyncStorage.setItem("LocalState", JSON.stringify(stateToSave));
        this.props.navigation.pop();
        return true;
    }
    async componentDidMount() {
        
        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        this.props.navigation.setParams({ backHandle: this.handleBack });
        this.fetchInfectionType()
        let localState = await AsyncStorage.getItem("LocalState");
        if (localState !== null) {
            let savedState = JSON.parse(localState);
            this.setState({
                fname: savedState.fname,
                lname: savedState.lname,
                phone: savedState.phone,
                bio: savedState.bio,
                password: savedState.password,
                confirmPassword: savedState.confirmPassword,
            })
        }
    }
    async success(profile) {
        console.log("Company to save is :", profile);
        profileObj = profile
        await AsyncStorage.setItem("companyId", profile.companyId.toString());
        await AsyncStorage.setItem("userid", profile.userId.toString());
        await AsyncStorage.setItem("trialDays", profile.trialPeriod.toString());
        await AsyncStorage.setItem("trialExpiryDate", profile.trialExpiryDate.toString());
        await AsyncStorage.setItem("authToken", profile.token);
        await AsyncStorage.setItem("profile", JSON.stringify(profile));

        var body = new FormData();
        let picData = this.state.pic_data;
        //body.append('Id', profile.reagentId)
        body.append('File', {
            uri: Platform.OS === 'android' ? picData.uri : picData.uri.replace('file://', ''),
            name: picData.fileName,
            type: picData.type
        });
        console.log('login_issue_find >>', body, this.state.pic_data, this.state.profilePic)
        API.uploadRegisterCompanyImage(this.uploadCompanyImagesRes, body, profile.companyId)

        // this.setState({ loading: false }, async () => {
        //     this.setState({ loading: true });
        //     let picData = this.state.pic_data;
        //     var body = new FormData();
        //     console.log("pic data : ", picData);
        //     body.append('photofile', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });
        //     // var photoResult = await new API('UploadCompanyPic', body).getResponse2("/" + profile.returnID.toString());
        //     if (photoResult.response == 201) {
        //         await AsyncStorage.removeItem('LocalState');
        //         this.setState({ loading: false })
        //         this.common.showToast(photoResult.message)
        //         this.props.navigation.navigate('CompanyInspection', { "profile": profile })
        //     } else {
        //         this.setState({ loading: false })
        //         this.common.showToast(photoResult.message)
        //     }
        // });
    }

    uploadCompanyImagesRes = {
        success: (response) => {
            console.log("company_reg_res>>>", response)
            this.common.showToast(response.message)
            // this.props.navigation.navigate('CompanyPriceMatrixRoute')
            this.props.navigation.navigate('Services')
            // this.props.navigation.navigate('CompanyInspection', { "profile": profileObj })
        },
        error: (error) => {
            console.log("company_reg_error>>>", error)
        }
    }

    fetchInfectionType = async () => {
        compayID = await AsyncStorage.getItem('companyId');
        API.fetchInfectionTypeFromCompanyId(this.infectionTypeRes, compayID)
    }

    infectionTypeRes = {
        success: (response) => {
            console.log("company_inspector >>>", response)
            this.setState({
                infectionType: response.data
            })
        },
        error: (error) => {
            console.log("company_inspector_error>>>", error)
        }
    }


    onRegister = async () => {
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
        else if (!this.state.phone) {
            this.common.showToast('Please enter valid Phone Number');
            this.phone.focus()
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
            this.common.showToast("Both password should be same");
            this.password.focus()
        }
        else if (this.state.inspectorSelect.length==0) {
            this.common.showToast("Please select Atleast 1 Inspection");
        }
        else if (!this.state.bio) {
            this.common.showToast('Please enter your Bio');
            this.bio.focus()
        }
        else {
            this.setState({ loading: false });
            await this.getRequestData().then(data => {
                console.log("RegisterCompany request data: ", JSON.stringify(data))
                API.registerCompany(this.registerCompanyRes, data)
            });
        }
    }

    registerCompanyRes = {
        success: (response) => {
            console.log("company_reg_res>>>", response)
            this.common.showToast(response.message)
            this.success(response.data);
        },
        error: (error) => {
            console.log("company_reg_error>>>", error)
        }
    }

    async getRequestData() {
        let deviceID = 0
        deviceID = DeviceInfo.getUniqueId();
        //const deviceId = await AsyncStorage.getItem("deviceId");
        const fcmToken = await AsyncStorage.getItem("fcmToken");
        var role = await AsyncStorage.getItem("role").then((data) => {
            console.log("role_idddd >", data)
        });
        var request = this.props.navigation.getParam('request');
        let arrayID = []
        for (let index = 0; index < this.state.inspectorSelect.length; index++) {
            const element = this.state.inspectorSelect[index];
            arrayID.push(element.id)
        }
        var newRequest = {
            "roleid": ROLE_ID[2].id,
            "firstName": this.state.fname,
            "lastName": this.state.lname,
            "mobileNumber": this.state.phone,
            "password": this.state.password,
            "deviceValue": deviceID,
            "deviceRegID": "fsdfsdfsdf",//fcmToken,
            "companyBio": this.state.bio,
            "inspectionTypeList": arrayID,
        }
        return { ...request, ...newRequest }
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
                });
            })
        }
    }

    addIns = (insp, index) => {
        let arrayFix = this.state.inspectorSelect
        let isFIndd = this.state.infectionType.find((data) => data.id == insp.id)
        let isFInddInd = this.state.inspectorSelect.findIndex((data) => data.id == insp.id)
        if (isFInddInd != -1) {
            arrayFix.splice(isFInddInd, 1)
        } else {
            arrayFix.push(isFIndd)
        }
        this.setState({
            inspectorSelect: arrayFix
        })
        let array = []
        for (let index = 0; index < arrayFix.length; index++) {
            const element = arrayFix[index];
            array.push(element.name)
        }
        this.setState({
            setSaveInsStr: array
        })
    }

    renderModalItem = ({ item, index }) => {
        let isFind = this.state.inspectorSelect.find((data) => data.id == item.id)
        return (
            <TouchableOpacity style={{ width: deviceWidth * 0.5, height: 45, flexDirection: 'row', alignItems: 'center' }}
                onPress={() => {
                    //fetchPropertyType()
                    this.addIns(item, index)
                    //closeModal()
                }}
            >
                <MaterialCommunityIcons
                    name={isFind ? 'checkbox-marked' : 'checkbox-blank-outline'}
                    color={colors.black}
                    size={20}
                />
                <Text style={{ marginHorizontal: 10 }}>{item.name}</Text>
            </TouchableOpacity>
        )

    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <Root>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={styles.container}>
                        <Text style={styles.heading}>Basic Details</Text>
                        <Form>
                            <View style={styles.center}>
                                <Avatar
                                    size={100}
                                    onPress={() => this.requestCameraPermission()}
                                    overlayContainerStyle={{ backgroundColor: '#FFF' }}
                                    rounded icon={{ name: 'plus', type: 'font-awesome', color: '#C39666', size: 25 }}
                                    containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                                    source={this.state.avatarSource}
                                    imageProps={{ resizeMode: 'cover' }}
                                    //avatarStyle={{backgroundColor:'gray'}}
                                    ref={avatarSource => { this.avatarSource = avatarSource }}
                                />
                            </View>
                            <View style={styles.sectionRow}>
                                <View style={[styles.threeRow]}>
                                    <Input autoCompleteType="off"
                                        ref={fname => { this.fname = fname }} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
                                </View>
                                <View style={[styles.threeRow]}>
                                    <Input autoCompleteType="off" ref={lname => { this.lname = lname }}
                                        value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
                                </View>
                            </View>

                            <Input autoCompleteType="off" ref={phone => { this.phone = phone }}
                                keyboardType="numeric"
                                value={this.state.phone}
                                onChangeText={(text) => this.setState({ 'phone': formatPhoneNumber(text) })}
                                placeholder="Phone No" inputStyle={[styles.font15]}
                                maxLength={14}
                            />
                            <View style={{ flexDirection: 'row', width: '95%', }}>
                                <TextInput
                                    placeholder="Password"
                                    ref={password => { this.password = password }}
                                    onChangeText={(text) => this.setState({ 'password': text })}
                                    style={[styles.font15, { flex: 1, marginHorizontal: 10 }]}
                                    autoCapitalize='none'
                                    secureTextEntry={this.state.passwordShow}
                                    value={this.state.password}
                                />
                                {/* <Input autoCompleteType="off"
                                    ref={password => { this.password = password }}
                                    secureTextEntry={this.state.passwordShow} value={this.state.password}
                                    placeholder="Password"
                                    onChangeText={(text) => this.setState({ 'password': text })}
                                    style={styles.font15} autoCapitalize='none' /> */}
                                <TouchableOpacity style={{ marginTop: 16 }}
                                    onPress={() => this.setState({
                                        passwordShow: !this.state.passwordShow
                                    })}>
                                    <MaterialCommunityIcons name={this.state.passwordShow ? 'eye-off' : 'eye'} color='black' size={20} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center' }} />

                            <View style={{ flexDirection: 'row', width: '95%', }}>
                                <TextInput
                                    autoCompleteType="off"
                                    ref={confirmPassword => { this.confirmPassword = confirmPassword }}
                                    onChangeText={(text) => this.setState({ 'confirmPassword': text })}
                                    placeholder="Confirm Password"
                                    style={[styles.font15, { flex: 1, marginHorizontal: 10 }]}
                                    secureTextEntry={this.state.confirmPasswordShow} value={this.state.confirmPassword}
                                />
                                {/* <Input autoCompleteType="off"
                                    ref={password => { this.password = password }}
                                    secureTextEntry={this.state.passwordShow} value={this.state.password}
                                    placeholder="Password"
                                    onChangeText={(text) => this.setState({ 'password': text })}
                                    style={styles.font15} autoCapitalize='none' /> */}
                                <TouchableOpacity style={{ marginTop: 16 }}
                                    onPress={() => this.setState({
                                        confirmPasswordShow: !this.state.confirmPasswordShow
                                    })}>
                                    <MaterialCommunityIcons name={this.state.confirmPasswordShow ? 'eye-off' : 'eye'} color='black' size={20} />
                                </TouchableOpacity>
                            </View>

                            <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center' }} />
                            {/* <Input autoCompleteType="off" ref={confirmPassword => 
                                { this.confirmPassword = confirmPassword }} 
                                secureTextEntry={true} value={this.state.confirmPassword} 
                                onChangeText={(text) => this.setState({ 'confirmPassword': text })} 
                                placeholder="Confirm Password" inputStyle={[styles.font15]} /> */}

                            <View style={{ width: '100%', marginTop: 5, marginLeft: 10 }}>
                                <Text style={{ color: colors.toolbar_bg_color, fontSize: 14, fontWeight: '900' }}>Inspection Type</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.fetchInfectionType()
                                        this.setState({
                                            isModalOpen: true
                                        })
                                    }}
                                >
                                    <Text style={{ color: colors.black, fontSize: 16, marginTop: 5 }}>{this.state.setSaveInsStr.length > 0 ? this.state.setSaveInsStr.toString() : 'Select Inspection Type'}</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={{
                                width: '95%', height: 1, backgroundColor: colors.gray, marginVertical: 10, alignSelf: 'center'
                            }} />

                            <View style={{ width: "94%", marginLeft: 8 }}>
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ fontSize: 15, color: 'gray' }}>Add Bio</Text>
                                </View>
                                <Textarea rowSpan={5} bordered ref={bio => { this.bio = bio }} value={this.state.bio} onChangeText={(text) => this.setState({ 'bio': text })} style={{ backgroundColor: '#f3f3f3', borderColor: '#e8e8e8', height: 80 }} />
                            </View>
                            <View style={styles.nextButtonWrapper}>
                                <Button
                                    title="Save"
                                    buttonStyle={styles.btnNext}
                                    icon={<Icon name="angle-right" containerStyle={{ position: 'absolute', right: 10 }} type="font-awesome" color="#FFF" />}
                                    iconRight
                                    onPress={() => this.onRegister()}>
                                </Button>
                            </View>
                        </Form>
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

                <Modal
                    isVisible={this.state.isModalOpen}
                    onBackButtonPress={() => {
                        this.setState({
                            isModalOpen: false
                        })
                    }}
                    onBackdropPress={() => {
                        this.setState({
                            isModalOpen: false
                        })
                    }}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0,
                    }}>
                    <View style={{ width: deviceWidth, height: deviceHeight * 0.5, backgroundColor: colors.white }}>
                        <View style={{ flex: 1, width: deviceWidth * 0.9, alignSelf: 'center' }}>
                            <View style={{ width: '100%', height: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    color: colors.toolbar_bg_color,
                                    fontWeight: 'bold', textTransform: 'uppercase', flex: 1
                                }}>{'Select Inspection Type'}</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({
                                        isModalOpen: false
                                    })}
                                >
                                    <AntDesign name='closecircle' color={colors.toolbar_bg_color} size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <FlatList
                                    data={this.state.infectionType}
                                    renderItem={this.renderModalItem}
                                    style={{ flex: 1 }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

            </Root>
        );
    }
}