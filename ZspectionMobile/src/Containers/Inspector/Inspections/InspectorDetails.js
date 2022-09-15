import React, { Component, createRef } from 'react';
import { Platform, StyleSheet, View, ScrollView, FlatList, Image, PermissionsAndroid, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/style.js';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import {
    Container, Header, Content, Card, CardItem,
    Text, Body, Form, Item, Toast, Root, Picker
} from 'native-base';
import styles from '../../../../assets/styles/style.js';

import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import Loader from '../../../Components/Loader';
import { API } from "../../../network/API";
import Common from '../../../Containers/Common';
import ImageResizer from 'react-native-image-resizer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ifEmailExists } from '../../../utils.js';
import moment from "moment";
import { formatPhoneNumber } from '../../../utils/utils.js';

const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
    mediaType: 'photo',
    cameraType: 'back'
};
const optionsGallery = {
    mediaType: 'mixed',
};

export default class InspectorDetails extends Component {

    constructor(props) {
        super(props)
        this.state = {
            inspectionType: '',
            inspectionData: [],
            availability: [],
            avatarSource: '',
            profilePic: '',
            employeeId: '',
            password: '',
            firstName: '',
            lastName: '',
            inspector_id: 0,
            isDatePickerVisible: false,
            pickerTime: '00:00',
            pickerKey: '',
            pickerInputName: '',
            email: '',
            phone: '',
            zipcode: '',
            distance: 0,
            loading: false,
            submit: false,
            errors: [],
            pricemetrix: [],
            checkAllStatus: false,
            pic_data: {},
            inspectorData: '',
            timing: [
                { weekdays_id: 1, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Monday' },
                { weekdays_id: 2, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Tuesday' },
                { weekdays_id: 3, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Wednesday' },
                { weekdays_id: 4, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Thursday' },
                { weekdays_id: 5, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Friday' },
                { weekdays_id: 6, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Saturday' },
                { weekdays_id: 7, checked: false, start_time: '2021-12-24T02:30:48.390Z', start_display_time: '2021-12-24T02:30:48.390Z', end_display_time: '2021-12-24T12:30:53.788Z', end_time: '2021-12-24T12:30:53.788Z', day: 'Sunday' }
            ]
        }
        this.common = new Common();

    }


    showDatePicker = async (time, key, name) => {
        console.log(time, key, name)
        this.setState({ isDatePickerVisible: true, pickerTime: new Date(), pickerKey: key, pickerInputName: name })
    };


    onChange = (event, selectedDate) => {
        this.hideDatePicker()
        let time = event?.nativeEvent?.timestamp
        if (time) {
            console.log(event?.nativeEvent?.timestamp, this.state.pickerKey, this.state.pickerInputName);
            this.setAvailability(event?.nativeEvent?.timestamp, this.state.pickerKey, this.state.pickerInputName)
        }
    };

    hideDatePicker = () => {
        this.setState({ isDatePickerVisible: false })
    };

    getCompanyInspectionTypes = async () => {
        this.setState({ loading: true });
        let companyId = await AsyncStorage.getItem('companyId');
        API.fetchCompanyInfectionByCoID(this.fetchCompanyInfectionByCoIDRes, companyId)
        /* try {
             this.setState({ loading: true });
             let companyId = await AsyncStorage.getItem('companyId');
             console.log("Getting inspection types : ")
             var response = await new API('CompanyInspectionsForInspector', {}).getApiResponse('/' + companyId);
             console.log("Response : ", response)
             if (response.status == 200) {
                 this.setState({ loading: false, inspectionData: response.data });
             } else {
                 this.setState({ loading: false });
                 his.common.showToast(response.message);
             }
         } catch (error) {
             this.setState({ loading: false });
             this.common.showToast("" + error);
         }*/
    }


    getInspecorFromID = async () => {
        this.setState({ loading: true });
        let companyId = await AsyncStorage.getItem('inspectorID');
        API.fetchInspectorDetails(this.inspectorDetailsRes, companyId)
        /* try {
             this.setState({ loading: true });
             let companyId = await AsyncStorage.getItem('companyId');
             console.log("Getting inspection types : ")
             var response = await new API('CompanyInspectionsForInspector', {}).getApiResponse('/' + companyId);
             console.log("Response : ", response)
             if (response.status == 200) {
                 this.setState({ loading: false, inspectionData: response.data });
             } else {
                 this.setState({ loading: false });
                 his.common.showToast(response.message);
             }
         } catch (error) {
             this.setState({ loading: false });
             this.common.showToast("" + error);
         }*/
    }

    inspectorDetailsRes = {
        success: (response) => {
            this.setState({
                inspectorData: response.data,
                inspectionType: '',
                avatarSource: '',
                profilePic: '',
                employeeId: response.data.employeeId,
                password: '',
                firstName: response.data.firstName,
                lastName: response.data.lastName,
                inspector_id: response.data.inspectorId,
                isDatePickerVisible: false,
                pickerTime: '00:00',
                pickerKey: '',
                pickerInputName: '',
                email: response.data.emailId,
                phone: response.data.mobileNumber,
                zipcode: response.data.zipCode,
                distance: 0,
                loading: false,
                submit: false,
                errors: [],
                pricemetrix: [],
                checkAllStatus: false,
                pic_data: {},
                loading: false
            })
        },
        error: (error) => {
            console.log("pppppppppp e>>", error)
            this.setState({ loading: false })
        }
    }



    fetchCompanyInfectionByCoIDRes = {
        success: (response) => {
            this.setState({ loading: false, inspectionData: response.data });
        },
        error: (error) => {
            this.setState({ loading: false, inspectionData: [] });
        }
    }

    async componentDidMount() {
        await this.getInspecorFromID()
        await this.getCompanyInspectionTypes();

    }




    async success() {
        var authToken = await AsyncStorage.getItem("authToken");
        await this.getRequestData().then(data => {
            console.log("Auth_Token :", data);
            this.props.navigation.navigate('Maps', { "profile": data })
            //    this.props.navigation.navigate('Maps', { "profile": data })
        })

    }

    saveInspector = async () => {
        var timingError = true;
        for (var i = 0; i < this.state.timing.length; i++) {
            if (this.state.timing[i].weekdays_id) {
                timingError = false;
            }
        }
        if (!this.state.employeeId) {
            this.common.showToast('Please enter your employee iD');
            this.employeeId.focus()
        }
        else if (!this.state.firstName) {
            this.common.showToast('Please enter first name');
            this.inspectorName.focus()
        }
        else if (!this.state.lastName) {
            this.common.showToast('Please enter last name');
            this.inspectorName.focus()
        }
        else if (!this.state.password) {
            this.common.showToast('Please enter your password');
            this.password.focus()
        }
        else if (!this.state.email) {
            this.common.showToast('Please enter your email id');
            this.email.focus()
        }
        else if (this.state.email && !this.common.validateEmail(this.state.email)) {
            this.common.showToast('Please enter valid email id');
            this.email.focus()
        }
        else if (!this.state.phone) {
            this.common.showToast('Please enter your phone number');
            this.phone.focus()
        }
        else if (this.state.phone) {
            this.common.showToast('Please enter valid phone number');
            this.phone.focus()
        }
        else if (timingError) {
            this.common.showToast('Please select timing');
        }
        // else if (this.state.inspectionType=='') {
        //     this.common.showToast('Please select inspection type');
        // }
        else {
            this.setState({ loading: false })
            this.success()
            // let res = await ifEmailExists(this.state.email);
            // this.setState({ loading: false })
            // console.log("Validate email response is :", res);
            // if (res.values && res.values == true) {
            //     this.success()
            // }
            // else {
            //     this.email.focus();
            //     this.common.showToast('Email address already exists!')
            // }
        }
        return false;
    }

    getHoursArray = async () => {
        let companyId = JSON.parse(await AsyncStorage.getItem('companyId'));
        let hoursArray = [];
        this.state.timing.map((item, index) => {
            console.log("dsadsadsadsada >>", this.state.timing)
            let data = {};
            data["ihourId"] = index + 1;
            data["inspectorId"] = 0;
            data["daynumber"] = index + 1;
            data["startTime"] = moment(item.start_time).format('HH:mm:ss');
            data["endTime"] = moment(item.end_time).format('HH:mm:ss');
            data["available"] = item.weekdays_id == 0 ? false : true;
            data["companyId"] = parseInt(companyId);
            hoursArray.push(data);
        })
        return hoursArray;
    }

    async getRequestData() {
        let companyId = JSON.parse(await AsyncStorage.getItem('companyId'));
        let hoursArray = await this.getHoursArray();
        return {
            "inspectorID": 0,
            "firstName": this.state.firstName,
            "lastName": this.state.lastName,
            "emailId": this.state.email,
            "employeeId": this.state.employeeId,
            "userID": this.state.employeeId,
            "mobileNumber": this.state.phone,
            "profilePic": this.state.profilePic,
            "pic_data": this.state.pic_data,
            "password": this.state.password,
            "companyId": parseInt(companyId),
            "iHours": hoursArray,
            "inspectionTypeId": this.state.inspectionType,
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


    setAvailability(stateValue, key, field) {
        var timing = [...this.state.timing];
        if (field == "day") {
            if (stateValue) {
                this.state.timing[key].weekdays_id = 0;
            }
            else {
                this.state.timing[key].weekdays_id = key + 1;
            }

        }

        if (field == "start_time") {
            timing[key].start_display_time = stateValue;
            timing[key].start_time = stateValue //this.getTwentyFourHourTime(stateValue);
        }
        if (field == "end_time") {
            timing[key].end_display_time = stateValue;
            timing[key].end_time = stateValue //this.getTwentyFourHourTime(stateValue);
        }
        console.log(timing[key])
        this.setState({ timing })
    }

    getTwentyFourHourTime(amPmString) {
        var d = new Date("1/1/2013 " + amPmString);
        return (d.getHours() < 10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
    }

    getDisplayDate = (date) => {
        var format = date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
        console.log("format: ", format);
        return format;

    }

    printAvailability() {
        return this.state.timing.map((item, key) => {
            var checkStatus = this.state.timing[key].weekdays_id > 0 ? true : false;
            // var start_time = this.state.timing[key].start_display_time;
            // var end_time = this.state.timing[key].end_display_time;

            var start_time = moment(this.state.timing[key].start_display_time).format('h:mm A');
            var end_time = moment(this.state.timing[key].end_display_time).format('h:mm A');

            return (
                <View key={key} style={[{ backgroundColor: (key % 2 == 0) ? '#ecf0f1' : '#fff' }, style.twoRow]}>
                    <View style={style.threeRow}>
                        <CheckBox
                            containerStyle={{ padding: 0, borderWidth: 0, marginHorizontal: 0, backgroundColor: 'transparent' }}
                            textStyle={{ fontWeight: 'normal' }}
                            title={item.day}
                            checked={checkStatus}
                            checkedColor="#28558E"
                            onPress={() => this.setAvailability(checkStatus, key, 'day')}
                        />
                    </View>

                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => this.showDatePicker(start_time, key, 'start_time')}>

                                <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}> {start_time} </Text>
                                <Icon
                                    size={18}
                                    name="clock-o"
                                    type="font-awesome"
                                    color="black"
                                    containerStyle={{ textAlignVertical: 'center' }}
                                />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[style.equal, { marginLeft: 5 }]}>-</Text>
                    </View>
                    <View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5 }}>
                            <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => this.showDatePicker(end_time, key, 'end_time')}>

                                <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}> {end_time} </Text>
                                <Icon
                                    size={18}
                                    name="clock-o"
                                    type="font-awesome"
                                    color="black"
                                    containerStyle={{ textAlignVertical: 'center' }}
                                />
                            </TouchableOpacity>
                        </View>
                        {/* <DatePicker
                            style={{width:90}}
                            mode="time"
                            is24Hour={false}
                            date={end_time}
                            format='h:mm A'
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            onDateChange={(end_time) => { this.setAvailability(end_time, key, 'end_time') }}
                            iconComponent={
                                <Icon
                                    size={0}
                                    name='clock-o'
                                    type='font-awesome'
                                    containerStyle={style.dateIcon}
                                />
                            }
                            customStyles={{
                                dateText: style.dateText,
                                dateInput: {borderWidth:0}
                            }}
                        /> */}
                    </View>
                </View>
            )
        })
    }

    checkAll = () => {
        var timing = this.state.timing;

        if (!this.state.checkAllStatus) {
            var times = timing[0]
            var newTime = [];
            const { start_time, start_display_time, end_time, end_display_time } = times;
            timing.map((time, index) => {
                console.log("index: ", index)
                var list = { weekdays_id: index + 1, start_time: start_time, start_display_time: start_display_time, end_time: end_time, end_display_time: end_display_time, day: time.day }
                newTime.push(list)

            })
        }
        else {
            var newTime = [];
            timing.map((time, index) => {
                var list = time;
                list.weekdays_id = 0;
                newTime.push(list)
            })
        }
        this.setState({ timing: newTime, checkAllStatus: !this.state.checkAllStatus })
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        let dropDownArray = this.state.inspectionData.length > 0 && this.state.inspectionData.map((element) => element.name)
        return (
            <Root>
                <ScrollView>
                    <View>
                        <View style={style.registerImageContainer}>
                            <Avatar
                                size={100}
                                onPress={() => this.requestCameraPermission()}
                                overlayContainerStyle={{ backgroundColor: '#FFF' }}
                                rounded icon={{ name: 'plus', type: 'font-awesome', color: '#C39666', size: 25 }}
                                containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                                source={this.state.avatarSource}
                                imageProps={{ resizeMode: 'cover' }}
                            />
                        </View>
                        <View style={style.registerFormContainer}>
                            <Form>
                                <View>
                                    <Input autoCompleteType="off"
                                        ref={employeeId => { this.employeeId = employeeId }}
                                        value={this.state.employeeId}
                                        onChangeText={(text) => this.setState({ 'employeeId': text })}
                                        placeholder="Employee Id" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={firstName => { this.firstName = firstName }} value={this.state.firstName} onChangeText={(text) => this.setState({ 'firstName': text })} placeholder="First Name" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={lastName => { this.lastName = lastName }} value={this.state.lastName} onChangeText={(text) => this.setState({ 'lastName': text })} placeholder="Last Name" inputStyle={[style.font15]} />
                                </View>
                                <View style={style.border}>
                                    <Picker
                                        mode="dialog"
                                        selectedValue={this.state.inspectionType}
                                        ref={inspectionType => { this.inspectionType = inspectionType }}
                                        onValueChange={(value) => this.setState({ inspectionType: value })}
                                    >
                                        <Picker.Item label="Inspection type" value="" />
                                        {this.state.inspectionData.map(inspection => <Picker.Item key={inspection.id} label={inspection.name} value={inspection.id} />)}
                                    </Picker>
                                </View>

                                <View>
                                    <Input autoCompleteType="off" ref={password => { this.password = password }} secureTextEntry={true} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Password" inputStyle={[style.font15]} />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={email => { this.email = email }} keyboardType="email-address" value={this.state.email} onChangeText={(text) => this.setState({ 'email': text })} placeholder="Email" inputStyle={[style.font15]} autoCapitalize='none' />
                                </View>
                                <View>
                                    <Input autoCompleteType="off" ref={phone => { this.phone = phone }}
                                        keyboardType="numeric" value={this.state.phone}
                                        onChangeText={(text) => this.setState({ 'phone': formatPhoneNumber(text) })}
                                        placeholder="Phone No" inputStyle={[style.font15]} maxLength={14} />
                                </View>
                                <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    {/* <Text style={[style.heading, style.lineSpacing]}>Job Schedule</Text> */}
                                    <Text style={[style.heading, style.lineSpacing]}>Hours</Text>
                                    <CheckBox
                                        right
                                        title='Check All'
                                        checkedColor="#28558E"
                                        size={18}
                                        iconRight
                                        textStyle={{ color: '#28558E' }}
                                        checked={this.state.checkAllStatus ? true : false}
                                        containerStyle={{ backgroundColor: '#FFF', borderColor: '#FFF', paddingRight: 0 }}
                                        onPress={() => this.checkAll()}
                                    />
                                </View>
                                {this.state.isDatePickerVisible &&
                                    <DateTimePicker
                                        testID="dateTimePicker"
                                        value={this.state.pickerTime}
                                        mode='time'
                                        is24Hour={false}
                                        display="default"
                                        onChange={this.onChange}
                                    />
                                }

                                <View>{this.printAvailability()}</View>
                                <View style={style.nextButtonWrapper}>
                                    <Button
                                        title="Next"
                                        buttonStyle={style.btnNext}
                                        icon={<Icon name="angle-right" containerStyle={{ position: 'absolute', right: 10 }} type="font-awesome" color="#FFF" />}
                                        iconRight
                                        onPress={() => this.saveInspector()}
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