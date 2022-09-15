import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  StatusBar,
  RefreshControl,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';
import styles from '../../../assets/styles/style.js';
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
  Grid,
  Col,
  Row,
} from 'native-base';
import {CheckBox, Avatar, Icon, Input, Button} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import Common from '../Common/index.js';
import Loader from '../../Components/Loader';
import Errors from '../../Components/Errors';
import GoogleSearch from '../../Components/GoogleSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

let foundationTypeRequired = false;
let inspectionArrayIds;
let numberOfUnitResponse;
let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;
let addressTextDefault = '';

export default class Search extends Component {
  constructor(props) {
    super(props);
    this.state = this.states();
    this.common = new Common();
    this.mapAddress = this.mapAddress.bind(this);
  }
  static navigationOptions = ({navigation}) => {
    const {params = {}} = navigation.state;
    return {
      headerLeft: (
        <TouchableOpacity onPress={() => params.backHandle()}>
          <Image
            source={require('../../../assets/images/back_white.png')}
            style={{
              width: SW * 0.028,
              height: SW * 0.053,
              marginLeft: SW * 0.03,
            }}
          />
        </TouchableOpacity>
      ),
    };
  };
  states() {
    var today = new Date();
    return {
      addressText: '',
      address: '',
      state: '',
      city: '',
      zipcode: '',
      minDate:
        today.getMonth() +
        1 +
        '/' +
        (today.getDate() + 1) +
        '/' +
        today.getFullYear(),
      date: new Date(),
      time: '8:00 AM',
      displayTime: '08:00',
      age: '',
      submit: false,
      errors: [],
      mapAddress: [],
      refreshing: false,
      isDatePickerVisible: false,
      pickerTime: '00:00',
      pickerKey: '',
      pickerInputName: '',
      isDatePickerOpen: false,
      timePickertShow: false,
      displayDate:  moment().format('MM/DD/YYYY'),
      passTime: '',
    };
  }
  handleBack = () => {
    this.props.navigation.pop();
    return true;
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.props.navigation.setParams({backHandle: this.handleBack});
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
  }

  onRefresh = () => {
    this.setState(this.states());
  };

  gotoList = () => {
    if (this.validate()) {
      console.log(
        'pass_param',
        this.props.navigation.state.params.selectedCategory,
        this.getData(),
      );
      // var req =  this.getRequestData();
      // console.log("req: ",JSON.stringify(req));
      // this.props.navigation.navigate('CompanyListing',{
      //     "inspectionList":this.state.inspectionList,
      //     "request" : req,
      // })
      
      this.props.navigation.navigate('Area', {
        mainCategoryArray: this.props.navigation.state.params.mainCategoryArray,
        selectedCategory: this.props.navigation.state.params.selectedCategory,
        data: this.getData(),
      });
    }
  };

  getData = () => {
    return {
      address: this.state.address,
      inspectionlng: this.state.longitude,
      inspectionlat: this.state.latitude,
      inspectiondate: this.state.date,
      time: this.state.displayTime,

    };
  };

  getRequestData = (page = 1) => {
    var inspections = [];
    this.state.inspections.map(inspectionId => {
      inspections.push({inspectiontypeid: inspectionId});
    });
    return {
      address: this.state.address,
      inspectionlng: this.state.longitude,
      inspectionlat: this.state.latitude,
      inspectiondate: this.state.date,
      flag: 2,
      pageno: page,
      pricemetrixid: this.state.metrixId,
      time: this.state.time,
      inspectiontype: inspections,
      foundationid: this.state.foundation,
      propertytypeid: this.state.propertyType,
      other: this.state,
    };
  };

  mapAddress = (data, details) => {
    console.log('data?>>>>>>>', data);
    AsyncStorage.setItem('AgentRequestedAddress', JSON.stringify(details));
    this.setState({
      address: data.description,
      mapAddress: details,
      addressText: data.description,
    });
    var parseAdderss = this.common.parseAddress(details);
    const {location} = details.geometry;
    this.setState({
      zipcode: parseAdderss.zipcode,
      state: parseAdderss.state,
      city: parseAdderss.city,
      latitude: location.lat,
      longitude: location.lng,
    });
  };

  validate = () => {
    console.log('stateaddress', addressTextDefault);
    if (addressTextDefault === '') {
      this.common.showToast('Enter Street Address');
    } else if (!this.state.date) {
      this.common.showToast('Select Date');
    } else if (!this.state.time) {
      this.common.showToast('Select Time');
    } else {
      return true;
    }
    return false;
  };

  changeTime(time) {
    console.log('Time is :', time);
    this.setState(
      {
        time: time,
        displayTime: this.common.getTwentyFourHourTime(time),
      },
      () => {
        console.log('Display Time is : ', this.state.displayTime);
      },
    );
  }

  showDatePicker = async (time, name) => {
    console.log(time, name);
    this.setState({
      isDatePickerVisible: true,
      pickerTime: new Date(),
      pickerInputName: name,
    });
  };

  onChange = (event, selectedDate) => {
    this.hideDatePicker();
    let time = event?.nativeEvent?.timestamp;
    if (time) {
      console.log(time, this.state.pickerInputName);
      this.setState(
        {
          time: moment(time).format('HH:mm A'),
          displayTime: moment(time).format('HH:mm'),
        },
        () => {
          console.log('Display Time is : ', this.state.displayTime);
        },
      );
    }
  };

  onChangeDate = (event, selectedDate) => {
    this.setState({
      date: moment(selectedDate).format('MM/DD/YYYY'),
      isDatePickerOpen: false,
      timePickertShow: false,
    });
    // let time = event?.nativeEvent?.timestamp
    // if (time) {
    //     this.setState({
    //         date: moment(date).format('MM/DD/YYYY'),
    //         isDatePickerOpen: false
    //         // time: moment(time).format('HH:mm A'),
    //         // displayTime: moment(time).format('HH:mm')
    //     }, () => {
    //         console.log("Display Time is : ", this.state.displayTime);
    //     })
    // }
  };

  onChangeTime = (event, selectedDate) => {
    this.setState({
      displayDate: moment(selectedDate).format('MM/DD/YYYY'),
      isDatePickerOpen: false,
      timePickertShow: false,
    });
    // let time = event?.nativeEvent?.timestamp
    // if (time) {
    //     this.setState({
    //         date: moment(date).format('MM/DD/YYYY'),
    //         isDatePickerOpen: false
    //         // time: moment(time).format('HH:mm A'),
    //         // displayTime: moment(time).format('HH:mm')
    //     }, () => {
    //         console.log("Display Time is : ", this.state.displayTime);
    //     })
    // }
  };

  hideDatePicker = () => {
    this.setState({isDatePickerVisible: false});
  };

  setAddressText = text => {
    console.log("text>>>>>>>>>>",text)
    this.setState({addressText: text});
  };

  render() {
    if (this.state.loading) {
      return <Loader />;
    }

    return (
      <ScrollView
        keyboardShouldPersistTaps="always"
        refreshControl={
          <RefreshControl
            //refresh control used for the Pull to Refresh
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        <View>
          <Form>
            <Errors errors={this.state.errors} />
            <GoogleSearch
              textInputProps={{
                onChangeText: text => (addressTextDefault = text),
              }}
              placeholder="Street Address"
              value={this.state.address}
              mapAddress={this.mapAddress}
              icon={true}
            />
            <View style={[styles.twoRow]}>
              <Input
                containerStyle={styles.threeRow}
                disabled
                placeholder="State"
                value={this.state.state}
                inputStyle={[styles.font15]}
              />
              <Input
                containerStyle={styles.threeRow}
                disabled
                placeholder="City"
                value={this.state.city}
                inputStyle={[styles.font15]}
              />
            </View>
            <Input
              containerStyle={styles.threeRow}
              disabled
              keyboardType="numeric"
              value={this.state.zipcode}
              placeholder="Zip"
              inputStyle={[styles.font15]}
            />
            <View style={[styles.sectionColumn]}>
              {/* <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 15, paddingBottom: 5 }}>
                                <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
                                    onPress={() => {
                                        this.setState({isDatePickerOpen: true })                                    }
                                    }
                                >
                                    <Icon
                                        size={18}
                                        name="Date"
                                        type="font-awesome"
                                        color="black"
                                        containerStyle={{ textAlignVertical: 'center' }}
                                    />
                                    <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}> {this.state.displayTime ? this.state.displayTime : 'HH:MM'} </Text>
                                </TouchableOpacity>
                            </View> */}

              <DatePicker
                mode="date"
                minDate={new Date()}
                date={this.state.date.length > 0 ? this.state.date : new Date()}
                placeholder="Date"
                format="MM/DD/YYYY"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={date => {
                  this.setState({date: date});
                }}
                iconComponent={
                  <Icon
                    size={20}
                    name="calendar"
                    type="font-awesome"
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
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  paddingTop: 15,
                  paddingBottom: 5,
                }}>
                <TouchableOpacity
                  style={{flexDirection: 'row', justifyContent: 'flex-start'}}
                  onPress={
                    () =>
                      this.showDatePicker(this.state.displayTime, 'start_time')
                    // this.setState({ isDatePickerOpen: false, timePickertShow: true })
                  }>
                  <Icon
                    size={18}
                    name="clock-o"
                    type="font-awesome"
                    color="black"
                    containerStyle={{textAlignVertical: 'center'}}
                  />
                  {console.log('dadadasd > ', this.state.displayTime)}
                  <Text
                    style={[styles.dateText, {color: 'black', marginLeft: 10}]}>
                    {this.state.displayTime
                      ? moment(this.state.displayTime, 'hh:mm').format('LT')
                      : 'HH:MM'}{' '}
                  </Text>
                </TouchableOpacity>
              </View>
              {this.state.isDatePickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={this.state.pickerTime}
                  mode="time"
                  is24Hour={false}
                  display="default"
                  onChange={this.onChange}
                />
              )}
            </View>
            {/* <CheckBox
                            containerStyle={{ width: '49%', height: 40, borderWidth: 0, marginHorizontal: 0, backgroundColor: '#fff' }}
                            // key={inspection.InspectionTypeId}
                            textStyle={{ fontWeight: 'normal' }}
                            title='ASAP-System selected'
                            checked={false}
                            onPress={() => console.log("CheckBox called.")}
                        /> */}
            <View style={styles.center}>
              <Button
                title="Proceed"
                buttonStyle={styleSearch.btnNext}
                onPress={() => this.gotoList()}
              />
            </View>
          </Form>
        </View>
        <StatusBar backgroundColor="#28558E" barStyle="light-content" />

        {/* {this.state.isDatePickerOpen && (
                    <DateTimePicker
                        value={new Date()}
                        mode='date'
                        minimumDate={new Date()}
                        onChange={this.onChangeDate}
                    />
                )
                }


                {this.state.timePickertShow ?
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={new Date()}
                        mode='time'
                        minimumDate={new Date()}
                        onChange={this.onChangeTime}
                    /> : null} */}
      </ScrollView>
    );
  }
}

const styleSearch = StyleSheet.create({
  btnNext: {
    backgroundColor: '#28558E',
    paddingHorizontal: SW * 0.051,
    paddingVertical: SH * 0.013,
    borderRadius: 5,
    marginTop: SH * 0.081,
  },
});
