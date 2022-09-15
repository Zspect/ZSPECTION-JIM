import React, { Component, createRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
  PermissionsAndroid
} from 'react-native';
import style from '../../../assets/styles/style.js';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import {
  Container,
  Header,
  Content,
  Button,
  Card,
  CardItem,
  Text,
  Body,
  Form,
  Item,
  Toast,
  Root,
  Picker
} from 'native-base';

import { CheckBox, Avatar, Icon, Input, Slider } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API } from "../../network/API";
import Loader from '../../Components/Loader';
import Errors from '../../Components/Errors';
import Common from '../Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import { formatPhoneNumber } from '../../utils/utils.js';




const SW = Dimensions.get('window').width;
const SH = Dimensions.get('window').height;
const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
  mediaType: 'photo',
  cameraType: 'back'
};
const optionsGallery = {
  mediaType: 'mixed',
};
let cid = 0

let initState = {
  inspectorList: [],
  inspectorID: '',
  companyID: '',
  checkAllStatus: false,
  isDatePickerVisible: false,
  pickerTime: '00:00',
  pickerKey: '',
  pickerInputName: '',
  availability: [],
  avatarSource: '',
  profilePic: '',
  employeeId: '',
  inspectionZipcode: '',
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  distance: 1,
  loading: false,
  submit: false,
  errors: [],
  profile: {},
  timing: [
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Monday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Tuesday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Wednesday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Thursday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Friday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Saturday',
    },
    {
      weekend_id: 0,
      startDisplayTime: '2021-12-23T18:30:00.000Z',
      endDisplayTime: '2021-12-23T18:30:00.000Z',
      start_time: '2021-12-23T18:30:00.000Z',
      end_time: '2021-12-23T18:30:00.000Z',
      day: 'Sunday',
    },
  ],
}

export default class CompanyInspectorsAvailability extends Component {
  constructor(props) {
    super(props);

    this.state = initState
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

  handleConfirm = (date) => {
    console.warn("A date has been picked: ", date);
    this.hideDatePicker();
  };

  onFocus = (payload) => {
    this.setState(initState)
    this.getInspectors();
  }
  componentDidMount() {

    this.focusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.onFocus(payload);
      }
    );
  }
  componentWillUnmount() {
    this.focusSubscription.remove();
  }

  getInspectors = async () => {
    cid = await AsyncStorage.getItem('companyId');
    this.setState({ loading: true });
    API.fetchCompanyInspector(this.companyInspector, cid)

    /*let response = await new API('CompanyInspectors', {}).getApiResponse(
      '/' + cid,
    );
    console.log('Company Inspectors response is:', response);
    this.setState({loading: false});
    try {
      if (response.status == 200) {
        console.log('Response status is ;', response);
        if(response.data.length<1){
          this.props.navigation.navigate('CreateInspector')
        } else {
          this.setState({inspectorList: response.data, companyID: cid});
        }
      } else {
        this.common.showToast(response.message);
      }
    } catch (error) {
      this.common.showToast(error);
    }*/
  };

  companyInspector = {
    success: (response) => {
      console.log("company_inspector >>>", response)
      if (response.data.length < 1) {
        this.props.navigation.navigate('CreateInspector')
      } else {
        this.setState({
          inspectorList: response.data, companyID: cid,
          checkAllStatus: true,
        });
        this.setState({ loading: false });
      }
    },
    error: (error) => {
      console.log("company_inspector_error>>>", error)
    }
  }

  validate = () => {
    var messages = [];
    messages.push(!this.state.avatarSource && 'Select Profile Pic');
    messages.push(!this.state.employeeId && 'Employee Id required');
    messages.push(!this.state.firstName && 'Inspector First Name required');
    messages.push(!this.state.lastName && 'Inspector Last Name required');
    messages.push(!this.state.email && 'Inspector Email required');
    messages.push(!this.state.phone && 'Phone No required');
    if (this.state.email && !this.common.validateEmail(this.state.email)) {
      messages.push('Invalid Email');
    }
    if (this.state.phone) {
      messages.push('Invalid Phone Number');
    }
    var timingError = true;
    for (var i = 0; i < this.state.timing.length; i++) {
      if (this.state.timing[i].weekend_id > 0) {
        timingError = false;
      }
    }
    if (timingError) {
      messages.push('Select Timing');
    }
    var errorShow = [];
    messages = messages.filter(msg => {
      if (msg) {
        return msg;
      }
    });
    for (var i = 0; i < messages.length; i++) {
      var required = messages[i].indexOf('required');
      if (required > 0) {
      } else {
        errorShow.push(messages[i]);
      }
    }
    this.setState({ errors: errorShow });
    if (messages.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  updateInspector = {
    success: (response) => {
      console.log("company_update_inspector >>>", response)
      this.common.showToast(response.message);
      this.props.navigation.navigate('Services');
    },
    error: (error) => {
      console.log("company_update_inspector_error>>>", error)
      this.common.showToast(error.message);
    }
  }

  saveInspector = async () => {
    this.getRequestData().then(async (data) => {
      console.log("Request data is : ", data)
      API.updateInspectorFromCompany(this.updateInspector, data, this.state.profile.inspectorId)
      // var response = await new API('UpdateInspector', data).getResponse();
      // console.log("Response :", response.response);
      // if (response.response == 200) {
      //   this.common.showToast(response.message);
      //   this.props.navigation.navigate('Services');
      // }
    });

    /*if (this.validate()) {
      console.log("pppppppppp >>")
      this.getRequestData().then(async (data) => {
        console.log("Request data is : ", data)
        var response = await new API('UpdateInspector', data).getResponse();
        console.log("Response :", response.response);
        if (response.response == 200) {
          this.common.showToast(response.message);
          this.props.navigation.navigate('Services');
        }
      });
    }*/
  };


  getHoursArray = async () => {
    let companyId = this.state.profile.companyId;
    let hoursArray = [];

    this.state.timing.map((item, index) => {
      console.log("update_value >> ", item,item.weekend_id, item.weekend_id > 0 ? true : false)
      let data = {};
      let iHoursFromService = this.state.profile.ihour[index];
      data["ihourId"] = iHoursFromService.ihourId;
      data["inspectorId"] = this.state.profile.inspectorId;
      data["daynumber"] = iHoursFromService.daynumber;
      data["startTime"] = moment(item.start_time).format('HH:mm:ss');
      data["endTime"] = moment(item.end_time).format('HH:mm:ss');
      data["available"] = item.weekend_id == 0 ? false : true;
      data["companyId"] = parseInt(companyId);
      hoursArray.push(data);
    })
    return hoursArray;
  }

  async getRequestData() {
    var profile = JSON.parse(await AsyncStorage.getItem('profile'));
    var companyId = profile.CompanyId;
    console.log("Profile to upload :", this.state.distance);
    let hoursArraydata = await this.getHoursArray();
    return {
      iHours: hoursArraydata,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      employeeId: this.state.employeeId,
      mobileNumber: this.state.phone,
      //   emailId: this.state.profile.emailId,
      zipCode: this.state.inspectionZipcode,
      ilatitude: this.state.profile.ilatitude,
      ilongitude: this.state.profile.ilongitude,
      geoRadius: this.state.distance,
      // iHours: hoursArraydata,
      // firstName: this.state.profile.firstName,
      // lastName: this.state.profile.lastName,
      // employeeId: this.state.profile.employeeId,
      // mobileNumber: this.state.profile.mobileNumber,
      // //   emailId: this.state.profile.emailId,
      // zipCode: this.stateinspectionZipcode,
      // ilatitude: this.state.profile.ilatitude,
      // ilongitude: this.state.profile.ilongitude,
      // geoRadius: this.state.distance,
      // inspectionTypeId: this.state.profile.inspectionTypeId,
      //profilePic: this.state.profile.profilePic != undefined && this.state.profile.profilePic != null ? this.state.profile.profilePic : '',
    };
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
    console.log('Response = ', resp);
    if (resp.didCancel) {
      console.log('User cancelled image picker');
    } else if (resp.error) {
      console.log('ImagePicker Error: ', resp.error);
    } else if (resp.customButton) {
      console.log('User tapped custom button: ', resp.customButton);
    } else {
      let response = resp.assets[0]
      this.uploadPicApi(response);
    }

  }

  async uploadPicApi(response) {
    this.setState({ loading: true });
    var body = new FormData();
    var pic = response;
    body.append('file', {
      uri: response.uri,
      name: response.fileName,
      filename: response.fileName,
      type: response.type,
    });
    var response = await new API('UploadPic', body).getResponse();
    this.setState({ loading: false });
    try {
      if (response.statuscode == 200 && response.result) {
        this.setState({
          profilePic: response.result[0].mediaName,
        });
        const source = { uri: pic.uri };
        this.setState({
          avatarSource: source,
        });
      } else {
        throw 'API Error in Upload Photo API';
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  setAvailability(stateValue, key, field) {
    // console.log("stateValue: ",stateValue,"key: ",key,"field: ",field);
    if (field == 'day') {
      if (stateValue) {
        this.state.timing[key].weekend_id = 0;
      } else {
        this.state.timing[key].weekend_id = key + 1;
      }
    }
    if (field == 'start_time') {
      this.state.timing[key].start_time = stateValue;
      this.state.timing[
        key
      ].startDisplayTime = stateValue //this.common.getTwentyFourHourTime(stateValue);
      // displayTime: this.common.getTwentyFourHourTime(time)
    }
    if (field == 'end_time') {
      this.state.timing[key].end_time = stateValue;
      this.state.timing[key].endDisplayTime = stateValue //this.common.getTwentyFourHourTime(stateValue);
    }
    this.forceUpdate();
    // console.log(this.state.timing);
  }
  async convertMoment(value) {
    let now = moment();
    now.set({
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    console.log("time", now);

    return now;
  }

  printAvailability() {
    try {
      let now = moment();
      now.set({
        hour: 0,
        minute: 0,
        second: 0,
        millisecond: 0,
      })
      return this.state.timing.map((item, key) => {
        var checkStatus = this.state.timing[key].weekend_id > 0 ? true : false;
        var startTime = moment(this.state.timing[key].startDisplayTime).format('HH:mm');
        var endTime = moment(this.state.timing[key].endDisplayTime).format('HH:mm');
        console.log("poppoppo >", this.state.timing[key])

        return (
          <View key={key}>
            <View style={{ flexDirection: 'row', marginLeft: 5 }}>
              <View style={{ flexDirection: 'column', width: '100%' }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={styles.checkbox}>
                    <CheckBox
                      checked={checkStatus}
                      onPress={() =>
                        this.setAvailability(checkStatus, key, 'day')
                      }
                      checkedColor="#28558E"
                      size={18}
                      containerStyle={styles.loginContainerStyle}
                      color="#808080"
                      style={styles.loginCheckbox}
                    />
                    <Text>{item.day}</Text>
                  </View>
                  <View
                    style={{
                      justifyContent: 'center',
                      alignContent: 'center',
                      flexDirection: 'row',
                    }}>
                    <View style={styles.timeWrapper}>
                      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.showDatePicker(startTime, key, 'start_time')}>
                          <Text style={{ fontSize: 14, color: 'black' }}> {moment(startTime, "hh:mm").format('LT')} </Text>
                          <Icon
                            size={14}
                            name="clock-o"
                            type="font-awesome"
                            containerStyle={{ textAlignVertical: 'center', marginTop: 4 }}

                          />
                        </TouchableOpacity>
                      </View>

                    </View>
                    <Text style={styles.equal}>=</Text>
                    <View style={styles.timeWrapper}>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center' }} onPress={() => this.showDatePicker(endTime, key, 'end_time')}>

                          <Text style={{ fontSize: 14, color: 'black' }}> {moment(endTime, "hh:mm").format('LT')} </Text>
                          <Icon
                            size={14}
                            name="clock-o"
                            type="font-awesome"
                            containerStyle={{ textAlignVertical: 'center', marginTop: 4 }}
                          />
                        </TouchableOpacity>

                      </View>

                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        );
      });
    } catch (error) {
      console.log(error)
    }
  }

  checkAll = () => {
    var timing = this.state.timing;

    if (!this.state.checkAllStatus) {
      var times = timing[0];
      var newTime = [];
      const { start_time, startDisplayTime, end_time, endDisplayTime } = times;
      timing.map((time, index) => {
        var list = {
          weekend_id: index + 1,
          start_time: start_time,
          startDisplayTime: startDisplayTime,
          end_time: end_time,
          endDisplayTime: endDisplayTime,
          day: time.day,
        };
        newTime.push(list);
      });
    } else {
      var newTime = [];
      timing.map((time, index) => {
        var list = time;
        list.weekend_id = 0;
        newTime.push(list);
      });
    }
    this.setState({
      timing: newTime,
      checkAllStatus: !this.state.checkAllStatus,
    });
  };

  getSelectedColor(status) {
    return status ? '#28558E' : '#808080';
  }

  fetchInsRes = {
    success: (response) => {
      console.log("inspector >>>", response)
      if (response.code == 1000) {
        this.setState(
          {
            profile: response.data,
            avatarSource: response.data.profilePic,
            email: response.data.emailId,
            employeeId: response.data.employeeId,
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phone: response.data.mobileNumber,
            distance: response.data.geoRadius,
            inspectionZipcode: response.data.zipCode,
          },
          () => {
            let data = [];
            this.state.profile.ihour.map((item, index) => {
              let weekData = this.state.timing[index];
              console.log("inspecor_time >> ", item)
              weekData.weekend_id = item.available == true ? 1 : 0;
              weekData.start_time = moment(item.startTime, 'HH:mm');
              weekData.end_time = moment(item.endTime, 'HH:mm');
              weekData.startDisplayTime = moment(item.startTime, 'HH:mm');
              weekData.endDisplayTime = moment(item.endTime, 'HH:mm');
              // weekData.start_time = moment().add(moment.duration(item.startTime));
              // weekData.end_time = moment().add(moment.duration(item.endTime));
              // weekData.startDisplayTime = moment().add(moment.duration(item.startTime));
              // weekData.endDisplayTime = moment().add(moment.duration(item.endTime));
              data.push(weekData);
            });
            this.setState({ timing: data });
          },
        );
      }
      this.setState({ loading: false });
    },
    error: (error) => {
      console.log("inspector_error>>>", error)
      this.setState({ loading: false });
    }
  }


  getInspectorProfile = async inspectorId => {
    this.setState({ loading: true });
    API.fetchInspectorDetails(this.fetchInsRes, inspectorId)

    // let response = await new API('InspectorDetail', {}).getApiResponse(
    //   '/' + inspectorId,
    // );
    console.log('Inspector detail response is :', response);

  };
  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    var employeeId = !this.state.employeeId && this.state.submit ? true : false;
    var inspectionZipcode =
      !this.state.inspectionZipcode && this.state.submit ? true : false;
    var firstName =
      !this.state.firstName && this.state.submit ? true : false;
    var lastName =
      !this.state.lastName && this.state.submit ? true : false;
    var email = !this.state.email && this.state.submit ? true : false;
    var phone = !this.state.phone && this.state.submit ? true : false;

    return (
      <Root>
        <ScrollView>
          <View style={styles.container}>
            {/* <View style={styles.registerImageContainer}>
              <Avatar
                size={100}
                onPress={() => this.UploadPicture()}
                overlayContainerStyle={{backgroundColor: '#FFF'}}
                rounded
                icon={{name: 'person', color: '#C39666', size: 72}}
                containerStyle={{borderColor: '#C39666', borderWidth: 2}}
                source={{uri: 'http://' + this.state.avatarSource}}
                imageProps={{resizeMode: 'cover'}}
              />
            </View> */}

            <View style={style.registerFormContainer}>
              <Form>
                {this.state.inspectorList.length > 0 && (
                  <View
                    style={{
                      borderColor: '#838b95',
                      borderBottomWidth: SH * 0.001,
                    }}>
                    <Picker
                      mode="dialog"
                      selectedValue={this.state.inspectorID}
                      onValueChange={value =>
                        this.setState({ inspectorID: value }, () => {
                          console.log(
                            'Inspector value :',
                            this.state.inspectorID,
                          );
                          this.getInspectorProfile(this.state.inspectorID);
                        })
                      }>
                      <Picker.Item label="Choose Inspector" value="" />
                      {this.state.inspectorList.map(inspector => (
                        <Picker.Item
                          label={inspector.firstName + ' ' + inspector.lastName}
                          value={inspector.inspectorId}
                          key={inspector.inspectorId}
                        />
                      ))}
                    </Picker>
                    <Errors errors={this.state.errors} />
                  </View>
                )}
                <View>
                  <Input
                    autoCompleteType="off"
                    inputContainerStyle={employeeId && style.inputError}
                    rightIcon={employeeId && this.common.getIcon()}
                    errorMessage={employeeId && 'Employee id required'}
                    value={this.state.employeeId}
                    onChangeText={text => this.setState({ employeeId: text })}
                    placeholder="Employee Id"
                    inputStyle={[style.font15]}
                  />
                </View>
                <View>
                  <Input
                    autoCompleteType="off"
                    inputContainerStyle={firstName && style.inputError}
                    rightIcon={firstName && this.common.getIcon()}
                    errorMessage={firstName && 'First Name required'}
                    value={this.state.firstName}
                    onChangeText={text => this.setState({ firstName: text })}
                    placeholder="First Name"
                    inputStyle={[style.font15]}
                  />
                </View>
                <View>
                  <Input
                    autoCompleteType="off"
                    inputContainerStyle={lastName && style.inputError}
                    rightIcon={lastName && this.common.getIcon()}
                    errorMessage={lastName && 'Last Name required'}
                    value={this.state.lastName}
                    onChangeText={text => this.setState({ lastName: text })}
                    placeholder="Last Name"
                    inputStyle={[style.font15]}
                  />
                </View>
                <View>
                  <Input
                    autoCompleteType="off"
                    keyboardType="email-address"
                    inputContainerStyle={email && style.inputError}
                    rightIcon={email && this.common.getIcon()}
                    errorMessage={email && 'Email required'}
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })}
                    placeholder="Email"
                    inputStyle={[style.font15]}
                    autoCapitalize="none"
                  />
                </View>
                <View>
                  <Input
                    autoCompleteType="off"
                    keyboardType="numeric"
                    inputContainerStyle={phone && style.inputError}
                    rightIcon={phone && this.common.getIcon()}
                    errorMessage={phone && 'Phone No required'}
                    value={this.state.phone}
                    onChangeText={(text) => this.setState({ phone: formatPhoneNumber(text) })}
                    //onChangeText={text => this.setState({ phone: text })}
                    placeholder="Phone No"
                    inputStyle={[style.font15]}
                    maxLength={14}

                  />
                </View>
                <View
                  style={{
                    marginLeft: 10,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.heading}>Set Availability:-</Text>
                  <CheckBox
                    right
                    title="Check All"
                    checkedColor="#28558E"
                    size={18}
                    iconRight
                    textStyle={{ color: '#28558E' }}
                    checked={this.state.checkAllStatus ? true : false}
                    containerStyle={{
                      backgroundColor: '#FFF',
                      borderColor: '#FFF',
                      paddingRight: 0,
                    }}
                    onPress={() => this.checkAll()}
                  />
                  {/* <TouchableOpacity style={style.row} onPress={() => this.checkAll()}>
                                    
                                </TouchableOpacity> */}
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

                <Item style={[style.formItem]}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        style.registerOtherComponentsText,
                        style.primaryColor,
                      ]}>
                      Set Geofencing Radius :-
                    </Text>
                    <Slider
                      value={this.state.distance}
                      onValueChange={value => this.setState({ distance: value })}
                      thumbTintColor="#28558E"
                      minimumValue={1}
                      maximumValue={50}
                      step={1}
                      minimumTrackTintColor={this.getSelectedColor(
                        this.state.distance,
                      )}
                    />
                    <View style={[style.row]}>
                      <Text
                        style={[
                          style.registerOtherComponentsText,
                          style.twoRow,
                          style.primaryColor,
                        ]}>
                        {this.state.distance} mile
                      </Text>
                      <Text
                        style={[
                          style.registerOtherComponentsText,
                          style.twoRow,
                          style.primaryColor,
                          { textAlign: 'right' },
                        ]}>
                        50 mile
                      </Text>
                    </View>
                  </View>
                </Item>
                <View>
                  <Input
                    autoCompleteType="off"
                    keyboardType="numeric"
                    inputContainerStyle={inspectionZipcode && style.inputError}
                    rightIcon={inspectionZipcode && this.common.getIcon()}
                    errorMessage={
                      inspectionZipcode && 'Inspection Zip required'
                    }
                    value={this.state.inspectionZipcode}
                    onChangeText={text =>
                      this.setState({ inspectionZipcode: text })
                    }
                    placeholder="Please Enter Inspection Zip"
                    inputStyle={[style.font15]}
                  />
                </View>
                <View style={[style.center, { marginTop: 20 }]}>
                  <Button style={style.loginButton} onPress={() => this.saveInspector()}>
                    <Text style={style.textCenter}>Update</Text>
                  </Button>
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

const styles = StyleSheet.create({
  registerImageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  checkAll: {
    fontSize: 12,
  },
  avaibality: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 15,
  },
  registerFormContainer: {
    paddingLeft: 10,
    paddingRight: 30,
    overflow: 'hidden',
  },
  equal: {
    flexDirection: 'row',
    marginHorizontal: 15,
  },
  checkbox: {
    flexDirection: 'row',
  },
  formItem: {
    borderColor: '#808080',
  },
  loginContainerStyle: {
    paddingTop: 0,
    marginRight: 3,
    paddingRight: 0,
    paddingLeft: 3,
    marginTop: 3,
  },
  loginCheckbox: {
    borderColor: '#ccc',
    borderWidth: 1,
  },
  dateIcon: {
    position: 'absolute',
    left: 0,
    paddingBottom: 15,
  },
  dateText: {
    fontSize: 12,
  },
  dateIcon: {
    position: 'absolute',
    left: 0,
    paddingBottom: 15,
  },
  dateInput: {
    alignItems: 'flex-start',
    paddingLeft: 15,
    borderWidth: 0,
    paddingBottom: 15,
  },
  timeWrapper: {
    width: 70,
    borderBottomWidth: 1,
    marginBottom: 10,
  },
});
