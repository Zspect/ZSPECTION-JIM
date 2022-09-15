import React, { Component, useEffect, useRef, useState } from 'react';
import {
  Platform,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
  View,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  BackHandler
} from 'react-native';
import styles from '../../../../assets/styles/style.js';

import {
  CheckBox,
  Avatar,
  Icon,
  Input,
  Rating,
  Button,
  Badge,
} from 'react-native-elements';
import Common from '../../Common';
import Loader from '../../../Components/Loader';

//import API from '../../../Api/Api';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Checkbox, RadioButton } from 'react-native-paper';
import { API } from "../../../network/API";
import moment from 'moment';
import { ROLE_ID, showToastMsg } from '../../../utils.js';
import { INSPECTION_TYPE } from '../../../utils/utils.js';
import colors from '../../../utils/colors.js';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const viewWidth = viewportWidth;
const itemWidth = viewWidth;

let DH = Dimensions.get('window').height;
let updateData = ''
let itemNew = ''
let agentID = 0
let companyIDD = 0
let role = 0
const CompanyListing = ({ navigation }) => {
  const carouselRef = useRef(null);
  const [catArray, setCatArray] = useState(navigation.state.params ? navigation.state.params.categoryArray : [])
  const [locationObj, setLocationObj] = useState(navigation.state.params ? navigation.state.params.locationObj : '')

  const [homeCat, setHomeCatObj] = useState(navigation.state.params && navigation.state.params.homeCatObj &&
    navigation.state.params.homeCatObj.sq_foot ?
    navigation.state.params.homeCatObj : undefined)

  const [pestCatObj, setPestCatObj] = useState(navigation.state.params && navigation.state.params.pestCatObj &&
    navigation.state.params.pestCatObj.sq_foot ?
    navigation.state.params.pestCatObj : undefined)

  const [poolCatObj, setPoolCatObj] = useState(navigation.state.params && navigation.state.params.poolCatObj &&
    navigation.state.params.poolCatObj.noOfPool ?
    navigation.state.params.poolCatObj : undefined)

  const [roofCatObj, setRoofObj] = useState(navigation.state.params && navigation.state.params.roofCatObj && navigation.state.params.roofCatObj.sq_foot ?
    navigation.state.params.roofCatObj : undefined)

  const [chimenyCatObj, setChimneyObj] = useState(navigation.state.params && navigation.state.params.chimneyCatObj && navigation.state.params.chimneyCatObj.chimney ?
    navigation.state.params.chimneyCatObj : undefined)

  const [isLoading, setIsLoading] = useState(true)
  const [activeSlide, setActiveSlide] = useState(0)

  const [homeInsList, setHomeInsList] = useState([])
  const [pestInsList, setPestInsList] = useState([])
  const [poolInsList, setPoolInsList] = useState([])
  const [roofInsList, setRoofInsList] = useState([])
  const [chimenyInsList, setChimenyInsList] = useState([])
  const [sectionLoading, setSectionLoading] = useState(false)
  const [checkInsList, setCheckInsList] = useState([])
  const [homeCheckIns, setHomeCheckIns] = useState('')
  const [pestCheckIns, setPestCheckIns] = useState('')
  const [poolCheckIns, setPoolCheckIns] = useState('')
  const [roofCheckIns, setRoofCheckIns] = useState('')
  const [chimenyCheckIns, setChimneyCheckIns] = useState('')
  const [roleID, setRoleID] = useState(0)

  const handleBackButtonClick = () => {
    console.log("back_press_click_1 >>", navigation)
    navigation.pop();
    return true;
  }


  useEffect(async () => {
    role = await AsyncStorage.getItem('role');
    console.log("lcaotion_obj>", locationObj)
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    // AsyncStorage.getItem('reAgentID').then((value) => {
    //   agentID = value
    // });

    if (navigation.state.params) {
      setIsLoading(true)
      console.log("sadsadasj >",navigation.state.params.companyID)
      if (navigation.state.params.companyID) {
        companyIDD = navigation.state.params.companyID
      }
      setCatArray(navigation.state.params.categoryArray)
      setLocationObj(navigation.state.params.locationObj)
      setHomeCatObj(navigation.state.params.homeCatObj &&
        navigation.state.params.homeCatObj.sq_foot ?
        navigation.state.params.homeCatObj : undefined
      )
      setPestCatObj(navigation.state.params.pestCatObj &&
        navigation.state.params.pestCatObj.sq_foot ?
        navigation.state.params.pestCatObj : undefined
      )
      setPoolCatObj(navigation.state.params.poolCatObj &&
        navigation.state.params.poolCatObj.noOfPool ?
        navigation.state.params.poolCatObj : undefined
      )
      setRoofObj(navigation.state.params.roofCatObj && navigation.state.params.roofCatObj.sq_foot ?
        navigation.state.params.roofCatObj : undefined
      )
      setChimneyObj(navigation.state.params.chimneyCatObj && navigation.state.params.chimneyCatObj.chimney ?
        navigation.state.params.chimneyCatObj : undefined
      )
      if (navigation.state.params.roleID) {
        setRoleID(navigation.state.params.roleID)
      }
    }
    return () => {
      BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
    };
  }, [])


  const ferchAllApi = () => {
    let findVal = navigation.state.params.categoryArray[activeSlide]
    if (findVal) {
      setSectionLoading(true)
      let time = moment(locationObj.time, 'h:mm:ss A').format(
        'HH:mm:ss',
      );

      console.log('Time string : ', homeCat ,pestCatObj,poolCatObj,roofCatObj,chimenyCatObj);
      let timeString =
        moment(locationObj.inspectiondate).format(
          'YYYY-MM-DD',
        ) +
        'T' +
        time +
        '.000Z';

      let myData = {
        "areaRangeId": 0,
        "inspectorId": 0,
        "companyId": navigation.state.params ? navigation.state.params.companyID:0,
        'ReAgentID': navigation.state.params.agentID ? navigation.state.params.agentID : 0,
        "inspectionDate": timeString,
        "ilatitude": locationObj.inspectionlat ? locationObj.inspectionlat : 0,
        "ilongitude": locationObj.inspectionlng ? locationObj.inspectionlng : 0
      }

      if (findVal.id == INSPECTION_TYPE[0].id) {
        myData.inspectionTypeId = findVal.id
        myData.areaRangeId = homeCat.sq_foot
        myData.pTypeId = homeCat.ptypeId
        myData.fTypeId = homeCat.fTypeid
        myData.chimneyTypeId = 0
        myData.noOFChimney = 0
        myData.noOfStories = 0
        myData.noOfPools = 0
      }
      else if (findVal.id == INSPECTION_TYPE[1].id) {
        myData.inspectionTypeId = findVal.id
        myData.areaRangeId = pestCatObj.sq_foot
        myData.pTypeId = pestCatObj.ptypeId
        myData.fTypeId = pestCatObj.fTypeid
        myData.chimneyTypeId = 0
        myData.noOFChimney = 0
        myData.noOfStories = 0
        myData.noOfPools = 0
      }
      else if (findVal.id == INSPECTION_TYPE[2].id) {
        myData.inspectionTypeId = findVal.id
        myData.areaRangeId = 0
        myData.pTypeId = 0
        myData.fTypeId = 0
        myData.chimneyTypeId = 0
        myData.noOFChimney = 0
        myData.noOfStories = 0
        myData.noOfPools = poolCatObj.noOfPool
      }
      else if (findVal.id == INSPECTION_TYPE[3].id) {
        myData.inspectionTypeId = findVal.id
        myData.areaRangeId = roofCatObj.sq_foot
        myData.pTypeId = roofCatObj.ptypeId
        myData.fTypeId = 0
        myData.chimneyTypeId = 0
        myData.noOFChimney = 0
        myData.noOfStories = roofCatObj.noOfStory
        myData.noOfPools = 0
      }
      else if (findVal.id == INSPECTION_TYPE[4].id) {
        myData.inspectionTypeId = findVal.id
        myData.areaRangeId = 0
        myData.pTypeId = 0
        myData.fTypeId = 0
        myData.chimneyTypeId = chimenyCatObj.chimney
        myData.noOFChimney = chimenyCatObj.noOfChimney
        myData.noOfStories = 0
        myData.noOfPools = 0
      }

      console.log("my_json_data >>", myData)
      API.searchInspector(searchInspectorRes, myData)
    }
  }

  useEffect(() => {
    console.log("ROLE_IDDDD >>2",navigation.state.params.companyID , companyIDD)
    ferchAllApi()
  }, [activeSlide])


  const searchInspectorRes = {
    success: (response) => {
      console.log("search_inspector>>>", response, itemNew)
      let findVal = catArray[activeSlide]
      if (findVal) {
        if (findVal.id == INSPECTION_TYPE[0].id) {
          setHomeInsList(response.data)
        }
        else if (findVal.id == INSPECTION_TYPE[1].id) {
          setPestInsList(response.data)
        }
        else if (findVal.id == INSPECTION_TYPE[2].id) {
          setPoolInsList(response.data)
        }
        else if (findVal.id == INSPECTION_TYPE[3].id) {
          setRoofInsList(response.data)
        }
        else if (findVal.id == INSPECTION_TYPE[4].id) {
          setChimenyInsList(response.data)
        }
        setSectionLoading(false)
      }
    },
    error: (error) => {
      console.log("search_inspector_error>>>", error)
      showToastMsg(error.message)
      setSectionLoading(false)
    }
  }

  useEffect(() => {
    console.log("odsadas >", checkInsList)
    for (let index = 0; index < checkInsList.length; index++) {
      const element = checkInsList[index];
    }
  }, [checkInsList])


  const checkBoxCheck = (item, index) => {
    console.log("dsabdsadjsabj >> ", item)
    if (item.inspectionTypeId == INSPECTION_TYPE[0].id) {
      homeCheckIns.priceMatrixId == item.priceMatrixId ? setHomeCheckIns('') : setHomeCheckIns(item)
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[1].id) {
      pestCheckIns.priceMatrixId == item.priceMatrixId ? setPestCheckIns('') : setPestCheckIns(item)
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[2].id) {
      poolCheckIns.priceMatrixId == item.priceMatrixId ? setPoolCheckIns('') : setPoolCheckIns(item)
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[3].id) {
      roofCheckIns.priceMatrixId == item.priceMatrixId ? setRoofCheckIns('') : setRoofCheckIns(item)
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[4].id) {
      chimenyCheckIns.priceMatrixId == item.priceMatrixId ? setChimneyCheckIns('') : setChimneyCheckIns(item)
    }

    // let updateList = [...checkInsList]

    // let isFind = checkInsList.find((ins) => ins.priceMatrixId == item.priceMatrixId)
    // let isFindInd = checkInsList.findIndex((ins) => ins.priceMatrixId == item.priceMatrixId)
    // if (isFind) {
    //   updateList.splice(isFindInd, 1)
    // } else {
    //   updateList.push(item)
    // }
    // setCheckInsList(updateList)


  }


  const markAsFavourite = async (item, index) => {
    var agentId = JSON.parse(await AsyncStorage.getItem('reAgentID'));
    let data = {
      "reagentId": agentId,
      "inspectorId": item.inspectorId
    }
    if (item.favorite) {
      API.removeToFavInspector(addToFavRes, data)
    } else {
      API.addToFavInspector(addToFavRes, data)
    }
  };

  const addToFavRes = {
    success: async (response) => {
      console.log("add_to_fav_ins>>>", response)
      showToastMsg(response.message)
      ferchAllApi()
    },
    error: async (error) => {
      console.log("add_to_fav_ins_Res>>>", error)
      showToastMsg(error.message)
    }
  }

  const renderInsRes = ({ item, index }) => {
    let isFind = undefined
    let inspectionNAme = ''
    if (item.inspectionTypeId == INSPECTION_TYPE[0].id) {
      isFind = homeCheckIns && homeCheckIns.priceMatrixId == item.priceMatrixId
      inspectionNAme = INSPECTION_TYPE[0].name
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[1].id) {
      isFind = pestCheckIns && pestCheckIns.priceMatrixId == item.priceMatrixId
      inspectionNAme = INSPECTION_TYPE[1].name
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[2].id) {
      isFind = poolCheckIns && poolCheckIns.priceMatrixId == item.priceMatrixId
      inspectionNAme = INSPECTION_TYPE[2].name
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[3].id) {
      isFind = roofCheckIns && roofCheckIns.priceMatrixId == item.priceMatrixId
      inspectionNAme = INSPECTION_TYPE[3].name
    }
    else if (item.inspectionTypeId == INSPECTION_TYPE[4].id) {
      isFind = chimenyCheckIns && chimenyCheckIns.priceMatrixId == item.priceMatrixId
      inspectionNAme = INSPECTION_TYPE[4].name
    }
    console.log("daskdsakjdsadbab >> ", item)


    return (
      <View
        style={[styles.inspectorListingWrapper, { width: '95%' }]}
        key={item.priceMatrixId}>
        <View style={[styles.twoRow]}>
          <TouchableOpacity
          >
            <View style={{ flexDirection: 'row' }}>
              <Checkbox
                status={
                  isFind ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  checkBoxCheck(item, index)
                }}
              />
              <Avatar
                rounded
                source={{
                  uri:item.profilePic,
                }}
                containerStyle={{ borderWidth: 1, borderColor: '#ccc' }}
                icon={{ name: 'user', type: 'font-awesome' }}
                size="large"
              />
            </View>

            <Text
              style={[
                styles.nameTxt,
                {
                  textAlign: 'center',
                  marginBottom: 6,
                  textDecorationLine: 'underline',
                },
              ]}>
              {item.companyName}
            </Text>
            <Rating
              ratingCount={5}
              imageSize={14}
              readonly
              startingValue={parseInt(4)}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.flatListItemTextRow}
          >
            <Text style={styles.nameTxt}>{item.inspectorName}</Text>
            <Text numberOfLines={4} style={styles.nameTxt2}>
              {item.companyBio}
            </Text>
            {inspectionNAme ?
              <Text numberOfLines={4} style={styles.nameTxt2}>
                {'Inspection Type:- ' + inspectionNAme}
              </Text> : null
            }

          </TouchableOpacity>
          <View style={{ justifyContent: 'space-between' }}>
            <Text style={styles.nameTxt}>$ {item.price}</Text>
            <CheckBox
              size={18}
              checkedIcon="heart"
              checkedColor="#B9183A"
              uncheckedIcon="heart-o"
              checked={item.favorite ? true : false}
              right
              onPress={() => markAsFavourite(item, index)}
              containerStyle={{ padding: 0, margin: 0 }}
            />
          </View>
        </View>
      </View>
    )
  }


  const renderFlatlistSec = (list, title) => {
    return (
      <View style={{ flex: 1, }}>

        <Text style={[styles.heading2, styles.capitalize]}>
          {title} Inspection
        </Text>
        {sectionLoading ? <Loader /> :
          list.length > 0 ?
            <FlatList
              data={list}
              renderItem={renderInsRes}
              keyExtractor={(item, index) => `${index}`}
              //refreshing={this.state.refreshing}
              contentContainerStyle={{ paddingBottom: DH * .12 }}
              // onRefresh={this.handleRefresh}
              style={{ flex: 1 }}
            /> : <View style={{
              flex: 1, width: '94%', justifyContent: 'center',
              alignContent: 'center', alignItems: 'center'
            }}>
              <Text style={{ color: colors.toolbar_bg_color, fontSize: 15, textAlign: 'center', lineHeight: 22 }}>
                {`No ${title} inspector available ,so you skip ${title} inspection.You can continue or try for other time`}</Text>
            </View>
        }
      </View>
    )
  }

  const renderSliderItem = ({ item, index }) => {
    let findVal = catArray[activeSlide]
    let arrayList = []
    if (findVal) {
      if (findVal.id == INSPECTION_TYPE[0].id) {
        console.log("oppopo ", findVal, item)
        return renderFlatlistSec(homeInsList, findVal.name)
      }
      else if (findVal.id == INSPECTION_TYPE[1].id) {
        return renderFlatlistSec(pestInsList, findVal.name)
      }
      else if (findVal.id == INSPECTION_TYPE[2].id) {
        return renderFlatlistSec(poolInsList, findVal.name)
      }
      else if (findVal.id == INSPECTION_TYPE[3].id) {
        return renderFlatlistSec(roofInsList, findVal.name)

      }
      else if (findVal.id == INSPECTION_TYPE[4].id) {
        return renderFlatlistSec(chimenyInsList, findVal.name)
      }
    }

  }

  const nextPage = index => {
    console.log('snap: ', index);
    carouselRef.current.snapToItem(index)
    //this._carousel.snapToItem(index);
  };


  const sendData = () => {
    let listData = []
    console.log("addabdas ", homeCheckIns, pestCheckIns, poolCheckIns, roofCheckIns, chimenyCheckIns)
    if (homeCheckIns) {
      listData.push(homeCheckIns)
    }
    if (pestCheckIns) {
      listData.push(pestCheckIns)
    }
    if (poolCheckIns) {
      listData.push(poolCheckIns)
    }
    if (roofCheckIns) {
      listData.push(roofCheckIns)
    }
    if (chimenyCheckIns) {
      listData.push(chimenyCheckIns)
    }

    return {
      address: locationObj.address,
      date: locationObj.inspectiondate,
      time: locationObj.time,
      inspectionList: listData,
    };
  }

  const confirmSelection = () => {
    console.log('Confirm Selection invoked...', sendData());
    if (sendData().inspectionList.length > 0) {
      navigation.navigate('SearchSummary', { request: sendData() });
      // this.props.navigation.navigate('SearchSummary', { request: this.SendData() });
    } else {
      showToastMsg("Please Select atleast 1 inspector")
    }

    // if (this.state.homeInspectors.length > 0 || this.state.pestInspectors.length > 0
    //   || this.state.poolInspectors.length > 0 || this.state.roofInspectors.length > 0 || this.state.chimneyInspectors.length > 0) {
    //   this.props.navigation.navigate('SearchSummary', { request: this.SendData() });
    // } else {
    //   showToastMsg("Data not found please try to change data")
    // }
  };

  const onSwipeNextClick = () => {
    let findVal = catArray[activeSlide]

    // if (findVal.id == INSPECTION_TYPE[0].id) {
    //   console.log("oppopo ", findVal, item)
    //   return renderFlatlistSec(homeInsList, findVal.name)
    // }
    // else if (findVal.id == INSPECTION_TYPE[1].id) {
    //   return renderFlatlistSec(pestInsList, findVal.name)
    // }
    // else if (findVal.id == INSPECTION_TYPE[2].id) {
    //   return renderFlatlistSec(poolInsList, findVal.name)
    // }
    // else if (findVal.id == INSPECTION_TYPE[3].id) {
    //   return renderFlatlistSec(roofInsList, findVal.name)

    // }
    // else if (findVal.id == INSPECTION_TYPE[4].id) {
    //   return renderFlatlistSec(chimenyInsList, findVal.name)
    // }

    let isSelected = false
    if (findVal) {
      if (findVal.id == INSPECTION_TYPE[0].id) {
        isSelected = homeInsList.length == 0 || homeCheckIns ? true : false
      }
      else if (findVal.id == INSPECTION_TYPE[1].id) {
        isSelected = pestInsList.length == 0 || pestCheckIns ? true : false
      }
      else if (findVal.id == INSPECTION_TYPE[2].id) {
        isSelected = poolInsList.length == 0 || poolCheckIns ? true : false
      }
      else if (findVal.id == INSPECTION_TYPE[3].id) {
        isSelected = roofInsList.length == 0 || roofCheckIns ? true : false
      }
      else if (findVal.id == INSPECTION_TYPE[4].id) {
        isSelected = chimenyInsList.length == 0 || chimenyCheckIns ? true : false
      }
    }
    if (!isSelected) {
      showToastMsg("Please select atleast 1 inspector")
    } else {
      setActiveSlide(activeSlide + 1)
    }
    //setActiveSlide(activeSlide + 1)
  }

  const getButtonView = () => {
    return (
      <View
        style={{
          marginBottom: 10,
          marginTop: 10,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <View>
          {activeSlide != 0 && (
            <Button
              title="Back"
              buttonStyle={[styles.btnNext, { marginVertical: 5 }]}
              icon={
                <Icon
                  name="angle-left"
                  containerStyle={{ position: 'absolute', left: 10 }}
                  type="font-awesome"
                  color="#FFF"
                />
              }
              iconLeft
              onPress={() => {
                setActiveSlide(activeSlide - 1)
              }}
            />
          )}
        </View>
        <View>
          {activeSlide < catArray.length - 1 ? (
            <Button
              title="Next"
              buttonStyle={[styles.btnNext, { marginVertical: 5 }]}
              icon={
                <Icon
                  name="angle-right"
                  containerStyle={{ position: 'absolute', right: 10 }}
                  type="font-awesome"
                  color="#FFF"
                />
              }
              iconRight
              // disabled={this.state.inspectionMarked.length > 0 ? false : true}
              // disabled={
              //   this.state.inspectionMarked.length ==
              //     this.state.inspectionCompanies.length
              //     ? false
              //     : true
              // }

              /**
               * add condition here gauravvvvvv
               */
              onPress={() => {
                onSwipeNextClick()

                // this.state.activeSlide ==
                //   this.state.inspectionCompanies.length - 1
                //   ? this.searchSummary()
                //   : this.setState({ activeSlide: this.state.activeSlide + 1 });
              }}
            />
          ) : (
            <TouchableOpacity
              onPress={() => {
                confirmSelection();
              }}
              style={{
                padding: 10,
                marginRight: 15,
                backgroundColor: '#28558E',
                borderRadius: 5,
                borderWidth: 1,
                marginTop: 3,
              }}>
              <Text style={{ color: 'white' }}>Confirm Selection</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };


  const getSlider = () => {
    return (
      <View style={{ flex: 1, }}>
        <Carousel
          ref={carouselRef}
          data={catArray}
          renderItem={renderSliderItem}
          sliderWidth={viewWidth}
          itemWidth={itemWidth}
          onSnapToItem={index => {
            setActiveSlide(index)
          }}
          firstItem={activeSlide}
          onPress={() => {
            this._carousel.snapToNext(() => { });
          }}
          snapToItem={nextPage}
          onBeforeSnapToItem={slideIndex => nextPage(slideIndex)}
          inactiveSlideOpacity={1}
          inactiveSlideScale={1}
          enableSnap={false}
          scrollEnabled={false}
        />
      </View>
    );
  };

  console.log("dsadsadsada >>", locationObj)
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 15 }}>
        <Text style={styles.heading2}>Inspection Request</Text>
        {locationObj != undefined && locationObj != null && locationObj != '' ?
          <View style={[styles.row]}>
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <Text style={styles.font12}>
                {locationObj.address}
              </Text>
            </View>
            <View style={{ justifyContent: 'space-between', flex: 1 }}>
              <Text style={[{ textAlign: 'right' }, styles.font12]}>
                {moment(locationObj.inspectiondate).format('MM-DD-YYYY')} |{' '}
                {moment(locationObj.time, 'hh:mm').format('LT')}
              </Text>
            </View>
          </View> : null
        }
        <View style={styles.border2} />
        <View style={{ flex: 1, }}>
          {getButtonView()}
          {getSlider()}
        </View>
        <View style={[styles.border2]} />
        <View
          style={{
            flex: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'white',
          }}>
          <Pagination
            dotStyle={{
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 4,
              //   backgroundColor: 'rgba(255, 255, 255, 0.92)'
            }}
            activeDotIndex={activeSlide}
            dotsLength={catArray.length}
          />
        </View>
      </View>
    </View>
  )
}
export default CompanyListing
