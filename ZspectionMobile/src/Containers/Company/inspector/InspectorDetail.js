import React, { Component, createRef } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Text,
  TextInput,
  PermissionsAndroid, BackHandler
} from 'react-native';
import MapView, {
  PROVIDER_GOOGLE,
  Marker,
  Circle,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';
import styles from '../../../../assets/styles/styles.js';
import DateTimePicker from '@react-native-community/datetimepicker';
import CalendarPicker from 'react-native-calendar-picker';
import {
  CheckBox,
  Avatar,
  Icon,
  Slider,
  Button,
  Input,
} from 'react-native-elements';
import Common from '../../Common';
import Loader from '../../../Components/Loader';
let profileData;
import AsyncStorage from '@react-native-async-storage/async-storage';
import style from '../../../../assets/styles/style.js';
import axios from 'axios';
import { API } from '../../../network/API'
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";

let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 1;
const LATITUDE_DELTA = 1.1922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const LONGITUDE_DELTA = 1;
const LATITUDE = 28.5355;
const LONGITUDE = 77.391;
const CONVERSION = 1610;
const KEY = 'AIzaSyAaDd5zJGonIbsOhgePQo5j2H1vKJtBw4Y';
const DW = Dimensions.get('window').width;
const DH = Dimensions.get('window').height;
import ToggleSwitch from 'toggle-switch-react-native';
import moment from 'moment';
import colors from '../../../utils/colors.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showToastMsg } from '../../../utils.js';
import { formatPhoneNumber } from '../../../utils/utils.js';

let selectIndex = -1
let selectEndIndex = -1
let dateTimeFormate = "YYYY-MM-DD HH:mm:ss"
let selectFromEndIndex = 0
let inspectorID = 0

const optionsGallery = {
  mediaType: 'photo',
};

const optionsCamera = {
  mediaType: 'photo',
  cameraType: 'back'
};


const actionSheetRef = createRef();
export default class InspectorDetails extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      customDates: [],
      profile: [],
      availability: [],
      loader: false,
      mile: 5,
      zip: '',
      employeeId: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
      latitude: 0,
      longitude: 0,
      isProfileActive: false,
      searchValue: "",
      selectedDates: [],
      isDatePickerVisible: false,
      pickerTime: '00:00',
      pickerKey: '',
      pickerInputName: '',
      checkAllStatus: false,
      timePickerModal: false,
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
    this.onDateChange = this.onDateChange.bind(this);
    this.common = new Common();
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  // back press click
  handleBackButtonClick() {
    //this.props.navigation.goBack(null);
    this.props.navigation.goBack()
    return true;
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
    this.setState({ zip: text });
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
        // latitudeDelta: location.latitudeDelta,
        // longitudeDelta: location.latitudeDelta
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

  static navigateToHoliday = async navigation => {
    if (profileData !== undefined) {
      let userId = await AsyncStorage.getItem('userid');
      let cid = await AsyncStorage.getItem('companyId');
      console.log("dsadsadasd ", profileData)
      navigation.navigate('HolidayLeave', {
        profile: profileData,
        inspectorID: profileData.inspectorId,
        companyID: cid,
      });
    }
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Inspector Detail',
      headerStyle: { backgroundColor: '#28558E' },
      headerTintColor: '#FFF',
      headerRight: (
        <TouchableOpacity
          style={{ borderColor: '#fff', borderWidth: 1, borderRadius: 5 }}
          onPress={() => this.navigateToHoliday(navigation)}
        >
          <Text style={{ color: '#fff', fontSize: 18, paddingHorizontal: 5 }}>
            Leave
          </Text>
        </TouchableOpacity>
      ),
    };
  };

  componentDidMount() {
    var inspector = this.props.navigation.getParam('inspector');
    console.log('Inspector data from previous screen : ', inspector);
    this.getProfile(inspector);
  }

  //fetch ooking data from month year
  fetchBookData = (month, year) => {
    let data = {
      "inspectorId": profileData.inspectorId,
      "month": month,
      "year": year
    }
    API.fetchBookDateFromIns(this.searchBookHisRes, data)
  }

  searchBookHisRes = {
    success: (response) => {
      console.log("search_book>> ", response)
      let customDates = []
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        customDates.push({
          date: element.startDate,
          textStyle: { color: '#FFF' },
          containerStyle: {
            // backgroundColor: 'green',
            // flex: 1,
            // borderRadius: 30,
            // marginVertical: 1,
            // height: 22,
            // borderRadius: 30,
            // padding: 18,
            // margin: 9,,
            backgroundColor: 'green',
            borderRadius: 30,
            width: 30,
            height: 30,
            marginVertical: 1, marginTop: 5, marginLeft: 15, marginRight: 10
          },
        });
      }
      this.setState({
        selectedDates: customDates
      })
    },
    error: (error) => {
      console.log("search_book>> err> ", error)
    }
  }

  loadBookings = async (firstDate, lastDate) => {
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let data = {};
    data['reAgentID'] = 0;
    data['inspectorID'] = inspectorID;
    data['companyID'] = this.state.profile.companyId;
    data['searchString'] = this.state.searchValue;
    data['fromDate'] = firstDate;
    data['toDate'] = lastDate;
    try {
      console.log('booking response : ', data);
      API.searchHistory(this.searchHistoryRes, data)
      // let bookingResponse = await new API('SearchBooking', data).getResponse();
      // console.log('booking response : ', bookingResponse);
      // let values = bookingResponse.values;
      // this.loadDates(values);
    } catch (e) {
      this.common.showToast('Invalid Response' + " " + e);
    }
  };


  searchHistoryRes = {
    success: (response) => {
      console.log('searchhhh _response : ', response);
      //this.loadDates(values);
      //  this.common.showToast(response.message);

    },
    error: (error) => {
      console.log("login_res_error>>>", error)
      this.common.showToast(error.message);
      this.setState({ loading: false });
    }
  }

  getProfile = async data => {
    this.setState({ loader: true });
    let userId = await AsyncStorage.getItem('userid');
    let cid = await AsyncStorage.getItem('companyId');
    console.log('User id for inspector :', userId);
    console.log('Company id for inspector :', cid);
    let companyIDObj = {};
    companyIDObj['companyID'] = cid;

    //API.searchHistory(this.historyBookRes, companyIDObj)
    API.fetchInspectorDetails(this.fetchInspectorRes, data.inspectorId)
  };


  historyBookRes = {
    success: (response) => {
      console.log("search_book>> ", response)
      let customDates = []
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        customDates.push({
          date: element.startDate,
          textStyle: { color: '#FFF' },
          containerStyle: {
            // backgroundColor: 'green',
            // flex: 1,
            // borderRadius: 30,
            // marginVertical: 1,
            // height: 22,
            // borderRadius: 30,
            // padding: 18,
            // margin: 9,
            backgroundColor: 'green',
            borderRadius: 30,
            width: 30,
            height: 30,
            marginVertical: 1, marginTop: 5, marginLeft: 15, marginRight: 10
          },
        });
      }
      this.setState({
        selectedDates: customDates
      })
    },
    error: (error) => {
      console.log("search_book>> err> ", error)
    }
  }

  fetchInspectorRes = {
    success: (response) => {
      console.log("company_inspector details >>>", response.data)
      this.setState({
        profile: response.data,
        loader: false,
        zip: response.data.zipCode,
        latitude: response.data.ilatitude,
        longitude: response.data.ilongitude,
        isProfileActive: response.data.isActive,
        mile: response.data.geoRadius,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        employeeId: response.data.employeeId,
        email: response.data.emailId,
        phone: response.data.mobileNumber
      }, () => {
        profileData = response.data;

        let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        let lastDay = new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0,
        );
        let firstDate = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        let lastDate = moment(lastDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
        console.log("firssss >>", firstDate, lastDate)

        let month = moment().format('MM')
        let year = moment().format('YYYY')
        this.fetchBookData(month, year)


        this.loadBookings(firstDate, lastDate);
        let availblity = []
        let isCheckVal = 1
        for (let index = 0; index < response.data.ihour.length; index++) {
          const element = response.data.ihour[index];
          let data = element
          let startM = moment().format('YYYY-MM-DD')
          let endM = moment().format('YYYY-MM-DD')
          data['startTime'] = moment(startM + ' ' + element.startTime).format(dateTimeFormate)
          data['endTime'] = moment(endM + ' ' + element.endTime).format(dateTimeFormate)
          data['isChecked'] = element.available
          if (element.available) {
            isCheckVal += 1
          }
          availblity.push(data)
        }
        console.log("avaiablity >>", isCheckVal, availblity)
        this.setState({
          availability: availblity,
          checkAllStatus: isCheckVal == 8 ? true : false,
        })
      });

      this.setState({ loader: false });
    },
    error: (error) => {
      this.setState({ loader: false });
      console.log("company_inspector_ details error>>>", error)
    }
  }


  showDatePicker = async (time, key, name) => {
    console.log(time, key, name)
    this.setState({ isDatePickerVisible: true, pickerTime: new Date(), pickerKey: key, pickerInputName: name })
  };

  hideDatePicker = () => {
    this.setState({ timePickerModal: false })
  };


  getSchedules = async (inspector, date = null) => {
    var profile = inspector;
    // var token = await AsyncStorage.getItem('authToken');
    // var header = { 'authentication': token };
    var apiDate = date ? date : this.common.getDateFormat(new Date());
    var data = {
      companyid: profile.CompanyId,
      inspectionid: 0,
      inspectorid: profile.InspectorId,
      date: apiDate,
    };

    var response = new API('CompanyInspectionList', data, header).getResponse();
    response.then(result => {
      console.log('response: ', result);
      if (result.statuscode == 200) {
        // this.setState({
        //     Data: result.result.company_inspection,
        //     FreshDataList: result.result.company_inspection
        // })
        // this.loadDates(result.result.company_calender)
      } else {
        console.log('error: ', result);
      }
    });
  };

  loadDates = dates => {
    var customDates = [];
    if (dates && dates.length > 0) {
      dates.map(item => {
        customDates.push({
          date: item.startDate,
          textStyle: { color: '#FFF' },
          containerStyle: {
            backgroundColor: 'green',
            borderRadius: 30,
            width: 30,
            height: 30,
            marginVertical: 1, marginTop: 5, marginLeft: 15, marginRight: 10
            // backgroundColor: 'green',
            // flex: 1,
            // borderRadius: 10,
            // marginVertical: 1
            // backgroundColor: 'green',
          },
        });
      });
      console.log('customDates: ', customDates);
      this.setState({
        customDates: customDates,
      });
    }
  };
  onMonthChange = date => {
    let firstDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let lastDate = moment(date)
      .add(1, 'month')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    console.log("pppppp")
    let month = moment(date).format('MM')
    let year = moment(date).format('YYYY')
    this.fetchBookData(month, year)
    //this.loadBookings(firstDate, lastDate);
  };


  onDateChange(date) {
    this.setState({
      selectedStartDate: date,
    });
    let firstDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let lastDate = moment(date)
      .add(1, 'month')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    this.loadBookings(firstDate, lastDate);

    let dateToPass = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    this.props.navigation.navigate("InspectionDetail", {
      'Inspection': {
        "date": dateToPass, "inspectorID": profileData.inspectorId
      }
    })
  }

  onChange = (event, selectedDate) => {
    this.hideDatePicker()
    let time = event?.nativeEvent?.timestamp
    if (time) {
      console.log(event?.nativeEvent?.timestamp, this.state.pickerKey, this.state.pickerInputName);
      this.setAvailability(event?.nativeEvent?.timestamp, this.state.pickerKey, this.state.pickerInputName)
    }
  };

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
        return (
          <View key={key}>
            <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
              <View style={{ flexDirection: 'column', width: '100%' }}>
                <View
                  style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <CheckBox
                      checked={checkStatus}
                      onPress={() =>
                        this.setAvailability(checkStatus, key, 'day')
                      }
                      checkedColor="#28558E"
                      size={20}
                      containerStyle={styles.loginContainerStyle}
                      color="#808080"
                      style={styles.loginCheckbox}
                    />
                    <Text style={{ color: colors.txtColor, paddingTop: 2, fontSize: 14 }}>{item.day}</Text>
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
                    <Text style={{ marginHorizontal: 10 }}>=</Text>
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


  getDay = dayNumber => {
    switch (dayNumber) {
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      case 7:
        return 'Sunday';
    }
  };
  renderItem = ({ item, index }) => {
    if (!item.available) return;
    return (
      <View style={styles.row}>
        <Text style={styles.date}>{this.getDay(item.daynumber)}</Text>
        <Text style={styles.time}>
          {moment(item.startTime, 'hh:mm:ss').format('hh:mm A')} - {moment(item.endTime, 'hh:mm:ss').format('hh:mm A')}
        </Text>
      </View>
    );
  };

  inspectorEnableDisableRes = {
    success: (response) => {
      console.log("inspectorEnableDisableRes >>>", response.data)
      this.props.navigation.goBack();
      this.common.showToast(response.message);
    },
    error: (error) => {
      console.log("errrr>> >>>", error)
      this.common.showToast(error.message);
    }
  }

  checkAll = () => {
    let updateList = []
    for (let index = 0; index < this.state.availability.length; index++) {
      const element = this.state.availability[index];
      if (this.state.checkAllStatus) {
        element.isChecked = false
      } else {
        element.isChecked = true
      }
      updateList.push(element)
    }
    this.setState({
      availability: updateList,
      checkAllStatus: !this.state.checkAllStatus,
    })

    // var timing = this.state.timing;

    // if (!this.state.checkAllStatus) {
    //   var times = timing[0];
    //   var newTime = [];
    //   const { start_time, startDisplayTime, end_time, endDisplayTime } = times;
    //   timing.map((time, index) => {
    //     var list = {
    //       weekend_id: index + 1,
    //       start_time: start_time,
    //       startDisplayTime: startDisplayTime,
    //       end_time: end_time,
    //       endDisplayTime: endDisplayTime,
    //       day: time.day,
    //     };
    //     newTime.push(list);
    //   });
    // } else {
    //   var newTime = [];
    //   timing.map((time, index) => {
    //     var list = time;
    //     list.weekend_id = 0;
    //     newTime.push(list);
    //   });
    // }
    // this.setState({
    //   timing: newTime,
    //   checkAllStatus: !this.state.checkAllStatus,
    // });
  };

  handleProfileActive = (activeVal) => {
    var inspector = this.props.navigation.getParam('inspector');
    this.setState({ isProfileActive: activeVal }, async () => {
      if (activeVal) {
        let data = {
          "inspectorId": inspector.inspectorId,
          "isActive": true
        }
        API.enableDisableInspector(this.inspectorEnableDisableRes, data)
      } else {
        let data = {
          "inspectorId": inspector.inspectorId,
          "isActive": false
        }
        API.enableDisableInspector(this.inspectorEnableDisableRes, data)
      }
      // if (activeVal) {
      //   var response = await new API('enableInspector', {}).getApiResponse('/' + inspector.inspectorID);
      //   console.log('Enable inspector response is : ', response);
      // } else {
      //   var response = await new API('disableInspector', {}).getApiResponse('/' + inspector.inspectorID);
      //   console.log('Disable inspector response is : ', response);
      // }
    })
  }

  renderAvailabilityTitle = (item) => {
    let title = ''
    if (item == 1) {
      title = "Sunday"
    } else if (item == 2) {
      title = "Monday"
    } else if (item == 3) {
      title = "Tuesday"
    } else if (item == 4) {
      title = "Wednesday"
    } else if (item == 5) {
      title = "Thursday"
    } else if (item == 6) {
      title = "Friday"
    } else if (item == 7) {
      title = "Saturday"
    }
    return <Text style={{
      color: colors.txtColor, fontSize: 15,
      marginLeft: 10, flex: 0.28
    }}>{title}</Text>
  }

  onTImeStart = (item, index) => {
    this.setState({
      timePickerModal: false
    })
    selectIndex = index
    selectEndIndex = -1
    setTimeout(() => {
      this.setState({
        timePickerModal: true
      })
    }, 1000)
  }


  onTImeEnd = (item, index) => {
    this.setState({
      timePickerModal: false
    })
    selectEndIndex = index
    selectIndex = -1
    setTimeout(() => {
      this.setState({
        timePickerModal: true
      })
    }, 1000)
  }

  onCheckPress = (item, index) => {
    let update = [...this.state.availability]
    update[index].isChecked = !update[index].isChecked
    this.setState({
      availability: update
    })
  }

  renderAvaItem = ({ item, index }) => {
    let startTimeFor = item.startTime ? moment(item.startTime, dateTimeFormate).format('LT') : 'Select Time'
    let endTimeFor = item.endTime ? moment(item.endTime, dateTimeFormate).format('LT') : 'Select Time'
    return (
      <View style={{
        width: '100%', marginBottom: 10, marginVertical: 10,
        alignSelf: 'center',
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15 }}>
          <TouchableOpacity style={{
            flexDirection: 'row', alignItems: 'center',
            justifyContent: 'space-between'
          }}
            onPress={() => {
              this.onCheckPress(item, index)
            }}>
            <MaterialCommunityIcons
              name={item.isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={25} color={colors.softBlue}
            />
          </TouchableOpacity>
          {this.renderAvailabilityTitle(item.daynumber)}
          <View style={{ flexDirection: 'row', flex: 1, }}>
            <TouchableOpacity style={{
              flex: 1, flexDirection: 'row', justifyContent: 'center',
              alignContent: 'center', alignItems: 'center'
            }}
              onPress={() => this.onTImeStart(item, index)}
              disabled={!item.isChecked}
            >
              <AntDesign
                name='clockcircleo' size={17}
                color={item.isChecked ? colors.txtColor : colors.lightGraySec}
              />
              <Text style={[styles.time_txt, {
                color: item.isChecked ? colors.txtColor : colors.lightGraySec, marginLeft: 5
              }]}>{startTimeFor}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex: 1, flexDirection: 'row', justifyContent: 'center',
              alignContent: 'center', alignItems: 'center'
            }}
              onPress={() => this.onTImeEnd(item, index)}
              disabled={!item.isChecked}
            >
              <AntDesign
                name='clockcircleo' size={17}
                color={item.isChecked ? colors.txtColor : colors.lightGraySec}
              />
              <Text style={[styles.time_txt, {
                color: item.isChecked ? colors.txtColor : colors.lightGraySec, marginLeft: 5
              }]}>{endTimeFor}</Text>
            </TouchableOpacity>
          </View>


        </View>
      </View>
    )
  }

  handleConfirm = (date) => {
    let update = [...this.state.availability]
    if (selectIndex != -1) {
      update[selectIndex].startTime = moment(date).format(dateTimeFormate)
      update[selectIndex].endTime = ''
    } else if (selectEndIndex != -1) {
      let startT = moment(update[selectEndIndex].startTime)
      let endT = moment(date)
      if (startT.isBefore(endT)) {
        update[selectEndIndex].endTime = moment(date).format(dateTimeFormate)
      } else {
        showToastMsg("Please select end time before start time")
      }
    }
    this.setState({
      availability: update
    })
  };

  updateAvailability = () => {
    let availabilityList = []
    for (let index = 0; index < this.state.availability.length; index++) {
      const element = this.state.availability[index];
      let newElement = {
        "ihourId": element.ihourId,
        "available": element.isChecked,
        "startTime": moment(element.startTime, dateTimeFormate).format('HH:mm:ss'),
        "endTime": moment(element.endTime, dateTimeFormate).format("HH:mm:ss")
      }
      availabilityList.push(newElement)
    }
    let updateIns = {
      "inspectorHours": availabilityList
    }
    return availabilityList
  }

  async getRequestData() {
    var profile = JSON.parse(await AsyncStorage.getItem('profile'));
    var companyId = profile.CompanyId;
    console.log("Profile to upload :", this.state.distance);
    let hoursArraydata = this.updateAvailability();
    return {
      iHours: hoursArraydata,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      employeeId: this.state.employeeId,
      mobileNumber: this.state.phone,
      emailId: this.state.profile.emailId,
      zipCode: this.state.zip,
      ilatitude: this.state.latitude,
      ilongitude: this.state.longitude,
      geoRadius: this.state.mile,
    };
  }

  onSaveData = () => {
    this.getRequestData().then(async (data) => {
      console.log("Request data is : ", data)
      this.setState({
        loader: true
      })
      API.updateInspectorFromCompany(this.updateInspector, data, this.state.profile.inspectorId)
    });
  }

  updateInspector = {
    success: (response) => {
      console.log("update_inspector >>>", response.data)
      this.common.showToast(response.message);
      this.setState({
        loader: false
      })
      this.props.navigation.goBack()
    },
    error: (error) => {
      this.common.showToast(error.message);
      this.setState({
        loader: false
      })
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
        this.requestCameraPermission()
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
      var body = new FormData();
      body.append('File', {
        uri: response.uri,
        name: response.fileName,
        type: response.type
      });
      API.uploadInspectorProfilePic(this.uploadProfilePic, body,
        profileData.inspectorId)

      // ImageResizer.createResizedImage(response.uri, 300, 300, 'PNG', 100).then((response2) => {
      //   const source = { uri: response2.uri };
      //   let imageData = {};
      //   imageData['fileName'] = response.fileName;
      //   imageData['fileSize'] = response2.size;
      //   imageData['height'] = response2.height;
      //   imageData['isVertical'] = response.isVertical;
      //   imageData['originalRotation'] = response.originalRotation;
      //   imageData['path'] = response.path;
      //   imageData['type'] = response.type;
      //   imageData['uri'] = response.uri;
      //   imageData['width'] = response2.width;
      //   this.setState({ pic_data: imageData, avatarSource: source, profilePic: response2.uri, loading: false }, () => {
      //     console.log("Picture data is :", this.state.pic_data)
      //   });
      // })
    }
  }


  uploadProfilePic = {
    success: (response) => {
      var inspector = this.props.navigation.getParam('inspector');
      console.log('Inspector data from previous screen : ', inspector);
      this.getProfile(inspector);
      console.log("upload_profile_pic>>", response)
      //this.props.navigation.navigate('InspectorRegisterMatrix', { "inspectorData": response.data })
    },
    error: (error) => {
      console.log("upload_profile_pic> err > ", error)
    }
  }


  render() {
    console.log('profile pic : ', this.state.profile.profilePic);
    if (this.state.loader) return <Loader />;
    const { selectedStartDate } = this.state;
    const startDate = selectedStartDate ? selectedStartDate.toString() : '';
    return (
      <ScrollView
        style={{ flex: 1 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.homeContainers}>
          <View>
            <View style={styles.row}>
              <View style={{ flex: 0 }}>
                <Avatar
                  rounded
                  size="large"
                  source={{
                    uri: this.state.profile.profilePic
                      ? this.state.profile.profilePic
                      : '',
                  }}
                  onPress={() => this.requestCameraPermission()}
                  containerStyle={{ marginRight: 10 }}
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.nameTxt}>
                    {this.state.profile.firstName + ' ' + this.state.profile.lastName} /{' '}
                    {this.state.profile.employeeId}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.nameTxt}>
                    {this.state.profile.emailId}
                  </Text>
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                  <Text style={styles.nameTxt}>
                    {this.state.profile.mobileNumber}
                  </Text>
                </View>
              </View>
              <View style={{ flex: 0.6 }}>
                <ToggleSwitch
                  isOn={this.state.isProfileActive}
                  onColor="green"
                  offColor="grey"
                  label={this.state.isProfileActive ? 'Active' : 'Inactive'}
                  labelStyle={{ color: 'black', fontWeight: '500' }}
                  size="medium"
                  onToggle={isOn => this.handleProfileActive(isOn)}
                />
              </View>
            </View>
            <View style={{ justifyContent: 'center', paddingVertical: 10 }}>
              <View style={{ marginBottom: 20 }}>
                <Text style={mapStyles.heading_title_txt}>Profile Details:-</Text>
                <View style={{ width: '95%', alignSelf: 'center', marginTop: 4 }}>
                  <TextInput
                    style={mapStyles.txt_input_style}
                    numberOfLines={1}
                    placeholder='Employee ID'
                    value={this.state.employeeId}
                    onChangeText={(txt) => this.setState({ employeeId: txt })}
                  />
                  <View style={mapStyles.divider_input} />
                  <TextInput
                    style={mapStyles.txt_input_style}
                    numberOfLines={1}
                    placeholder='First Name'
                    value={this.state.firstName}
                    onChangeText={(txt) => this.setState({ firstName: txt })}
                  />
                  <View style={mapStyles.divider_input} />
                  <TextInput
                    style={mapStyles.txt_input_style}
                    numberOfLines={1}
                    placeholder='Last Name'
                    value={this.state.lastName}
                    onChangeText={(txt) => this.setState({ lastName: txt })}
                  />
                  <View style={mapStyles.divider_input} />
                  <TextInput
                    style={mapStyles.txt_input_style}
                    numberOfLines={1}
                    keyboardType='email-address'
                    placeholder='Email ID'
                    editable={false}
                    value={this.state.email}
                    onChangeText={(txt) => this.setState({ email: txt })}
                  />
                  <View style={mapStyles.divider_input} />
                  <TextInput
                    style={mapStyles.txt_input_style}
                    numberOfLines={1}
                    keyboardType='number-pad'
                    placeholder='Phone'
                    value={this.state.phone}
                    onChangeText={(txt) => this.setState({ phone: formatPhoneNumber(txt) })}
                  />
                </View>
              </View>


              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between', marginTop: -10, alignContent: 'center',
                }}>
                <Text style={mapStyles.heading_title_txt}>Set Availability:-</Text>
                <TouchableOpacity style={{
                  flexDirection: 'row', justifyContent: 'center',
                  alignItems: 'center', alignContent: 'center', paddingRight: 10
                }}
                  onPress={() => this.checkAll()}
                >

                  <Text style={[mapStyles.heading_title_txt, { fontWeight: 'normal', fontSize: 14, marginLeft: 2 }]}>Check All</Text>
                  <MaterialCommunityIcons name={this.state.checkAllStatus ? 'checkbox-marked' : 'checkbox-blank-outline'} color={colors.softBlue}
                    size={25}
                  />
                </TouchableOpacity>
                {/* <CheckBox
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
                /> */}
              </View>

              {/* {this.state.isDatePickerVisible &&
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.pickerTime}
                  mode='time'
                  is24Hour={false}
                  display="default"
                  onChange={this.onChange}
                />
              }

              <View>{this.printAvailability()}</View> */}
              <View style={{ flex: 1, }}>
                {this.state.availability.length > 0 ?
                  <FlatList
                    data={this.state.availability}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderAvaItem}
                  /> : null
                }
              </View>

              <View style={{ marginTop: 15 }}>
                <Text style={mapStyles.heading_title_txt}>Schedules:-</Text>
              </View>
              <CalendarPicker
                previousTitle="<"
                nextTitle=">"
                onDateChange={this.onDateChange}
                onMonthChange={this.onMonthChange}
                customDatesStyles={this.state.selectedDates}
              />
            </View>
          </View>
          <View>
            <Input
              value={this.state.zip}
              onChangeText={text => this.search(text)}
              placeholder="Enter USC Zip"
              keyboardType="numeric"
              inputStyle={style.font14}
            />
            <View style={{ margin: 10 }}>
              <View style={style.row}>
                <Text style={style.registerOtherComponentsText}>
                  Set Geofencing Radius
                </Text>
                <Text
                  style={[
                    style.registerOtherComponentsText,
                    { color: '#BE780F' },
                  ]}>
                  {' '}
                  {this.state.mile} miles
                </Text>
              </View>
              <Slider
                value={this.state.mile}
                onValueChange={value => this.setState({ mile: value })}
                thumbTintColor="#28558E"
                minimumValue={1}
                maximumValue={50}
                step={1}
                minimumTrackTintColor="#28558E"
              />
              <View style={[style.row]}>
                <Text style={[style.registerOtherComponentsText, style.twoRow]}>
                  1 mile
                </Text>
                <Text
                  style={[
                    style.registerOtherComponentsText,
                    style.twoRow,
                    { textAlign: 'right' },
                  ]}>
                  50 miles
                </Text>
              </View>
              <View style={[style.row, { marginTop: 15 }]}>
                <Text
                  style={[
                    style.registerOtherComponentsText,
                    { fontWeight: 'bold' },
                  ]}>
                  Note
                </Text>
                <Text style={[style.registerOtherComponentsText]}>
                  {' '}
                  - Drag the map to mark you accurate territory.
                </Text>
              </View>
            </View>
          </View>
          <View style={{ flex: 1 }}>
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
              onRegionChangeComplete={coor => {
                this.setState({
                  latitude: coor.latitude,
                  longitude: coor.longitude,
                  latitudeDelta: coor.latitudeDelta,
                  longitudeDelta: coor.longitudeDelta
                })
                console.log('onRegionChange: ', coor)
              }
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
          {this.state.loader ? <Loader /> :
            <View style={style.center}>
              <Button
                title="Save"
                buttonStyle={style.btnNext}
                onPress={() => this.onSaveData()}
              />
            </View>
          }

        </View>

        <DateTimePickerModal
          isVisible={this.state.timePickerModal}
          mode="time"
          onConfirm={this.handleConfirm}
          onCancel={this.hideDatePicker}
        />

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
const mapStyles = StyleSheet.create({
  map: {
    height: DH * 0.3,
    width: DW,
  },
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
  time_txt: {
    color: colors.txtColor, fontSize: 16, fontWeight: '800', marginHorizontal: 5
  },
  time_txt_view: {
    flex: 1, flexDirection: 'row', justifyContent: 'center',
    alignContent: 'center', alignItems: 'center'
  },
  modal_view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  from_to_time_heading: {
    color: colors.softBlue, fontSize: 16, fontWeight: '500'
  },
  from_to_time_value: {
    color: colors.txtColor, fontSize: 16, marginTop: 3
  },
  time_divider: {
    width: '100%', height: 0.5, backgroundColor: colors.lightGraySec, marginTop: 8
  },
  heading_title_txt: {
    fontWeight: 'bold', fontSize: 15, color: colors.black, paddingHorizontal: 10
  },
  divider_input: {
    width: '100%', height: 1, backgroundColor: colors.lightGray
  },
  txt_input_style: {
    width: '100%', height: 45, paddingHorizontal: 5
  }
});
