import React, { Component, createRef } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, PermissionsAndroid } from 'react-native';
import styles from '../../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem, Right, Left, Switch,
    Text, Body, Form, Item, Picker
} from 'native-base';

import { CheckBox, Avatar, Icon, Input, Slider } from 'react-native-elements';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import Errors from '../../../Components/Errors';
import API from '../../../Api/Api';
import Loader from '../../../Components/Loader';
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

export default class RegisterCompany extends Component {
    constructor(props) {
        super(props)
        this.state = {
            avatarSource: '',
            errors: [],
            profilePic: '',
            fname: '',
            lname: '',
            email: '',
            phone: '',
            companyName: '',
            companyEmail: '',
            companyPhone: '',
            address: '',
            state: '',
            city: '',
            zipcode: '',
            inspectionType: '',
            bio: '',
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
        }
    }

    componentDidMount() {
        this.getStateList();
    }

    getStateList = async () => {
        var response = await new API('StateList', { "stateid": 0, "flag": 1 }).getResponse();
        try {
            if (response.statuscode == 200 && response.result) {
                this.setState({ stateList: response.result })
                this.setState({ cityList: [] })
                this.setState({ inspectioncityList: [] })

            }
            else {
                throw 'API Error in State List API';
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    async getCityList(stateId) {
        var response = await new API('CityList', { "stateid": stateId, "flag": 2 }).getResponse();
        try {
            if (response.statuscode == 200 && response.result) {
                return response.result;
            }
            else {
                throw 'API Error in City List API';
            }
        } catch (error) {
            console.log('error: ', error);
        }
    }

    getCities = async (stateId) => {
        this.setState({ state: stateId });
        var cities = await this.getCityList(stateId);
        this.setState({ cityList: cities })
    }

    validateEmail(email) {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return true;
        }
        return false;
    }


    validate = () => {
        var messages = [];
        this.setState({ submit: true });
        messages.push(!this.state.avatarSource && 'Select Profile Pic');
        messages.push(!this.state.fname && 'First Name required');
        messages.push(!this.state.lname && 'Last Name required');
        messages.push(!this.state.email && 'Email required');
        messages.push(!this.state.phone && 'Phone no required');
        messages.push(!this.state.companyName && 'Company Name required');
        messages.push(!this.state.companyEmail && 'Company Email required');
        messages.push(!this.state.companyPhone && 'Company Phone No required');
        messages.push(!this.state.address && 'Select Address');
        messages.push(!this.state.state && 'Select State');
        messages.push(!this.state.city && 'Select City');
        messages.push(!this.state.zipcode && 'Zipcode required');
        messages.push(!this.state.inspectionType && 'Inspection Type required');
        messages.push(!this.state.bio && 'Bio required');
        messages.push(!this.state.password && 'Password required');
        messages.push(!this.state.inspectionZipcode && 'Inspection Zipcode required');
        // messages.push(!this.state.inspectionCity  && 'Select Inspection City');
        // messages.push(!this.state.inspectionState  && 'Select Inspection State');
        messages.push(!this.state.confirmPassword && 'Confirmation Password required');
        if (this.state.password && this.state.confirmPassword) {
            if (this.state.password != this.state.confirmPassword) {
                messages.push("Both password should be same");
            }
        }
        if (this.state.email && !this.validateEmail(this.state.email)) {
            messages.push('Invalid Email');
        }
        if (this.state.companyEmail && !this.validateEmail(this.state.companyEmail)) {
            messages.push('Invalid Company Email');
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
        await AsyncStorage.setItem("roleid", profile.RoleId);
        await AsyncStorage.setItem("userid", profile.userid);
        await AsyncStorage.setItem("authToken", profile.AuthToken);
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        this.props.navigation.navigate('CompanyHome')
    }

    onRegister = async () => {
        if (this.validate()) {
            this.setState({ loading: true });
            await this.getRequestData().then(data => {
                console.log("request : ", data);
                var response = new API('RegisterCompany', data).getResponse();
                response.then(result => {
                    console.log("response: ", result);
                    if (result.statuscode == 200 && result.result.userid) {
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
        const deviceId = await AsyncStorage.getItem("deviceId");
        const fcmToken = await AsyncStorage.getItem("fcmToken");

        return {
            "roleid": this.state.role,
            "fname": this.state.fname,
            "lname": this.state.lname,
            "emailid": this.state.email,
            "mobileno": this.state.phone,
            "password": this.state.password,
            "profilepic": this.state.profilePic,
            "loginprovider": "",
            "providerkey": "",
            "address": this.state.address,
            "country": "USA",
            "state": this.state.state,
            "city": this.state.city,
            "zipcode": this.state.zipcode,
            "deviceid": deviceId,
            "fcmregid": fcmToken,
            "companyname": this.state.companyName,
            "companyemail": this.state.companyEmail,
            "distance": this.state.distance,
            "companybio": this.state.bio,
            "companyphone": this.state.companyPhone,
            "inspection_type": [{ "inspection_type_id": this.state.inspectionType }],
            "inspectionzipcode": this.state.inspectionZipcode,
            "availability": this.state.availability
        }
    }

    async showInspectionCities(value) {
        this.setState({ inspectionState: value });
        var cities = await this.getCityList(value);
        this.setState({ inspectioncityList: cities });
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
            this.uploadPicApi(response);
        }
    }

    async uploadPicApi(response) {
        this.setState({ loading: true });
        var body = new FormData();
        var pic = response;
        body.append('file', { uri: response.uri, name: response.fileName, filename: response.fileName, type: response.type });
        var response = await new API('UploadPic', body).getResponse();
        console.log("file response: ", response);
        this.setState({ loading: false });
        try {
            if (response.statuscode == 200 && response.result) {
                this.setState({
                    profilePic: response.result[0].mediaName
                });
                const source = { uri: pic.uri };
                this.setState({
                    avatarSource: source,
                });
            }
            else {
                throw 'API Error in Upload Photo API';
            }
        } catch (error) {
            this.setState({ loading: false });
            console.log('error: ', error);
        }
    }

    showState() {
        return this.state.stateList.map(state => <Picker.Item key={state.stateid} label={state.statename} value={state.stateid} />)
    }
    getSelectedColor(status) {
        return status ? '#28558E' : '#808080';
    }

    getIcon() {
        return <Icon name='times-circle-o' color='red' type='font-awesome' />
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }

        var fname = !this.state.fname && this.state.submit ? true : false;
        var lname = !this.state.lname && this.state.submit ? true : false;
        var email = !this.state.email && this.state.submit ? true : false;
        var phone = !this.state.phone && this.state.submit ? true : false;
        var companyName = !this.state.companyName && this.state.submit ? true : false;
        var companyEmail = !this.state.companyEmail && this.state.submit ? true : false;
        var companyPhone = !this.state.companyPhone && this.state.submit ? true : false;
        var address = !this.state.address && this.state.submit ? true : false;
        var state = !this.state.state && this.state.submit ? true : false;
        var city = !this.state.city && this.state.submit ? true : false;
        var zipcode = !this.state.zipcode && this.state.submit ? true : false;
        var inspectionType = !this.state.inspectionType && this.state.submit ? true : false;
        var bio = !this.state.bio && this.state.submit ? true : false;
        // var inspectionState = !this.state.inspectionState && this.state.submit ? true : false;
        // var inspectionCity = !this.state.inspectionCity && this.state.submit ? true : false;
        var password = !this.state.password && this.state.submit ? true : false;
        var confirmPassword = !this.state.confirmPassword && this.state.submit ? true : false;
        var inspectionZipcode = !this.state.inspectionZipcode && this.state.submit ? true : false;

        return (
            <ScrollView
                ref='_scrollView'
                onContentSizeChange={() => { this.refs._scrollView.scrollTo({ x: 0, y: 0, animated: true }); }}
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
                    <View style={styles.registerFormContainer}>
                        <Form>
                            <Errors errors={this.state.errors} />
                            <View style={styles.twoRow}>
                                <Item style={[styles.formItem, styles.halfRow]}>
                                    <Input inputContainerStyle={fname && styles.inputError} rightIcon={fname && this.getIcon()} errorMessage={fname && "First Name required"} value={this.state.fname} onChangeText={(text) => this.setState({ 'fname': text })} placeholder="First Name" inputStyle={[styles.font15]} />
                                </Item>
                                <Item style={[styles.formItem, styles.halfRow]}>
                                    <Input inputContainerStyle={lname && styles.inputError} rightIcon={lname && this.getIcon()} errorMessage={lname && "Last Name required"} value={this.state.lname} onChangeText={(text) => this.setState({ 'lname': text })} placeholder="Last Name" inputStyle={[styles.font15]} />
                                </Item>
                            </View>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={email && styles.inputError} rightIcon={email && this.getIcon()} errorMessage={email && "Email required"} value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[styles.font15]} autoCapitalize='none' />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={phone && styles.inputError}
                                    rightIcon={phone && this.getIcon()}
                                    errorMessage={phone && "Phone no required"}
                                    value={this.state.phone}
                                    onChangeText={(text) => this.setState({ 'phone': text })}
                                     placeholder="Phone No" inputStyle={[styles.font15]} 
                                     keyboardType='number-pad'
                                     />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={companyName && styles.inputError} rightIcon={companyName && this.getIcon()} errorMessage={companyName && "Company Name required"} value={this.state.companyName} onChangeText={(text) => this.setState({ 'companyName': text })} placeholder="Company Name" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={companyEmail && styles.inputError} rightIcon={companyEmail && this.getIcon()} errorMessage={companyEmail && "Company email required"} value={this.state.companyEmail} onChangeText={(text) => this.setState({ 'companyEmail': text })} placeholder="Company Email" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={companyPhone && styles.inputError} rightIcon={companyPhone && this.getIcon()} errorMessage={companyPhone && "Company phone required"} value={this.state.companyPhone} onChangeText={(text) => this.setState({ 'companyPhone': text })} placeholder="Company Phone No" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={address && styles.inputError} rightIcon={address && this.getIcon()} errorMessage={address && "Address required"} value={this.state.address} onChangeText={(text) => this.setState({ 'address': text })} placeholder="Address" inputStyle={[styles.font15]} />
                            </Item>
                            <View style={styles.twoRow}>
                                <Item style={[styles.thriceRow]}>
                                    <Picker
                                        mode="dialog"
                                        selectedValue={this.state.state}
                                        onValueChange={(value) => this.getCities(value)}
                                    >
                                        <Picker.Item label="Select" value="" />
                                        {this.showState()}
                                    </Picker>
                                </Item>
                                <Item style={[styles.thriceRow]}>
                                    <Picker
                                        mode="dialog"
                                        selectedValue={this.state.city}
                                        onValueChange={(value) => this.setState({ city: value })}
                                    >
                                        <Picker.Item label="City" value="" />
                                        {this.state.cityList.map(city => <Picker.Item key={city.cityid} label={city.cityname} value={city.cityid} />)}
                                    </Picker>
                                </Item>
                                <Item style={[styles.formItem, styles.thriceRow]}>
                                    <Input inputContainerStyle={zipcode && styles.inputError} rightIcon={zipcode && this.getIcon()} errorMessage={zipcode && "Zipcode"} value={this.state.zipcode} onChangeText={(text) => this.setState({ 'zipcode': text })} placeholder="Zipcode" inputStyle={[styles.font15]} />
                                </Item>
                            </View>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={inspectionType && styles.inputError} rightIcon={inspectionType && this.getIcon()} errorMessage={inspectionType && "Inspection type required"} value={this.state.inspectionType} onChangeText={(text) => this.setState({ 'inspectionType': text })} placeholder="Inspection Type" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={bio && styles.inputError} rightIcon={bio && this.getIcon()} errorMessage={bio && "Bio required"} value={this.state.bio} onChangeText={(text) => this.setState({ 'bio': text })} placeholder="Add Bio" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={password && styles.inputError} rightIcon={password && this.getIcon()} errorMessage={password && "Password required"} secureTextEntry={true} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Password" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={confirmPassword && styles.inputError} rightIcon={confirmPassword && this.getIcon()} errorMessage={confirmPassword && "Password confirmation required"} secureTextEntry={true} value={this.state.confirmPassword} onChangeText={(text) => this.setState({ 'confirmPassword': text })} placeholder="Confirm Password" inputStyle={[styles.font15]} />
                            </Item>
                            <Item style={[styles.registerOtherComponents, { paddingLeft: 10 }]}>
                                <View style={[styles.row, styles.registerOtherComponents]}>
                                    <Text style={[styles.registerOtherComponentsText, styles.twoRow]}>Set Availability :-</Text>
                                    <View style={[styles.twoRow, { alignItems: 'flex-end', justifyContent: 'flex-end' }]}>
                                        <Switch
                                            value={this.state.availability}
                                            style={{ marginRight: 20 }}
                                            onValueChange={(value) => this.setState({ availability: value })}
                                            thumbColor={this.getSelectedColor(this.state.availability)}
                                            trackColor={{ true: this.getSelectedColor(this.state.availability) }}
                                            ios_backgroundColor={{ true: this.getSelectedColor(this.state.availability) }}
                                        />
                                    </View>
                                </View>
                            </Item>
                            <Item style={[{ paddingHorizontal: 10 }, styles.formItem]}>
                                <View style={styles.registerOtherComponents}>
                                    <Text style={styles.registerOtherComponentsText}>Set Distance :-</Text>
                                    <Slider
                                        value={this.state.distance}
                                        onValueChange={value => this.setState({ distance: value })}
                                        thumbTintColor="#28558E"
                                        minimumValue={1}
                                        maximumValue={50}
                                        step={1}
                                        minimumTrackTintColor={this.getSelectedColor(this.state.distance)}
                                    />
                                    <View style={[styles.row]}>
                                        <Text style={[styles.registerOtherComponentsText, styles.twoRow]}>{this.state.distance} mile</Text>
                                        <Text style={[styles.registerOtherComponentsText, styles.twoRow, { textAlign: 'right' }]}>50 mile</Text>
                                    </View>
                                </View>
                            </Item>
                            <Item style={[styles.formItem]}>
                                <Input inputContainerStyle={inspectionZipcode && styles.inputError} rightIcon={inspectionZipcode && this.getIcon()} errorMessage={inspectionZipcode && "Inspection Zipcode required"} value={this.state.inspectionZipcode} onChangeText={(text) => this.setState({ 'inspectionZipcode': text })} placeholder="Please Enter Inspection Zip Code" inputStyle={[styles.font15]} />
                            </Item>



                            <View style={[styles.center, { marginTop: 20 }]}>
                                <Button style={styles.loginButton} onPress={() => this.onRegister()}>
                                    <Text style={styles.textCenter}>SIGN UP</Text>
                                </Button>
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