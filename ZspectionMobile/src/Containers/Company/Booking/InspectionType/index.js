import React, { Component, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  Text,
  BackHandler,
  FlatList,
} from 'react-native';
import { API } from '../../../../network/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MatrixButton } from '../../../../Components/MatrixButtons';
import styles2 from '../../../../../assets/styles/style.js';
import { Icon, Button } from 'react-native-elements';
import { ROLE_ID, showToastMsg } from '../../../../utils';
import { INSPECTION_TYPE } from '../../../../utils/utils';
import Loader from '../../../../Components/Loader';
import Constants from '../../../../constants/Constants';

let companyID = 0;
let inspectorID = 0
let role = 0
let selectIT = [];
const InspectionType = ({ navigation }) => {
  const [inspectionType, setInspectionType] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  function handleBackButtonClick(){
    console.log('Back button clicked');
    BackHandler.exitApp()
    return true;
  }

  useEffect(() => {
    
    
  }, [])

  useEffect(async () => {

    role = await AsyncStorage.getItem('role');
    if (role == ROLE_ID[1].id) {
      inspectorID = await AsyncStorage.getItem('inspectorID');
      fetchInspectorInspectionType()
      // setIsLoading(true);
      // API.fetchCompanyInfectionByCoID(fetchCompanyInfectionByCoIDRes, companyID);
      let focusSubscription = navigation.addListener(
        'didFocus',
        payload => {
          BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
          console.log("pppppppppp", companyID)
          fetchInspectorInspectionType()

          return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
          };
        },
      );

    } else if (role == ROLE_ID[2].id) {
      companyID = await AsyncStorage.getItem('companyId');
      fetchCompanyInspectionType()
      // setIsLoading(true);
      // API.fetchCompanyInfectionByCoID(fetchCompanyInfectionByCoIDRes, companyID);
      let focusSubscription = navigation.addListener(
        'didFocus',
        payload => {
          BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
          console.log("pppppppppp", companyID)
          fetchCompanyInspectionType()

          return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
          };

        },
      );
    }
   
  }, []);

  const fetchInspectorInspectionType = () => {
    setIsLoading(true);
    API.fetchInspectorInfectionByINID(fetchCompanyInfectionByCoIDRes, inspectorID);
  }

  const fetchCompanyInspectionType = () => {
    setIsLoading(true);
    API.fetchCompanyInfectionByCoID(fetchCompanyInfectionByCoIDRes, companyID);
  }


  const fetchCompanyInfectionByCoIDRes = {
    success: response => {
      console.log('fetch_company_IT_su', response);
      setInspectionType(response.data);
      setIsLoading(false);
    },
    error: error => {
      console.log('fetch_company_IT_error', error);
      setInspectionType([]);
      setIsLoading(false);
    },
  };

  const selectInspectionType = (isSelected, item) => {
    if (isSelected) {
      let demoArray = [...selectIT];
      demoArray.push(item);
      selectIT = demoArray;
    } else {
      if (selectIT.length > 0) {
        let demoArray = [...selectIT];
        let isFind = demoArray.findIndex(data => data.id === item.id);
        if (isFind != -1) {
          demoArray.splice(isFind, 1);
        }
        selectIT = demoArray;
      }
    }
    console.log('select_in_type >>', selectIT);
  };

  const navigateToAddressSelectionScreen = () => {
    let clone2 = [...selectIT];
    let arrayDemo = clone2;
    let clone = [...selectIT];
    // let newArrayDemo = clone
    // newArrayDemo.sort((a, b) => a.id - b.id);
    // Constants.AllBookingINspectionList = newArrayDemo

    let isFindHome = arrayDemo.findIndex(
      data => data.id == INSPECTION_TYPE[0].id,
    );
    let isFindPest = arrayDemo.findIndex(
      data => data.id == INSPECTION_TYPE[1].id,
    );
    if (isFindPest != -1 && isFindHome != -1) {
      arrayDemo.splice(isFindPest, 1);
    }

    // sort by ascending b item id
    arrayDemo.sort((a, b) => a.id - b.id);
    Constants.companyBookingInspectionTypeList = arrayDemo
    Constants.AllBookingINspectionList = clone
    setTimeout(() => {
      console.log("osddsadasda >>", clone)
    }, 1000)
    navigation.navigate('InspectionLocationTime')
  };

  return (
    <View style={{ flex: 1 }}>
      {isLoading ? <Loader /> :
        <View style={{ flex: 1 }}>
          <Text
            style={{
              textAlign: 'center',
              color: '#67778b',
              paddingVertical: 15,
              fontSize: 14,
            }}>
            You can select more than one
          </Text>
          <View style={{ flex: 1 }}>
            <FlatList
              data={inspectionType}
              renderItem={({ item }) => (
                <MatrixButton
                  onMatrixButtonClick={
                    (isSelected, item) => {
                      console.log('select_value >>', isSelected, item);
                      selectInspectionType(isSelected, item);
                    }
                    // this.categoryClick(isSelected, item)
                  }
                  matrixItem={item}
                  iconUri={item.pictureUrl}
                />
              )}
              numColumns={2}
              keyExtractor={(item, index) => index.toString()}
            />

            <View style={[{ marginTop: 100, justifyContent: 'center' }]}>
              <View style={styles2.nextButtonWrappers}>
                <Button
                  title="Proceed"
                  buttonStyle={styles2.btnAlone}
                  icon={
                    <Icon
                      name="angle-right"
                      containerStyle={{ position: 'absolute', right: 10 }}
                      type="font-awesome"
                      color="#FFF"
                    />
                  }
                  onPress={() => {
                    if (selectIT.length > 0) {
                      navigateToAddressSelectionScreen();
                    } else {
                      showToastMsg('Please select an item to continue...');
                    }
                    //navigateTo()
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      }

    </View>
  );
};
export default InspectionType;
