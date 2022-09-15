import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {
  Text,
  Form,
} from 'native-base';
import { Icon, Input, Button, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoogleSearch from '../../../../Components/GoogleSearch';
import moment from 'moment';
import { deviceWidth, INSPECTION_TYPE, parseGoogleLocation } from '../../../../utils/utils';
import PagerView from 'react-native-pager-view';
import Constants from '../../../../constants/Constants';
import HomePestInfo from './InformationSlider/HomePestInfo';
import PoolInfo from './InformationSlider/PoolInfo';
import RoofInfo from './InformationSlider/RoofInfo';
import ChimneyInfo from './InformationSlider/ChimneyInfo';
import colors from '../../../../utils/colors';
import strings from '../../../../utils/strings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ROLE_ID, showToastMsg } from '../../../../utils';
import { API } from '../../../../network/API';


let homeDataSave = ''
let poolDataSave = ''
let roofDataSave = ''
let chimneyDataSave = ''
let role = 0
let companyID = 0
let inspectorID = 0


const InformationSlider = ({ navigation }) => {
  const pagerRef = useRef()
  const [page, setPage] = useState(0)
  const [item, setItem] = useState('')
  const [homeCorrect, setHomeCorrect] = useState(false)
  const [inspectorProfile, setInspectorProfile] = useState('')

  const handleBackButtonClick = () => {
    console.log("BACk_PRESS")
    navigation.pop();
    return true;
  }

  // useEffect(() => {
  //   BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
  //   return () => {
  //     BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
  //   };
  // }, []);

  useEffect(async () => {
    role = await AsyncStorage.getItem('role');
    companyID = await AsyncStorage.getItem('companyId')
    inspectorID = await AsyncStorage.getItem('inspectorID')
    if (role == ROLE_ID[1].id) {
      API.fetchInspectorProfile(fetchInspectorRes, inspectorID)
    }
    console.log("pppppppp ", navigation.state.params.storeLocationData)
  }, [])


  const fetchInspectorRes = {
    success: (response) => {
      console.log("ins_profile_res>>>", response)
      setInspectorProfile(response.data)
    },
    error: (error) => {
      console.log("ins_profile_error>>>", error)
      setInspectorProfile('')
      setIsLoading(false)
    }
  }

  const onPageSelectIndex = (index) => {
    setPage(index)
    let findItem = Constants.companyBookingInspectionTypeList[index]
    setItem(findItem)
  }

  const renderUI = (item, index) => {
    if (index == 0) {
      return <HomePestInfo
        item={item}
      />
    }
    else {
      console.log("screen_load")
      return (
        <View key={index}
        >
          <Text>{`page :- ${index}`}</Text>
        </View>
      )
    }
  }

  const isCheckHomeTypeData = (status) => {
    console.log("home_type >", status)
  }

  const actionBtnClick = (index) => {
    setPage(index)
    pagerRef.current.setPage(index)
  }

  // is check all data added
  const validationCheck = (page) => {

  }

  const navigateToPager = (isNext, saveData, item) => {
    console.log("is_check_last >>", Constants.companyBookingInspectionTypeList.length == page + 1)
    if (isNext) {
      saveInspectionData(saveData, item)
      pagerRef.current.setPage(page + 1)
      if (Constants.companyBookingInspectionTypeList.length == page + 1) {

        if (role == ROLE_ID[1].id) {
          console.log("main_data>>", navigation.state.params.storeLocationData, homeDataSave, poolDataSave, roofDataSave, chimneyDataSave)
          let dataM = {
            "reAgentID": 0,
            "inspectorId": inspectorID,
            "companyId": 0,
            "areaRangeId": homeDataSave && homeDataSave != '' ? homeDataSave.sq_foot : 0,
            "inspectionDate": moment(navigation.state.params.storeLocationData.inspectiondate, 'MM/DD/YYYY').format('YYYY-MM-DD') + 'T' + moment(navigation.state.params.storeLocationData.time, 'hh:mm a').format('HH:mm') + ":" + "00.000Z",
            "inspectionTypeId": Constants.companyBookingInspectionTypeList[0].id,
            "pTypeId": homeDataSave && homeDataSave != '' ? homeDataSave.ptypeId : 0,
            "fTypeId": homeDataSave && homeDataSave != '' ? homeDataSave.fTypeid : 0,
            "chimneyTypeId": chimneyDataSave && chimneyDataSave != '' ? chimneyDataSave.chimney : 0,
            "noOFChimney": chimneyDataSave && chimneyDataSave != '' ? chimneyDataSave.noOfChimney : 0,
            "noOfStories": roofDataSave && roofDataSave != '' ? roofDataSave.noOfStory : 0,
            "noOfPools": poolDataSave && poolDataSave != '' ? poolDataSave.noOfPool : 0,
            "ilatitude": navigation.state.params.storeLocationData.inspectionlat,
            "ilongitude": navigation.state.params.storeLocationData.inspectionlng
          }
          console.log("main_data>dsdada>", dataM, Constants.companyBookingInspectionTypeList)
          //API.bookingForInspector(bookingInspectorRes, dataM)
          API.searchInspector(bookingInspectorRes, dataM)

        } else {
          console.log("company_dsadas ",homeDataSave,companyID,roofDataSave)
          navigation.navigate('CompanyListing', {
            categoryArray: Constants.AllBookingINspectionList,
            //categoryArray: this.props.navigation.state.params.selectedCategory,
            locationObj: navigation.state.params.storeLocationData,
            homeCatObj: homeDataSave,
            pestCatObj: homeDataSave,
            poolCatObj: poolDataSave,
            roofCatObj: roofDataSave,
            chimneyCatObj: chimneyDataSave,
            companyID: companyID,
            roleID: role


            // data: this.props.navigation.state.params.data,
            // homeAreaVal: this.state.homeAreaVal,
            // chimneyCount: this.state.slectChimney,
            // roof: this.state.selectRofVal,
            // poolCountVal: this.state.noOfPool,
            // noOfChim: this.state.noOfChim,
            // noOfPool: this.state.noOfPool,
            // noOfStories: this.state.noOfStrories,
            // pestAreaVal: this.state.pestAreaVal,
            // homeFoundationVal: this.state.homeFoundationVal,
            // homePropertyVal: this.state.homePropertyVal,
            // infectionMainId: itemMain,
          })
        }
      }
    }
    else {
      pagerRef.current.setPage(page - 1)
    }
  }



  const sendData = (inspectorList) => {
    let listData = []

    return {
      address: navigation.state.params.storeLocationData.address,
      date: navigation.state.params.storeLocationData.inspectiondate,
      time: navigation.state.params.storeLocationData.time,
      inspectionList: inspectorList,
    };
  }


  const bookingInspectorRes = {
    success: (response) => {
      console.log("booking_done>>", response)
      
      if (response.data.length > 0) {
        // sendData()
        console.log("asdsadsabdj >", sendData(response.data))
       navigation.navigate('SearchSummary', { request: sendData(response.data) });
      }else{
        showToastMsg(response.message)
      }
    },
    error: (error) => {
      showToastMsg(error.message)
      console.log("booking_done error>>>>>", error)
    }
  }

  const saveInspectionData = (data, inspectionItem) => {
    if (inspectionItem.id == INSPECTION_TYPE[0].id || inspectionItem.id == INSPECTION_TYPE[1].id) {
      homeDataSave = data
    } else if (inspectionItem.id == INSPECTION_TYPE[2].id) {
      poolDataSave = data
    }
    else if (inspectionItem.id == INSPECTION_TYPE[3].id) {
      roofDataSave = data
    }
    else if (inspectionItem.id == INSPECTION_TYPE[4].id) {
      chimneyDataSave = data
    }
  }

  return (
    <View style={{ flex: 1 }}>
      <PagerView
        ref={pagerRef}
        style={styles.pageMainView} initialPage={page}
        scrollEnabled={false}
        onPageSelected={(e) => onPageSelectIndex(e.nativeEvent.position)}
      >
        {Constants.companyBookingInspectionTypeList.map((item, index) => {
          if (item.id == INSPECTION_TYPE[0].id) {
            return <HomePestInfo
              item={item}
              onSubmit={navigateToPager}
              isCheckHomeTypeData={isCheckHomeTypeData}
              page={page}
            />
          }
          else if (item.id == INSPECTION_TYPE[1].id) {
            return <HomePestInfo
              item={item}
              onSubmit={navigateToPager}
              page={page}
            />
          }
          else if (item.id == INSPECTION_TYPE[2].id) {
            return <PoolInfo
              item={item}
              onSubmit={navigateToPager}
              page={page}
            />
          }
          else if (item.id == INSPECTION_TYPE[3].id) {
            return <RoofInfo
              item={item}
              onSubmit={navigateToPager}
              page={page}
            />
          }
          else if (item.id == INSPECTION_TYPE[4].id) {
            return <ChimneyInfo
              item={item}
              onSubmit={navigateToPager}
              page={page}
            />
          }
        })}
      </PagerView>
    </View>
  )
}

const styles = StyleSheet.create({
  pageMainView: {
    flex: 1
  },
  slider_main_container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', alignContent: 'center'
  },
  action_btn_view: {
    backgroundColor: colors.toolbar_bg_color, paddingVertical: 10,
    paddingHorizontal: 15, width: deviceWidth * 0.3, borderRadius: 5,
    justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginTop: 15
  },
  action_btn_txt: {
    color: colors.white, fontSize: 15
  }
})
export default InformationSlider;