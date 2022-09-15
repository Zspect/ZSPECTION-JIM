import React, { Component } from 'react';
import {
  View,
  ScrollView, BackHandler,
  TouchableOpacity
} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import styles2 from '../../../../assets/styles/styles.js';
import {
  Text,
  Form,
} from 'native-base';
import { Avatar, Icon, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';

import Common from '../../Common/index.js';
import Loader from '../../../Components/Loader';
import moment from "moment";
import { API } from '../../../network/API.js';
import { showToastMsg } from '../../../utils.js';

let inspectorID = 0
export default class InspectorHolidayLeave extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      startDate: null,
      startTime: null,
      endDate: null,
      endTime: null,
      loading: false,
      refreshing: false,
      isDatePickerVisible: false,
      pickerTime: '00:00',
      pickerKey: '',
      pickerInputName: '',
      profile: this.props.navigation.state.params.profile,
      companyID: this.props.navigation.state.params.companyID,
      inspectorID: this.props.navigation.state.params.profile.inspectorId,
    };
    this.common = new Common();
    // this.mapAddress = this.mapAddress.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  //handle back press
  handleBackButtonClick() {
    this.props.navigation.goBack();
    return true;
  }

  async submitLeave() {
    let start = this.state.startDate
    let startDate = moment(this.state.startDate, "MM-DD-YYYY").format("YYYY-MM-DD");
    let endDate = moment(this.state.endDate, "MM-DD-YYYY").format("YYYY-MM-DD");
    let startDateVal = startDate + "T" + this.common.getTwentyFourHourTime(this.state.startTime) + ":" + "00.000Z";
    let endDateVal = endDate + "T" + this.common.getTwentyFourHourTime(this.state.endTime) + ":" + "00.000Z";
    console.log("Start Time string is : ", startDateVal)
    console.log("End time string is : ", endDateVal)
    if (this.state.startDate == null) {
      this.common.showToast('Select start date');
    } else if (this.state.startTime == null) {
      this.common.showToast('Select start time');
    } else if (this.state.endDate == null) {
      this.common.showToast('Select end date');
    } else if (this.state.endTime == null) {
      this.common.showToast('Select end time');
    } else {
      this.setState({ loading: true })
      let data = {
        "inspectorId": this.state.inspectorID,
        "startDate": startDateVal,
        "endDate": endDateVal,
        "bookingStatus": 0
      }

      API.leaveApplyInspector(this.leaveApplyInspectorRes, JSON.stringify(data))


      // var response = await new API('applyLeave', data).getResponse();
      // console.log("Response is :", response);
      // try {
      //   if (response.response == 200) {
      //     this.setState({ loading: false })
      //     this.common.showToast(response.message)
      //     setTimeout(() => {
      //       this.props.navigation.goBack()
      //     }, 2000)
      //   }
      //   else {
      //     this.setState({ loading: false })
      //     this.common.showToast(response.message)
      //   }
      // } catch (error) {
      //   this.setState({ loading: false });
      //   this.common.showToast(error);
      // }
    }
  }

  leaveApplyInspectorRes = {
    success: (response) => {
      console.log("leave_sucess  ", response)
      this.setState({ loading: false })
      showToastMsg(response.message)
      this.props.navigation.goBack()
    },
    error: (error) => {
      console.log("leave_error  ", error)
      this.setState({ loading: false })
      showToastMsg(error.message)

    }
  }

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
  showDatePicker = async (time, name) => {
    console.log(time, name)
    this.setState({ isDatePickerVisible: true, pickerTime: new Date(), pickerInputName: name })
  };


  onChange = (event, selectedDate) => {
    this.hideDatePicker()
    let time = event?.nativeEvent?.timestamp
    if (time) {
      console.log(time, this.state.pickerInputName);
      if (this.state.pickerInputName == 'start_time') {
        this.setState({
          startTime: moment(time).format('HH:mm'),
          displayTime: moment(time).format('HH:mm'),
        });
      }
      if (this.state.pickerInputName == 'end_time') {
        this.setState({
          endTime: moment(time).format('HH:mm'),
          displayTime: moment(time).format('HH:mm'),
        });
      }
    }
  };

  hideDatePicker = () => {
    this.setState({ isDatePickerVisible: false })
  };

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <ScrollView>
        <View>
          <Form>
            <View style={[styles.row, { marginTop: 10 }]}>
              <Avatar
                rounded
                size="large"
                source={{
                  uri: this.state.profile.profilePic
                  ,
                }}
                containerStyle={{ marginRight: 10 }}
              />
              <View>
                <View style={styles2.nameContainer}>
                  <Text style={styles2.nameTxt}>
                    {this.state.profile.firstName + ' ' + this.state.profile.lastName} /{' '}
                    {this.state.profile.employeeId}
                  </Text>
                </View>
                <View style={styles2.nameContainer}>
                  <Text style={styles2.nameTxt}>
                    {this.state.profile.emailId}
                  </Text>
                </View>
                <View style={styles2.nameContainer}>
                  <Text style={styles2.nameTxt}>
                    {this.state.profile.mobileNumber}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={[styles.sectionColumn, { marginTop: 15, marginBottom: 10 }]}>
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
                    this.setState({ startDate: date });
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
              <View style={[styles.sectionColumn,]}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5 }}>
                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => this.showDatePicker(this.state.startTime, 'start_time')}>
                    <Icon
                      size={18}
                      name="clock-o"
                      type="font-awesome"
                      color="black"
                      containerStyle={{ textAlignVertical: 'center' }}
                    />
                    <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}> {this.state.startTime ? moment(this.state.startTime, 'HH:mm').format('hh:mm a') : 'Start time'} </Text>
                  </TouchableOpacity>
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
              </View>
              <View style={[styles.sectionColumn]}>
                <DatePicker
                  mode="date"
                  date={this.state.endDate}
                  minDate={this.state.startDate}
                  placeholder="End Date"
                  format="MM-DD-YYYY"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  onDateChange={date => {
                    this.setState({ endDate: date });
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
              <View style={[[styles.sectionColumn, { borderBottomWidth: 0 }]]}>
                <View style={{ flexDirection: 'row', justifyContent: 'flex-start', paddingTop: 5, paddingBottom: 5 }}>
                  <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'flex-start' }} onPress={() => this.showDatePicker(this.state.endTime, 'end_time')}>
                    <Icon
                      size={18}
                      name="clock-o"
                      type="font-awesome"
                      color="black"
                      containerStyle={{ textAlignVertical: 'center' }}
                    />
                    <Text style={[styles.dateText, { color: "black", marginLeft: 10 }]}> {this.state.endTime ? moment(this.state.endTime, 'HH:mm').format('hh:mm a') : 'End time'} </Text>

                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={[styles.center, styles.mtop15]}>
              <Button
                onPress={() => this.submitLeave()}
                title="Submit"
                buttonStyle={styles.btnNexts}
              />
            </View>
          </Form>
        </View>
      </ScrollView>
    );
  }
}
