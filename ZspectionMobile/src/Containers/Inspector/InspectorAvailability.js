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
import axios from 'axios';
import {
  Container,
  Header,
  Content,
  Card,
  CardItem,
  Text,
  Body,
  Form,
  Item,
  Picker,
  Toast,
  Root,
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';
let { width, height } = Dimensions.get('window');
const LATITUDE = 28.5355;
const LONGITUDE = 77.391;
const CONVERSION = 1610;
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 1.1922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const KEY = 'AIzaSyAaDd5zJGonIbsOhgePQo5j2H1vKJtBw4Y';

import DateTimePicker from '@react-native-community/datetimepicker';

import Loader from '../../Components/Loader';
import Errors from '../../Components/Errors';
import API from '../../Api/Api';
import Common from '../Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
const DW = Dimensions.get('window').width;
const DH = Dimensions.get('window').height;
import styles2 from '../../../assets/styles/style.js';
import ImageResizer from 'react-native-image-resizer';
import moment from "moment";
import { formatPhoneNumber } from '../../utils/utils.js';

const actionSheetRef = createRef();

let actionSheet;
const optionsCamera = {
  mediaType: 'photo',
  cameraType: 'back'
};
const optionsGallery = {
  mediaType: 'mixed',
};
export default class InspectorAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPicClicked: false,
      mile: 5,
      zip: '',
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      latitude: 0,
      longitude: 0,
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
      loading: false,
      submit: false,
      errors: [],
      profile: {},
      pic_data: {},
      isProfileActive: false,
      disableMode: true,
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
    };
    this.common = new Common();
  }
  onFocus = payload => {
    this.getInspectorProfile();
  };
  componentDidMount() {
    this.focusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.onFocus(payload);
      },
    );

  }
  componentWillUnmount() {
    this.focusSubscription.remove();
  }
  getInspectorProfile = async () => {
    let inspectorId = await AsyncStorage.getItem('inspectorID');
    this.setState({ loading: true });
    let response = await new API('InspectorDetail', {}).getApiResponse(
      '/' + inspectorId,
    );
    if (response.status == 200) {
      console.log('Inspector detail response is :', response);
      this.setState(
        {
          profile: response.data.values,
          avatarSource: response.data.values.profilePic,
          email: response.data.values.emailID,
          employeeId: response.data.values.employeeID,
          firstName: response.data.values.firstName,
          lastName: response.data.values.lastName,
          phone: response.data.values.mobilenumber,
          mile: response.data.values.geoRadius,
          inspectionZipcode: response.data.values.zipCode,
        },
        () => {
          let data = [];
          this.state.profile.iHours.map((item, index) => {
            let weekData = this.state.timing[index];
            weekData.weekend_id = item.available == true ? 1 : 0;
            // weekData.start_time = item.startTime;
            // weekData.end_time = item.endTime;
            // weekData.startDisplayTime = item.startTime;
            // weekData.endDisplayTime = item.endTime;

            weekData.start_time = moment().add(moment.duration(item.startTime));
            weekData.end_time = moment().add(moment.duration(item.endTime));
            weekData.startDisplayTime = moment().add(moment.duration(item.startTime));
            weekData.endDisplayTime = moment().add(moment.duration(item.endTime));

            data.push(weekData);
          });
          this.setState({ timing: data });
        },
      );
    }
    this.setState({ loading: false });
  };

  validate() {
    var messages = [];
    this.setState({ submit: true });
    messages.push(!this.state.avatarSource && 'Select Profile Pic');
    messages.push(!this.state.employeeId && 'Employee Id required');
    messages.push(!this.state.firstName && 'First Name required');
    messages.push(!this.state.lastName && 'Last Name required');
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

  saveInspectorData = async () => {
    if (this.validate()) {
      let inspectorID = await AsyncStorage.getItem('inspectorID');
      let data = await this.getRequestData();
      this.setState({ loading: true });
      let response = await new API('UpdateInspector', data).getResponse();
      this.setState({ loading: false });
      console.log('Profile update response is : ', response);
      if (response.response == 201) {
        this.setState({ disableMode: true });
        this.common.showToast(response.message);
        if (Object.keys(this.state.pic_data).length > 0 && this.state.isPicClicked == true) {
          this.setState({ loading: false }, async () => {
            this.setState({ loading: true });
            let picData = this.state.pic_data;
            var body = new FormData();
            console.log('pic data : ', picData);
            body.append('photofile', {
              uri: picData.uri,
              name: picData.fileName,
              filename: picData.fileName,
              type: picData.type,
            });
            var photoResult = await new API('UploadInspectorPic', body).getResponse2(
              '/' + inspectorID,
            );
            console.log('Photo upload result is:', photoResult);
            if (photoResult.response == 201) {
              this.setState({ loading: false, isPicClicked: false });
              this.common.showToast(photoResult.message);
            } else {
              this.setState({ loading: false, isPicClicked: false });
              this.common.showToast(photoResult.message);
            }
          });
        }
      }
    }
  };

  getHoursArray = async () => {
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let companyId = this.state.profile.companyID;
    let hoursArray = [];
    this.state.timing.map((item, index) => {
      let data = {};
      let iHoursFromService = this.state.profile.iHours[index];
      data['iHourID'] = iHoursFromService.iHourID;
      data['inspectorID'] = inspectorID;
      data['daynumber'] = iHoursFromService.daynumber;
      data["startTime"] = moment(item.startDisplayTime).format('HH:mm:ss');
      data["endTime"] = moment(item.endDisplayTime).format('HH:mm:ss');
      data['available'] = item.weekend_id == 0 ? false : true;
      data['companyID'] = parseInt(companyId);
      hoursArray.push(data);
    });
    return hoursArray;
  };
  async getRequestData() {
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let userID = await AsyncStorage.getItem('userid');
    let hoursArraydata = await this.getHoursArray();
    return {
      iHours: hoursArraydata,
      inspectorID: inspectorID,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      employeeID: this.state.employeeId,
      mobilenumber: this.state.phone,
      emailID: this.state.email,
      //   password: this.state.profile.password,
      //   companyID: this.state.profile.companyID,
      userID: userID,
      zipCode: this.state.inspectionZipcode,
      iLatitude: this.state.latitude,
      iLongitude: this.state.longitude,
      geoRadius: this.state.mile,
      //   inspectionTypeID:this.state.profile.inspectionTypeID,
      //   profilePic:this.state.profile.profilePic,
    };
  }
  saveInspector = async () => {
    if (this.validate()) {
      this.getRequestData().then(async data => {
        console.log('Request data is : ', data);
        var response = await new API('UpdateInspector', data).getResponse();
        console.log('Response :', response.response);
        if (response.response == 200) {
          this.common.showToast(response.message);
          this.props.navigation.navigate('Services');
        }
      });
    }
  };

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
      ImageResizer.createResizedImage(
        response.uri,
        150,
        150,
        'PNG',
        100,
      ).then(response2 => {
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
        this.setState(
          {
            pic_data: imageData,
            avatarSource: source,
            profilePic: response2.uri,
            loading: false,
            disableMode: false,
            isPicClicked: true
          },
          () => {
            console.log('Picture data is :', this.state.pic_data);
          },
        );
      });
    }
  }

  setAvailability(stateValue, key, field) {
    // console.log("stateValue: ",stateValue,"key: ",key,"field: ",field);
    console.log("State Value : ", stateValue)
    console.log("Key Value : ", key)
    console.log("Field Value : ", field)
    console.log("ITEMS : ", this.state.timing)
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
      ].startDisplayTime = stateValue // this.common.getTwentyFourHourTime(stateValue);
      // displayTime: this.common.getTwentyFourHourTime(time)
    }
    if (field == 'end_time') {
      this.state.timing[key].end_time = stateValue;
      this.state.timing[key].endDisplayTime = stateValue //this.common.getTwentyFourHourTime(stateValue);
    }
    this.forceUpdate();
    // console.log(this.state.timing);
  }

  printAvailability() {
    return this.state.timing.map((item, key) => {
      var checkStatus = this.state.timing[key].weekend_id > 0 ? true : false;
      // var startTime = new Date(this.state.timing[key].startDisplayTime);
      // var endTime = new Date(this.state.timing[key].endDisplayTime);
      var startTime = moment(this.state.timing[key].startDisplayTime).format('HH:mm');
      var endTime = moment(this.state.timing[key].endDisplayTime).format('HH:mm');

      return (
        <View key={key}>
          <View style={{ flexDirection: 'row', marginLeft: 5 }}>
            <View style={{ flexDirection: 'column', width: '100%' }}>
              <View
                style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <View style={styles.checkbox}>
                  <CheckBox
                    disabled={this.state.disableMode}
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
                        <Text> {startTime} </Text>
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

                        <Text> {endTime} </Text>
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
  onRegionChange(region) {
    this.changePosition(region);
  }

  DragEnd = response => {
    this.changePosition(response);
  };
  changePosition(response) {
    var { coordinate } = response.nativeEvent;
    this.setState({
      latitude: coordinate.latitude,
      longitude: coordinate.longitude,
    });
  }
  search = text => {
    this.setState({ inspectionZipcode: text });
    if (text.length != 5) return;
    var queryString =
      'https://maps.googleapis.com/maps/api/geocode/json?address=' +
      text +
      '&key=' +
      KEY;
    axios.get(queryString).then(response => {
      console.log('Response of Map api :', response);
      var data = response.data.results[0].geometry;
      var { location } = data;
      console.log('Location found is :', location);
      var coordinate = {
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      };
      this.setState({
        latitude: location.lat,
        longitude: location.lng,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.map.region = coordinate;
      console.log('Region coordinate : ', this.map.region);
      this.circle.center = { latitude: location.lat, longitude: location.lng };
      this.circle.key = {
        latitude: location.lat,
        longitude: location.lng,
      }.toString();
      this.circle.radius = this.state.mile * CONVERSION;
    });
  };
  getInitialRegion() {
    return {
      latitude: this.state.latitude,
      longitude: this.state.longitude,
      latitudeDelta: this.state.latitudeDelta,
      longitudeDelta: this.state.longitudeDelta,
    };
  }
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    let picDataLength = Object.keys(this.state.pic_data).length;
    var employeeId = !this.state.employeeId && this.state.submit ? true : false;
    var inspectionZipcode =
      !this.state.inspectionZipcode && this.state.submit ? true : false;
    var firstName = !this.state.firstName && this.state.submit ? true : false;
    var lastName = !this.state.lastName && this.state.submit ? true : false;
    var email = !this.state.email && this.state.submit ? true : false;
    var phone = !this.state.phone && this.state.submit ? true : false;
    return (
      <Root>

        <ScrollView keyboardShouldPersistTaps='always'>

          <View style={styles.container}>
            <View style={styles.registerImageContainer}>
              <Avatar
                size={100}
                overlayContainerStyle={{ backgroundColor: '#FFF' }}
                rounded
                icon={{ name: 'person', color: '#C39666', size: 72 }}
                containerStyle={{ borderColor: '#C39666', borderWidth: 2 }}
                source={
                  picDataLength < 1
                    ? { uri: 'http://' + this.state.avatarSource }
                    : this.state.avatarSource
                }
                imageProps={{ resizeMode: 'cover' }}
                showEditButton
                onEditPress={() => {
                  this.setState({ disableMode: false });
                }}
                onPress={() => this.requestCameraPermission()}
              />
            </View>

            <Errors errors={this.state.errors} />
            <View style={style.registerFormContainer}>
              <Form>
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
                    disabled={this.state.disableMode}
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
                    disabled={this.state.disableMode}
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
                    disabled={this.state.disableMode}
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
                    disabled={true}
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
                    onChangeText={text => this.setState({ phone: formatPhoneNumber(text) })}
                    placeholder="Phone No"
                    inputStyle={[style.font15]}
                    maxLength={14}
                    disabled={this.state.disableMode}
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
                    disabled={this.state.disableMode}
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
                                    
                                </TouchableOpacity>  */}
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
                      value={this.state.mile}
                      onValueChange={value => this.setState({ mile: value })}
                      thumbTintColor="#28558E"
                      minimumValue={1}
                      maximumValue={50}
                      step={1}
                      minimumTrackTintColor={this.getSelectedColor(
                        this.state.mile,
                      )}
                    />
                    <View style={[style.row]}>
                      <Text
                        style={[
                          style.registerOtherComponentsText,
                          style.twoRow,
                          style.primaryColor,
                        ]}>
                        {this.state.mile} mile
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
                    onChangeText={text => this.search(text)}
                    placeholder="Please Enter Inspection Zip"
                    inputStyle={[style.font15]}
                    disabled={this.state.disableMode}
                  />
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <MapView
                    provider={PROVIDER_GOOGLE}
                    style={mapStyles.map}
                    ref={map => {
                      this.map = map;
                    }}
                    onPress={region => this.onRegionChange(region)}
                    region={this.getInitialRegion()}
                    mapType="standard"
                    initialRegion={this.getInitialRegion()}
                    showsBuildings
                    showsTraffic
                    zoomEnabled
                    minZoomLevel={10}
                    zoomControlEnabled
                    loadingEnabled={true}
                    moveOnMarkerPress={false}
                    onRegionChangeComplete={coor =>
                      console.log('onRegionChange: ', coor)
                    }>
                    <Circle
                      center={{
                        latitude: this.state.latitude,
                        longitude: this.state.longitude,
                      }}
                      radius={CONVERSION * this.state.mile}
                      fillColor="rgba(000,000,000,0.2)"
                      strokeWidth={1}
                      strokeColor="#000"
                      zIndex={1}
                      ref={circle => {
                        this.circle = circle;
                      }}
                    />
                    <MapView.Marker.Animated
                      draggable
                      ref={marker => {
                        this.marker = marker;
                      }}
                      coordinate={this.getInitialRegion()}
                      onDragEnd={e => this.DragEnd(e)}
                    />
                  </MapView>
                </View>
                <View style={styles2.nextButtonWrapper}>
                  <Button
                    title="Save"
                    disabled={this.state.disableMode}
                    buttonStyle={styles2.btnNext}
                    onPress={() => this.saveInspectorData()}
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

const mapStyles = StyleSheet.create({
  map: {
    height: DH * 0.3,
    width: DW,
  },
});
