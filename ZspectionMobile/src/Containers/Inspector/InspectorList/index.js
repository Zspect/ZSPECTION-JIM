import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,BackHandler
} from 'react-native';
import Loader from '../../../Components/Loader';
import { API } from '../../../network/API';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import colors from '../../../utils/colors.js';
import { deviceWidth } from '../../../constants/Constants.js';
import {
  convertInspectorBookingStatusToStr,
  INSPECTOR_BOOKING_STATUS,
} from '../../../utils/utils.js';
import EmptyUI from '../../../Components/EmptyUI.js';
import { showToastMsg } from '../../../utils.js';

let currentDateOrTIme = moment();
const InspectorsList = ({ navigation }) => {
  const [bookList, setBookList] = useState([]);
  const [bookLoading, setBookLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [selectData, setSelectData] = useState('');

  //backhandler press
  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }


  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, []);


  useEffect(() => {
    let focusSubscription = navigation.addListener('didFocus', payload => {
      fetchBookingInfo();
    });
    const interval = setInterval(() => {
      fetchBookingInfo();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchBookingInfo, navigation]);

  const fetchBookINfo = async () => {
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let data = {
      fetchDate: navigation.state.params.data,
      inspectorID: inspectorID,
    };
    API.fetchInspectorBookByDate(inspectorBookRes, data);
  };

  const reejctBooking = item => {
    Alert.alert('Decline', 'Are you sure want to decline this booking?', [
      {
        text: 'Yes',
        onPress: () => {
          onDeclineBooking(item);
        },
      },
      {
        text: 'No',
        onPress: () => { },
      },
    ]);
  };

  const onDeclineBooking = item => {
    API.rejectBookingByInspector(rejectBookingRes, item.bookingDetailId);
  };

  const rejectBookingRes = {
    success: response => {
      console.log('booking_update', response);
      showToastMsg(response.message);
      fetchBookingInfo();
    },
    error: error => {
      console.log('booking_update_errr', error);
      showToastMsg(error.message);
    },
  };

  const acceptBooking = (item, index) => {
    API.acceptBookingByInspector(acceptBookingRes, item.bookingDetailId);
  };

  const acceptBookingRes = {
    success: response => {
      console.log('booking_update', response);
      showToastMsg(response.message);
      fetchBookingInfo();
    },
    error: error => {
      console.log('booking_update_errr', error);
      showToastMsg(error.message);
    },
  };

  const fetchBookingInfo = async () => {
    setBookLoading(true);
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let data = {
      fetchDate: navigation.state.params.data,
      inspectorID: inspectorID,
    };
    API.fetchInspectorBookByDate(inspectorBookRes, data);
  };

  const inspectorBookRes = {
    success: response => {
      console.log('ins_res>>>', response);
      setBookList(response.data);
      setBookLoading(false);
      setIsFetching(false);
    },
    error: error => {
      console.log('ins_error>>>', error);
      setBookList([]);
      setBookLoading(false);
      setIsFetching(false);
    },
  };

  const onRefresh = () => {
    setIsFetching(true);
    fetchBookingInfo();
  };

  const switchToView = (item, index) => {
    navigation.navigate('InspectorInspectionDetails', {
      data: item,
    });
  };

  const renderBook = dateTime => {
    let currentDateTime = moment();
    let bookingDateObj = moment(dateTime);
    if (currentDateTime.isSameOrAfter(bookingDateObj)) {
      return true;
    }
    console.log(
      'start_book_date',
      moment(dateTime).format('DD MM YYYY hh:mm a'),
      moment().format('DD MM YYYY hh:mm a'),
      currentDateTime.isSameOrAfter(bookingDateObj),
    );
    return false;
  };

  const startBookingClick = item => {
    if (item.isJobStarted) {
      API.closeBookingByInspector(jobStartTimeUpdteRes, item.bookingDetailId);
    } else {
      API.jobStartTimeUpdate(jobStartTimeUpdteRes, item.bookingDetailId);
    }
  };

  const jobStartTimeUpdteRes = {
    success: response => {
      console.log('job_start_res>>>', response);
      //showToastMsg(response.message);
      fetchBookingInfo();
    },
    error: error => {
      console.log('job_start_error>>>', error);
      showToastMsg(error.message);
    },
  };

  const switchToLoctionTime = () => {
    // navigation.navigate('InspectorInspectionType',{
    //   selectedDate:navigation.state.params.data
    // })
    /*navigation.navigate('InspectionLocationTime',{
      selectedDate:navigation.state.params.data
    })*/
  }

  const renderBookCell = ({ item, index }) => {
    return (
      <View
        style={{
          width: deviceWidth * 0.95,
          alignSelf: 'center',
          paddingVertical: 10,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
          <View style={{ width: 100, height: 100, padding: 5 }}>
            <Image
              style={{
                flex: 1,
                width: undefined,
                height: undefined,
                borderRadius: 10,
              }}
              source={{ uri: item.pictureUrl }}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 5 }}>
            <View style={styles.chile_value_main_view}>
              <Text style={styles.chile_value_txt_heading}>
                Inspection Type:-
              </Text>
              <Text style={styles.child_value_value_txt}>
                {item.inspectionTypeName}
              </Text>
            </View>
            <View style={styles.chile_value_main_view}>
              <Text style={styles.chile_value_txt_heading}>
                Inspection Date:-
              </Text>
              <Text style={styles.child_value_value_txt}>
                {moment(item.startDate).format('MM-DD-YYYY hh:mm a')}
              </Text>
            </View>
            <View style={styles.chile_value_main_view}>
              <Text style={styles.chile_value_txt_heading}>Status:-</Text>
              <Text
                style={[
                  styles.child_value_value_txt,
                  {
                    color:
                      item.bookingStatus == INSPECTOR_BOOKING_STATUS.PENDING
                        ? colors.toolbar_bg_color
                        : item.bookingStatus ==
                          INSPECTOR_BOOKING_STATUS.COMPLETED
                          ? colors.txtColor
                          : colors.lightGray,
                    textTransform: 'uppercase',
                  },
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {convertInspectorBookingStatusToStr(item.bookingStatus)}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 32,
                flexDirection: 'row',
                alignSelf: 'center',
                alignContent: 'center',
                alignItems: 'center',
                borderColor: colors.toolbar_bg_color,
                borderWidth: 0.5,
                borderRadius: 10,
              }}>
              <View style={{ flexDirection: 'row', flex: 1 }}>
                <TouchableOpacity
                  style={styles.action_touch}
                  onPress={() => switchToView(item, index)}>
                  <Text
                    style={[
                      styles.action_txt,
                      { color: colors.black, fontWeight: 'normal' },
                    ]}>
                    View
                  </Text>
                </TouchableOpacity>
                {
                  /**
                   * accept and reject button only show when booking status accept(2)
                   */
                }
                {item.bookingStatus == INSPECTOR_BOOKING_STATUS.ACCEPT_BY_INSPECTOR ? (
                  <>
                    <View
                      style={{
                        width: 0.9,
                        height: 32,
                        backgroundColor: colors.gray,
                      }}
                    />
                    <TouchableOpacity
                      style={[styles.action_touch]}
                      onPress={() => {
                        // acceptBooking(item, index);
                        startBookingClick(item, index);
                      }}>
                      <Text
                        style={[
                          styles.action_txt,
                          { color: colors.toolbar_bg_color },
                        ]}>
                        {item.isJobStarted ? "End" : " Start"}
                      </Text>
                    </TouchableOpacity>
                    {/* {item.isJobStarted && (
                      <TouchableOpacity
                        style={[styles.action_touch]}
                        onPress={() => {
                          startBookingClick(item, index);
                        }}>
                        <Text
                          style={[
                            styles.action_txt,
                            { color: colors.toolbar_bg_color },
                          ]}>
                          Stop
                        </Text>
                      </TouchableOpacity>
                    )} */}

                  </>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.white }}>
      <View style={{ flex: 1 }}>
        {bookLoading ? (
          <Loader />
        ) : bookList.length > 0 ? (
          <FlatList
            data={bookList}
            renderItem={renderBookCell}
            onRefresh={onRefresh}
            refreshing={isFetching}
            keyExtractor={(item, index) => index}
            ItemSeparatorComponent={() => {
              return (
                <View
                  style={{
                    width: deviceWidth * 0.9,
                    height: 1,
                    backgroundColor: colors.gray,
                  }}
                />
              );
            }}
          />
        ) : (
          <EmptyUI str="Data not found" />
        )}
      </View>
      {/* <TouchableOpacity style={{ width: deviceWidth, height: 50, backgroundColor: colors.toolbar_bg_color, justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}
        onPress={() => switchToLoctionTime()}
      >
        <Text style={{ color: colors.white, fontSize: 15, textTransform: 'uppercase', fontWeight: 'bold' }}>Add Booking</Text>
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  action_touch: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  action_txt: {
    color: colors.toolbar_bg_color,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
  },
  chile_value_main_view: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 8,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  chile_value_txt_heading: {
    color: colors.black,
    fontSize: 12,
    fontWeight: '700',
    flex: 0.55,
  },
  child_value_value_txt: {
    color: colors.black,
    fontSize: 13,
    flex: 1,
  },
});

export default InspectorsList;
