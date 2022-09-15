import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  RefreshControl,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import styles from '../../../../assets/styles/style.js';
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
} from 'native-base';
import {CheckBox, Avatar, Icon, Input, Button} from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';

import GoogleSearch from '../../../Components/GoogleSearch';
import Common from '../../Common/index.js';
import Loader from '../../../Components/Loader';
import API from '../../../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default class InspectorBooking extends Component {
  constructor(props) {
    super(props);
    this.state = {
      address: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      displayTime: null,
      loading: false,
      refreshing: false,
      parseAddress: [],
      profile: {},
      lat: '',
      long: '',
      companyID: '',
      inspectorID: '',
    };
    this.common = new Common();
    this.mapAddress = this.mapAddress.bind(this);
  }
  onFocus = async payload => {
    let companyIDVal = await AsyncStorage.getItem('companyId');
    let inspectorIDVal = await AsyncStorage.getItem('inspectorID');
    console.log('Inspector Id val : ', inspectorIDVal);
    this.setState(
      {companyID: companyIDVal, inspectorID: inspectorIDVal},
      () => {
        this.getInspectorDetail();
      },
    );
  };
  onBlur = payload => {
    this.setState({
      address: '',
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      displayTime: null,
      loading: false,
      refreshing: false,
      parseAddress: [],
      isDatePickerVisible:false,
      pickerTime:'00:00',
      pickerKey:'',
      pickerInputName:'',
      profile: {},
      lat: '',
      long: '',
      companyID: '',
      inspectorID: '',
    });
  };
  async componentDidMount() {
    console.log('I am on inspector booking page: ');
    this.focusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.onFocus(payload);
      },
    );
    this.unfocusSubscription = this.props.navigation.addListener(
      'didBlur',
      payload => {
        this.onBlur(payload);
      },
    );
  }

  mapAddress = (data, details) => {
    var address = this.common.parseAddress(details);
    this.setState({
      parseAddress: address,
      address: details.formatted_address,
      lat: address.lat,
      long: address.long,
    });
  };
  getInspectorDetail = async () => {
    this.setState({loading: true});
    let response = await new API('InspectorDetail', {}).getApiResponse(
      '/' + this.state.inspectorID,
    );
    console.log('Inspector response is:', response);
    try {
      if (response.status == 200) {
        console.log('Inspector response is : ', response);
        this.setState({
          loading: false,
          lat: response.data.values.iLatitude,
          long: response.data.values.iLongitude,
          profile: response.data.values,
        });
      } else {
        this.setState({loading: false});
        this.common.showToast(response.message);
      }
    } catch (error) {
      this.setState({loading: false});
      this.common.showToast(error);
    }
  };

  booking = async () => {
    let start = this.state.startDate;
    let startDate = moment(this.state.startDate, 'MM-DD-YYYY').format(
      'YYYY-MM-DD',
    );
    let startDateVal =
      startDate +
      'T' +
      this.common.getTwentyFourHourTime(this.state.startTime) +
      ':' +
      '00.000Z';
    let endDateVal =
      startDate +
      'T' +
      this.common.getTwentyFourHourTime(this.state.endTime) +
      ':' +
      '00.000Z';
    this.setState({startDate: startDateVal, endDate: endDateVal}, async () => {
      console.log('Start Time string is : ', startDateVal);
      console.log('End time string is : ', endDateVal);
      if (this.state.inspectorID == '') {
        this.common.showToast('Please select Inspector.');
      } else if (!this.state.address) {
        this.common.showToast('Select Address');
      } else if (this.state.startDate == null) {
        this.common.showToast('Select start date');
      } else if (this.state.startTime == null) {
        this.common.showToast('Select start time');
      } else if (this.state.endTime == null) {
        this.common.showToast('Select end time');
      } else {
        let address = this.state.parseAddress;
        console.log('Parsed Address is : ', address);
        let dataObj = {};
        (dataObj['bookingID'] = 0),
          (dataObj['reAgentID'] = 0),
          (dataObj['address'] = this.state.address),
          (dataObj['city'] = address.city),
          (dataObj['state'] = address.state),
          (dataObj['zipCode'] = address.zipcode),
          (dataObj['bookingType'] = 2),
          (dataObj['bookingLatitude'] = address.lat),
          (dataObj['bookingLongitude'] = address.long),
          (dataObj['bookingDetails'] = await this.getBookingDetails(
            this.state.profile,
          )),
          this.setState({loading: true});
        var response = await new API('addBooking', dataObj).getResponse();
        console.log('Inspector add booking response is :', response);
        try {
          if (response.response == 200) {
            this.setState({loading: false});
            this.common.showToast(response.message);
              this.props.navigation.navigate('Inspections');
          } else {
            this.setState({loading: false});
            this.common.showToast(response.message);
          }
        } catch (error) {
          this.setState({loading: false});
          this.common.showToast(error);
        }
      }
    });
  };
  getBookingDetails = async item => {
    let bookingDetails = [];
    let date = moment(this.state.date).toISOString();
    console.log('Inspector item  :', item);
    let inspector = {};
    (inspector['inspectorID'] = item.inspectorID),
      (inspector['companyID'] = item.companyID),
      (inspector['startDate'] = this.state.startDate),
      (inspector['endDate'] = this.state.endDate),
      (inspector['InspectorPriceID'] = 0),
      (inspector['Price'] = 0),
      (inspector['bookingStatus'] = 1);
    bookingDetails.push(inspector);
    return bookingDetails;
  };
  changeStartTime(time) {
    this.setState({
      startTime: time,
      displayTime: this.common.getTwentyFourHourTime(time),
    });
  }

  changeEndTime(time) {
    this.setState({
      endTime: time,
      displayTime: this.common.getTwentyFourHourTime(time),
    });
  }

  showDatePicker = async (time,  name) => {
    console.log(time, name)
    this.setState({isDatePickerVisible:true, pickerTime:new Date(), pickerInputName:name})
  };


  onChange = (event, selectedDate) => {
    this.hideDatePicker()
    let time = event?.nativeEvent?.timestamp
    if(time){
    console.log(time,  this.state.pickerInputName);
    if(this.state.pickerInputName == 'start_time'){
      this.setState({
        startTime:  moment(time).format('HH:mm'),
        displayTime:  moment(time).format('HH:mm'),
      });
    }
    if(this.state.pickerInputName == 'end_time'){
      this.setState({
        endTime:  moment(time).format('HH:mm'),
        displayTime:  moment(time).format('HH:mm'),
      });
    }
  }
  };

    hideDatePicker = () => {
    this.setState({isDatePickerVisible:false})
  };

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <ScrollView keyboardShouldPersistTaps='always'>
        <View>
          <Form>
            <View style={OfflineStyles.profileContainer}>
              <Avatar
                rounded
                size="large"
                source={{uri: 'http://' + this.state.profile.profilePic}}
                containerStyle={{marginRight: 10, backgroundColor: 'grey'}}
              />
              <View>
                <View style={styles.nameContainer}>
                  <Text style={OfflineStyles.profileText}>
                    {this.state.profile.firstName} {this.state.profile.lastName}
                  </Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={OfflineStyles.profileText}>
                    {this.state.profile.emailID}
                  </Text>
                </View>
                <View style={styles.nameContainer}>
                  <Text style={OfflineStyles.profileText}>
                    {this.state.profile.mobileNumber}
                  </Text>
                </View>
              </View>
            </View>
            <GoogleSearch
              value={this.state.address}
              mapAddress={this.mapAddress}
              iconMap={true}
            />
            <View style={OfflineStyles.dateContainer}>
              <View style={[styles.sectionColumn]}>
                 <DatePicker
                  mode="date"
                  date={this.state.startDate}
                  placeholder="Start Date"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  minDate={new Date()}
                  onDateChange={date => {
                    this.setState({startDate: date});
                  }}
                  iconComponent={
                    <Icon
                      size={20}
                      name="calendar"
                      type="font-awesome"
                      color="black"
                      containerStyle={styles.dateIcon}
                    />
                  }
                  customStyles={{
                    dateText: styles.dateText,
                    dateInput: styles.dateInput,
                  }}
                /> 
              </View>
              <View style={[styles.sectionColumn]}>
               <View style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:15, paddingBottom:5}}>
                     <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start'}} onPress={() => this.showDatePicker(this.state.startTime, 'start_time' )}>
                  <Icon
                      size={18}
                      name="clock-o"
                      type="font-awesome"
                      color="black"
                      containerStyle={{textAlignVertical:'center'}}
                  />
                  <Text style={[styles.dateText, {color:"black",  marginLeft:10}]}> {this.state.startTime? this.state.startTime : 'Start time'} </Text>
                </TouchableOpacity>
                </View>
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
              <View style={[styles.sectionColumn]}>
              <View style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:15, paddingBottom:5}}>
                     <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start'}} onPress={() => this.showDatePicker(this.state.endTime, 'end_time' )}>
                      <Icon
                        size={18}
                        name="clock-o"
                        type="font-awesome"
                        color="black"
                        containerStyle={{textAlignVertical:'center'}}
                    />
                      <Text style={[styles.dateText, {color:"black",  marginLeft:10}]}> {this.state.endTime? this.state.endTime : 'End time'} </Text>
                    
                  </TouchableOpacity>
                </View>
              </View>
              <TouchableOpacity
                style={OfflineStyles.button}
                onPress={() => {
                  this.booking();
                }}>
                <Text style={OfflineStyles.btnText}>Create Booking</Text>
              </TouchableOpacity>
            </View>
          </Form>
        </View>
      </ScrollView>
    );
  }
}
const SW = Dimensions.get('window').width;
const SH = Dimensions.get('window').height;
const OfflineStyles = StyleSheet.create({
  profileContainer: {
    padding: SW * 0.01,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileText: {
    fontSize: SH * 0.021,
  },
  dateContainer: {
    marginVertical: SH * 0.021,
  },
  button: {
    marginTop: SH * 0.14,
    backgroundColor: '#28558e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: SW * 0.45,
    alignSelf: 'center',
    paddingVertical: SH * 0.014,
    borderRadius: SW * 0.01,
  },
  btnText: {
    color: '#fff',
    fontSize: SH * 0.021,
  },
});
