import React, { Component } from 'react';
import {
  RefreshControl,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity, BackHandler
} from 'react-native';
import style from '../../../../assets/styles/style.js';
import { Text } from 'native-base';
import { Input, Icon } from 'react-native-elements';
import InspectionSchedule from '../../../Components/InspectionSchedule';
import Loader from '../../../Components/Loader';
import CalendarPicker from 'react-native-calendar-picker';
import { API } from "../../../network/API";
import Common from '../../Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
let refinedArray = [];

let today = moment();
let day = today.clone().startOf('month');
let customDatesStyles = [];

export default class Inspections extends Component {
  constructor(props) {
    super(props);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    this.state = {
      loading: false,
      error: null,
      refreshing: false,
      Data: [],
      FreshDataList: [],
      customDates: [],
      show: true,
      currentDate: '',
      date: new Date(),
      searchValue: '',
      data: [],
      selectedDates: []
    };
    this.common = new Common();
  }

  handleBackButtonClick() {
    console.log("Back_btn_click")
    BackHandler.exitApp();
    return true;
}

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
            backgroundColor: 'green',
            borderRadius: 30,
            width: 30,
            height: 30,
            marginVertical: 1, marginTop: 5, marginLeft: 15, marginRight: 10
            // height: 22,
            // borderRadius: 30,
            // padding: 18,
            // margin: 9,
          },
        });
      }
      console.log("select_date_value_fi >", customDates)
      this.setState({
        selectedDates: customDates
      })
    },
    error: (error) => {
      console.log("search_book>> err> ", error)

    }
  }

  loadBookings = async (firstDate, lastDate) => {
    let companyID = await AsyncStorage.getItem('companyId');
    let reAgentId = await AsyncStorage.getItem('reAgentID')
    let data = {};
    data['companyID'] = companyID;
    try {
      console.log("oooooooooooo >", companyID)
      API.searchHistory(this.historyBookRes, data)


      //   this.setState({loading: true}); // they wont let change calendar

      // let bookingResponse = await new API('SearchBooking', data).getResponse();
      // console.log('booking response : ', bookingResponse);
      // //   this.setState({loading: false}); // they wont let change calendar
      // let values = bookingResponse.values;
      // this.loadDates(values);
      // if (values && values.length > 0) {
      //   let group = values.reduce((r, a) => {
      //     r[
      //       moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
      //         'MM/DD/YYYY',
      //       )
      //     ] = [
      //         ...(r[
      //           moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
      //             'MM/DD/YYYY',
      //           )
      //         ] || []),
      //         a,
      //       ];
      //     return r;
      //   }, []);
      //   console.log('group', group);
      //   for (const property in group) {
      //     let objV = {};
      //     objV['title'] = property;
      //     objV['data'] = group[property];
      //     refinedArray.push(objV);
      //   }
      //   this.setState({ data: refinedArray, originalData: refinedArray });
      // } else {
      //   // this.common.showToast('Invalid Response');
      // }
    } catch (e) {
      this.common.showToast('Invalid Response' + " " + e);
    }
  };

  fetchApiCall = () => {
    let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    let lastDay = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    );
    let firstDate = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let lastDate = moment(lastDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    console.log("oooooooooo ", firstDate, lastDate)
    this.loadBookings(firstDate, lastDate);
  }

  async componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    this.fetchApiCall()
  }

  onRefresh() {
    this.fetchApiCall()
  }

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
            // width: 22,
            // height: 22,
            // borderRadius: 30,
            // padding: 18,
            // margin: 9,
          },
        });
      });
      console.log('customDates: ', customDates);
      this.setState({
        customDates: customDates,
      });
    }
  };


  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  renderItem = ({ item, index }) => {
    return <InspectionSchedule item={item} />;
  };

  searchFilterFunction = term => {
    let FreshDataList = [...this.state.FreshDataList];
    if (term === '') {
      this.setState({ Data: FreshDataList });
    } else {
      var term = term.toUpperCase();
      var filterList = FreshDataList.filter(item => {
        return (
          item.InspectorName.toUpperCase().includes(term) ||
          item.CompanyName.toUpperCase().includes(term) ||
          item.Address.toUpperCase().includes(term)
        );
      });
      this.setState({ Data: filterList });
    }
  };

  onDateChange = date => {
    console.log('on date change is called : ', date);
    this.setState({ date: date });
    const formattedDate = this.common.getDateFormat(new Date(date.toString()));
    let dateToPass = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    this.props.navigation.navigate("InspectionDetail", { 'Inspection': { "date": dateToPass } })

  };
  onMonthChange = date => {
    let firstDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    let lastDate = moment(date)
      .add(1, 'month')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    this.loadBookings(firstDate, lastDate);
  };

  header = () => {
    return (
      <View style={[style.row, { marginTop: 20 }]}>
        <Input
          placeholder="Search via company, inspector name, address"
          onChangeText={text => this.searchFilterFunction(text)}
          inputStyle={{ fontSize: 13 }}
          containerStyle={{ width: '84%', paddingLeft: 7 }}
          inputContainerStyle={{
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 2,
            paddingHorizontal: 6,
            marginVertical: 2,
          }}
          rightIcon={<Icon size={20} name="search" color="gray" />}
        />
      </View>
    );
  };


  render() {
    if (this.state.refreshing || this.state.loading) return <Loader />;

    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
          />
        }>
        <View>
          <CalendarPicker
            onDateChange={this.onDateChange}
            onMonthChange={this.onMonthChange}
            customDatesStyles={this.state.selectedDates}

          />
        </View>
      </ScrollView>
    );
  }
}
