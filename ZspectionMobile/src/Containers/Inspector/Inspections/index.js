import React, { useEffect, useState } from 'react';
import {
  RefreshControl,
  View,
  ScrollView,BackHandler
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
//import API from '../../../Api/Api';
import { API } from "../../../network/API";

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import colors from '../../../utils/colors.js';


const Inspections = ({ navigation }) => {
  const [isRefresh, setIsRefresh] = useState(false)
  const [customeDates, setCustomDates] = useState([])

  function handleBackButtonClick() {
    BackHandler.exitApp()
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    fetchBookingInfo()
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [])

  const fetchBookingInfo = async () => {
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let data = inspectorID + '/' + 0
    API.fetchInspectorBookById(inspectorBookRes, data)
  }

  const inspectorBookRes = {
    success: (response) => {
      console.log("ins_res>>>", response)
      let customeDa = []

      response.data.map(item => {
        customeDa.push({
          date: item.startDate,
          textStyle: { color: '#FFF' },
          containerStyle: {
            // backgroundColor: 'green',
            // flex: 1,
            // borderRadius: 10,
            // marginVertical: 1,
            backgroundColor: 'green',
            borderRadius: 30,
            width: 30,
            height: 30,
            marginVertical: 1, marginTop: 5, marginLeft: 15, marginRight: 10
            // width: 22,
            // height: 22,
            // borderRadius: 30,
            // padding: 18,
            // margin: 9,
          },
        });
      });
      setCustomDates(customeDa)
    },

    error: (error) => {
      console.log("ins_error>>>", error)

    }
  }

  const onDateChange = date => {
    let dateFormate = moment(date).format('MM-DD-YYYY')
    navigation.navigate('InspectorDetailss', {
      data: dateFormate
    })
  };


  const onMonthChange = date => {

  };


  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isRefresh}
            onRefresh={() => {
              fetchBookingInfo()
            }}
          />
        }>
        <View>
          <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
            <CalendarPicker
              onDateChange={onDateChange}
              customDatesStyles={customeDates}
              onMonthChange={onMonthChange}
              
            />
          </View>
          {/* <View style={style.containers}>
            <FlatList
              data={this.state.Data}
              keyExtractor={(item, index) => `${index}`}
              renderItem={this.renderItem}
              ListHeaderComponent={this.header}
            />
          </View> */}
        </View>
      </ScrollView>
    </View>
  )

}
export default Inspections;


// export default class Inspections extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       error: null,
//       refreshing: false,
//       Data: [],
//       FreshDataList: [],
//       customDates: [],
//       show: true,
//       currentDate: '',
//       date: new Date(),
//       searchValue: '',
//       data: [],
//     };
//     this.common = new Common();
//   }

//   searchHistoryRes = {
//     success: (response) => {
//       console.log("bookingres_res>>>", response)
//       let values = response;
//       //this.loadDates(response.data);
//       if (values && values.length > 0) {
//         let group = values.reduce((r, a) => {
//           r[
//             moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
//               'MM/DD/YYYY',
//             )
//           ] = [
//               ...(r[
//                 moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
//                   'MM/DD/YYYY',
//                 )
//               ] || []),
//               a,
//             ];
//           return r;
//         }, []);
//         console.log('group', group);
//         for (const property in group) {
//           let objV = {};
//           objV['title'] = property;
//           objV['data'] = group[property];
//           refinedArray.push(objV);
//         }
//         this.fetch
//        // this.setState({ data: refinedArray, originalData: refinedArray });
//       } else {
//         // this.common.showToast('Invalid Response');
//       }

//     },
//     error: (error) => {
//       console.log("bookingres_error>>>", error)
//     }
//   }

//   loadBookings = async (firstDate, lastDate) => {
//     let inspectorID = await AsyncStorage.getItem('inspectorID');
//     let data = {};
//     data['reAgentID'] = 0;
//     data['inspectorID'] = inspectorID;
//     data['companyID'] = 0;
//     data['searchString'] = this.state.searchValue;
//     data['fromDate'] = firstDate;
//     data['toDate'] = lastDate;
//     try {
//       //   this.setState({loading: true}); // they wont let change calendar

//       API.searchHistory(this.searchHistoryRes, data)

//       //let bookingResponse = await new API('SearchBooking', data).getResponse();
//       console.log('booking responsesss : ', bookingResponse);
//       //   this.setState({loading: false}); // they wont let change calendar

//     } catch (e) {
//       this.common.showToast('Invalid Response');
//     }
//   };

//   componentDidMount() {
//     // let firstDay = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
//     // let lastDay = new Date(
//     //   new Date().getFullYear(),
//     //   new Date().getMonth() + 1,
//     //   0,
//     // );
//     // let firstDate = moment(firstDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     // let lastDate = moment(lastDay).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     // this.loadBookings(firstDate, lastDate);
//   }

//   componentDidUpdate(prevProps, prevState) {
//     if (
//       this.props.navigation.getParam('id') !==
//       prevProps.navigation.getParam('id')
//     ) {
//       this.loadData(this.props.navigation.getParam('date'));
//     }
//   }

//   loadData = async (date = null) => {
//     var profile = JSON.parse(await AsyncStorage.getItem('profile'));
//     var token = await AsyncStorage.getItem('authToken');
//     var header = { authentication: token };
//     var apiDate = date ? date : this.common.getDateFormat(new Date());
//     var data = {
//       companyid: profile.CompanyId,
//       inspectionid: 0,
//       inspectorid: profile.InspectorId,
//       date: apiDate,
//     };

//     var response = new API('CompanyInspectionList', data, header).getResponse();

//     response.then(result => {
//       console.log('response: ', result);
//       if (result.statuscode == 200) {
//         this.setState({
//           Data: result.result.company_inspection,
//           FreshDataList: result.result.company_inspection,
//         });
//         this.loadDates(result.result.company_calender);
//       } else {
//         console.log('error: ', result);
//       }
//     });
//   };

//   getDate() {
//     var that = this;
//     var date = new Date().getDate();
//     var monthNumber = new Date().getMonth();
//     var month = [
//       'January',
//       'February',
//       'March',
//       'April',
//       'May',
//       'June',
//       'July',
//       'August',
//       'September',
//       'October',
//       'November',
//       'December',
//     ];
//     var month = month[monthNumber];
//     var year = new Date().getFullYear();
//     that.setState({ currentDate: month + ' ' + date + ', ' + year });
//   }

//   onRefresh() {
//     this.loadData();
//   }

//   loadDates = dates => {
//     var customDates = [];
//     if (dates && dates.length > 0) {
//       dates.map(item => {
//         customDates.push({
//           date: item.startDate,
//           textStyle: { color: '#FFF' },
//           containerStyle: {
//             backgroundColor: 'green',
//             width: 22,
//             height: 22,
//             borderRadius: 30,
//             padding: 18,
//             margin: 9,
//           },
//         });
//         // dates.map( item => {
//         //     if(item.InsStatus == "Pending" || item.InsStatus == 'Schedule') {
//         //         customDates.push({
//         //             date: item.ScheduleDate,
//         //             textStyle: { color: '#FFF' },
//         //             style: { backgroundColor: 'green' },
//         //         })
//         //     }
//         //     else if(item.InsStatus == "Completed") {
//         //         customDates.push({
//         //             date: item.ScheduleDate,
//         //             textStyle: { color: '#FFF' },
//         //             style: { backgroundColor: '#242423' },

//         //         })
//         //     }
//         //     else if(item.InsStatus == "Cancelled" || item.InsStatus == "Canceled") {
//         //         customDates.push({
//         //             date: item.ScheduleDate,
//         //             textStyle: { color: '#FFF' },
//         //             style: { backgroundColor: '#de879c' },

//         //         })
//         //     }
//       });
//       console.log('customDates: ', customDates);
//       this.setState({
//         customDates: customDates,
//       });
//     }
//   };

//   ShowHideComponent = () => {
//     if (this.state.show == true) {
//       this.setState({ show: false });
//     } else {
//       this.setState({ show: true });
//     }
//   };

//   renderItem = ({ item, index }) => {
//     return (
//       <View>
//         <InspectionSchedule item={item} />
//       </View>
//     );
//   };

//   searchFilterFunction = term => {
//     let FreshDataList = [...this.state.FreshDataList];
//     if (term === '') {
//       this.setState({ Data: FreshDataList });
//     } else {
//       var term = term.toUpperCase();
//       var filterList = FreshDataList.filter(item => {
//         return (
//           item.InspectorName.toUpperCase().includes(term) ||
//           item.CompanyName.toUpperCase().includes(term) ||
//           item.Address.toUpperCase().includes(term)
//         );
//       });
//       this.setState({ Data: filterList });
//     }
//   };

//   onDateChange = date => {
//     console.log('on date change is called : ', date);
//     this.setState({ date: date });
//     const formattedDate = this.common.getDateFormat(new Date(date.toString()));
//     let dateToPass = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     this.props.navigation.navigate("InspectionDetail",
//       { 'Inspection': { "date": dateToPass } })

//   };
//   onMonthChange = date => {
//     let firstDate = moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     let lastDate = moment(date)
//       .add(1, 'month')
//       .utc()
//       .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
//     this.loadBookings(firstDate, lastDate);
//   };


//   header = () => {
//     return (
//       <View style={[style.row, { marginTop: 20 }]}>
//         {/* <View>
//                     <Icon
//                         size={26}
//                         name="sliders"
//                         type="font-awesome"
//                         color="gray"
//                         containerStyle={[style.borderIcon]}
//                         onPress={ () => this.props.navigation.navigate('CreateOfflineBooking')}
//                     />
//                 </View> */}
//       </View>
//     );
//   };

//   changeMonth = date => {
//     // console.log("changeMonth", month.toString())
//     this.loadData(this.common.getDateFormat(new Date(date.toString())));
//   };

//   render() {
//     if (this.state.refreshing || this.state.loading) return <Loader />;

//     return (
//       <ScrollView
//         refreshControl={
//           <RefreshControl
//             refreshing={this.state.refreshing}
//             onRefresh={this.onRefresh.bind(this)}
//           />
//         }>
//         <View>
//           <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1 }}>
//             <CalendarPicker
//               onDateChange={this.onDateChange}
//               customDatesStyles={this.state.customDates}
//               onMonthChange={this.onMonthChange}
//             />
//           </View>
//           <View style={style.containers}>
//             <FlatList
//               data={this.state.Data}
//               keyExtractor={(item, index) => `${index}`}
//               renderItem={this.renderItem}
//               ListHeaderComponent={this.header}
//             />
//           </View>
//         </View>
//       </ScrollView>
//     );
//   }
// }
