import React, {Component, useEffect, useState} from 'react';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  BackHandler,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Modal from 'react-native-modal';
import {deviceHeight, deviceWidth} from '../../constants/Constants.js';
import colors from '../../utils/colors.js';
import Common from '../Common/index.js';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {API} from '../../network/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showToastMsg} from '../../utils.js';
import {INSPECTION_TYPE, range} from '../../utils/utils.js';
import ToggleSwitch from 'toggle-switch-react-native';

let common = null;
let CHIMENY_ID = 14;
let ROOF_ID = 12;
let POOL_ID = 11;

let compayID = 0;
let userID = 0;
let isFindData = undefined;
let editPriceMA = undefined;

const CompanyPriceMatrix = (props, {navigation}) => {
  const [isModal, setIsModal] = useState(false);
  const [isModalType, setIsModalType] = useState(0);
  const [infectionType, setInfectionType] = useState('');
  const [saveInfectionType, setSaveInfectionType] = useState('');
  const [saveInspector, setSaveInspector] = useState([]);
  const [saveProperty, setSaveProperty] = useState('');
  const [noOfProperty, setNOProperty] = useState('');
  const [saveAreaRange, setAreaRange] = useState('');
  const [priceStr, setPrice] = useState('');
  const [saveInstStr, setSaveInsStr] = useState([]);
  const [saveChimney, setSaveChimney] = useState('');
  const [chimneyNo, setChimneyNO] = useState('');
  const [isSaveIns, setIsSaveIns] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [saveFoundationType, setSaveFoundationType] = useState('');
  const [noOfPoolList, setNoOfPoolList] = useState(range(1, 2));

  function handleBackButtonClick() {
    props.navigation.goBack();
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    common = new Common();
    // let focusSubscription = navigation.addListener(
    //     'didFocus',
    //     payload => {
    //         console.log("dsdsadasd ", payload)
    //         if(payload.action!=undefined && payload.action.params!=undefined && payload.action.params!=null && payload.action.params.params!=undefined && payload.action.params.params!=null && payload.action.params.params!=''){
    //             setEditPrice(payload.action.params.params)
    //         }
    //     },
    // );
    AsyncStorage.getItem('userid').then(data => {
      userID = data;
    });
    console.log('props.navigation.state 111');
    AsyncStorage.getItem('inspectorDataSave')
      .then(data => {
        console.log('inss_list >', JSON.parse(data));
        setIsSaveIns(JSON.parse(data));
        isFindData = JSON.parse(data);
      })
      .catch(er => {
        console.log('inss_list err>', er);
      });
    fetchInfectionType();
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, []);

  useEffect(() => {
    if (
      props.navigation.state != undefined &&
      props.navigation.state.params != undefined &&
      props.navigation.state.params != null &&
      props.navigation.state.params.params != undefined &&
      props.navigation.state.params.params != null &&
      props.navigation.state.params.params != ''
    ) {
      console.log('my_value>> ', props.navigation.state.params.params);
      console.log(
        'dsdsadasd ',
        props.navigation.state.params.params.noOfStories,
      );
      setEditPrice(props.navigation.state.params.params);
      editPriceMA = props.navigation.state.params.params;
      fetchPropertyType();
      fetchAreaRange();
      fetchChimneyType();
      fetchFoundationType();
      if (
        props.navigation.state.params.params.inspectionTypeId ==
        INSPECTION_TYPE[2].id
      ) {
        setNOProperty(props.navigation.state.params.params.noOfPool.toString());
      } else {
        setNOProperty(
          props.navigation.state.params.params.noOfStories.toString(),
        );
      }

      setChimneyNO(
        props.navigation.state.params.params?.noOfChimney != undefined
          ? props.navigation.state.params.params.noOfChimney.toString()
          : '0',
      );
      setPrice(props.navigation.state.params.params.price.toString());
      setIsActive(props.navigation.state.params.params.isActive);
    } else {
      editPriceMA = undefined;
      console.log('props.navigation.state 222', props.navigation.state);
      setIsModalType(0);
      setInfectionType('');
      setSaveInfectionType('');
      setSaveInspector('');
      setSaveProperty('');
      setNOProperty('');
      setAreaRange('');
      setPrice('');
      setSaveInsStr('');
      setSaveChimney('');
      setChimneyNO('');
      setIsSaveIns('');
      setEditPrice('');
      setIsActive(true);
      setSaveFoundationType('');
    }
  }, [props]);

  useEffect(() => {
    setSaveInsStr([]);
    let array = [];
    for (let index = 0; index < saveInspector.length; index++) {
      const element = saveInspector[index];
      array.push(element.firstName + ' ' + element.lastName);
    }
    setSaveInsStr(array);
  }, [saveInspector]);

  const fetchAreaRange = () => {
    API.fetchAreaRange(areaRangeRes, '');
  };

  const areaRangeRes = {
    success: response => {
      console.log('AR_inspector >>>', response);
      setInfectionType(response.data);
      if (editPriceMA != undefined && editPriceMA != null) {
        let isFindVal = response.data.find(
          match => match.areaRangeId == editPriceMA.areaRangeId,
        );
        if (isFindVal != undefined) {
          setAreaRange(isFindVal);
        }
      }
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const fetchChimneyType = () => {
    console.log('dssadksabdbsad >');
    API.fetchChimneyType(chimneyTypeRes, '');
  };

  const chimneyTypeRes = {
    success: response => {
      console.log('CH_inspector >>>', response);
      setInfectionType(response.data);
      if (
        editPriceMA != undefined &&
        editPriceMA != null &&
        editPriceMA.chimneyTypeName != undefined
      ) {
        let isFindVal = response.data.find(
          match => match.chimneyTypeName == editPriceMA.chimneyTypeName,
        );
        if (isFindVal != undefined) {
          setSaveChimney(isFindVal);
        }
      } else {
      }
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const fetchPropertyType = () => {
    API.fetchPropertyType(propertyTypeRes, '');
  };

  const propertyTypeRes = {
    success: response => {
      console.log('PT_inspector >>>', response);
      setInfectionType(response.data);
      if (editPriceMA != undefined && editPriceMA != null) {
        let isFindVal = response.data.find(
          match => match.id == editPriceMA.ptypeId,
        );
        if (isFindVal != undefined) {
          setSaveProperty(isFindVal);
        }
      }
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const fetchFoundationType = () => {
    API.fetchFoundationType(foundatinTypeRes, '');
  };

  const foundatinTypeRes = {
    success: response => {
      console.log('found_inspector >>>', response);
      setInfectionType(response.data);
      if (editPriceMA != undefined && editPriceMA != null) {
        let isFindVal = response.data.find(
          match => match.id == editPriceMA.ftypeId,
        );
        if (isFindVal != undefined) {
          setSaveFoundationType(isFindVal);
          //  setSaveProperty(isFindVal)
        }
      }
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const fetchInspector = () => {
    API.fetchInspectorFromInfectionTypeCompayId(
      inspectorTypeRes,
      compayID + '/' + saveInfectionType.id,
    );
  };

  const inspectorTypeRes = {
    success: response => {
      console.log('company_inspector >>>', response);
      setInfectionType(response.data);

      if (editPriceMA != undefined && editPriceMA != '') {
        let isFindVal = response.data.find(
          match => match.inspectorId == editPriceMA.inspectorId,
        );
        let isFindValIndex = response.data.findIndex(
          match => match.inspectorId == editPriceMA.inspectorId,
        );
        if (isFindVal != undefined) {
          //setSaveInfectionType(isFindVal)
          addIns(isFindVal, isFindValIndex);
        }
      }
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const fetchInfectionType = async () => {
    compayID = await AsyncStorage.getItem('companyId');
    API.fetchInfectionTypeFromCompanyId(infectionTypeRes, compayID);
  };

  const infectionTypeRes = {
    success: response => {
      console.log('inspection_re >', response);
      setInfectionType(response.data);
      setTimeout(() => {
        console.log('kkkkkkkkk >', editPriceMA);
        if (editPriceMA != undefined && editPriceMA != '') {
          let isFindVal = response.data.find(
            match => match.id == editPriceMA.inspectionTypeId,
          );
          if (isFindVal != undefined) {
            setSaveInfectionType(isFindVal);
            API.fetchInspectorFromInfectionTypeCompayId(
              inspectorTypeRes,
              compayID + '/' + editPriceMA.inspectionTypeId,
            );
          }
        }
      }, 1200);

      setTimeout(() => {
        if (response.data != undefined) {
          console.log('update_data ppppp>>>', isFindData);
          if (isFindData != undefined && isFindData != null && isFindData) {
            let isFindVal = response.data.find(
              match => match.id == isFindData.inspectionTypeId,
            );
            if (isFindVal != undefined) {
              console.log('update_data >>>', isFindVal);
              setSaveInfectionType(isFindVal);
            }
          }
        }
      }, 1000);
    },
    error: error => {
      console.log('company_inspector_error>>>', error);
    },
  };

  const closeModal = () => {
    setIsModalType(-1);
    setIsModal(false);
  };

  const addIns = (insp, index) => {
    let ins = [...saveInspector];
    let isFIndd = saveInspector.findIndex(
      data => data.inspectorId == insp.inspectorId,
    );
    if (isFIndd != -1) {
      ins.splice(isFIndd, 1);
    } else {
      ins.push(insp);
    }
    setSaveInspector([]);
    setSaveInsStr([]);
    setSaveInspector(ins);
  };

  const saveChimenyA = (insp, index) => {
    let ins = [...saveChimneyList];
    let isFIndd = saveChimneyList.findIndex(
      data => data.chimneyTypeId == insp.chimneyTypeId,
    );
    if (isFIndd != -1) {
      ins.splice(isFIndd, 1);
    } else {
      ins.push(insp);
    }
    setSaveChimneyList([]);
    setSaveChimneyNameList([]);
    setSaveChimneyList(ins);
  };

  const generateChimneyList = () => {
    let arrayChimeny = range(1, 10);
    setInfectionType(arrayChimeny);
  };

  const generateNoOfPoolList = () => {
    let arrayNoPool = range(1, 2);
    setInfectionType(arrayNoPool);
  };

  const renderModalItem = ({item, index}) => {
    if (isModalType == 0) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSaveInfectionType(item);
            setSaveInspector([]);
            setSaveInsStr([]);
            setSaveProperty('');
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name='checkbox-blank-outline'
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 1) {
      console.log('dsadsabddbbsab >>>', saveInspector);
      let isFIndd =
        saveInspector.length > 0
          ? saveInspector.find(data => data.inspectorId == item.inspectorId)
          : '';
      if (item.firstName) {
        return (
          <TouchableOpacity
            style={{
              width: deviceWidth * 0.5,
              height: 45,
              flexDirection: 'row',
              alignItems: 'center',
            }}
            onPress={() => {
              //fetchPropertyType()
              addIns(item, index);
              //closeModal()
            }}>
            <MaterialCommunityIcons
              name={isFIndd ? 'checkbox-marked' : 'checkbox-blank-outline'}
              color={colors.black}
              size={20}
            />
            <Text style={{marginHorizontal: 10}}>
              {item.firstName + ' ' + item.lastName}
            </Text>
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    } else if (isModalType == 2) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            console.log('dsadsakda >>', item);
            setSaveProperty(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name='checkbox-blank-outline'
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 3) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setAreaRange(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name='checkbox-blank-outline'
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item.areaRange}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 4) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSaveChimney(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name={isFIndd ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item.chimneyTypeName}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 5) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setChimneyNO(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name={isFIndd ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 6) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setSaveFoundationType(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name={isFIndd ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item.name}</Text>
        </TouchableOpacity>
      );
    } else if (isModalType == 7) {
      return (
        <TouchableOpacity
          style={{
            width: deviceWidth * 0.5,
            height: 45,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={() => {
            setNOProperty(item);
            closeModal();
          }}>
          {/* <MaterialCommunityIcons
                        name={isFIndd ? 'checkbox-marked' : 'checkbox-blank-outline'}
                        color={colors.black}
                        size={20}
                    /> */}
          <Text style={{marginHorizontal: 10}}>{item}</Text>
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  const modalTypeHeading = () => {
    let heading = '';
    if (isModalType == 0) {
      heading = 'Select Inspection Type';
    } else if (isModalType == 1) {
      heading = 'Select Inspector';
    } else if (isModalType == 2) {
      heading = 'Select Property Type';
    } else if (isModalType == 3) {
      heading = 'Square Footage';
    } else if (isModalType == 4) {
      heading = 'Select Chimney Type';
    } else if (isModalType == 5) {
      heading = 'Select Chimney No.';
    } else if (isModalType == 6) {
      heading = 'Select Foundation Type';
    } else if (isModalType == 7) {
      heading = 'Select No. of pool';
    }
    return heading;
  };

  const saveCompanyPriceMatrixUpdateRes = {
    success: response => {
      console.log('save_price_matrix_id >>>', response);
      showToastMsg(response.message);
      props.navigation.goBack();
    },
    error: error => {
      console.log('save_price_matrix_id_error>>>', error);
    },
  };

  const savePriceMatrix = () => {
    if (editPrice) {
      if (priceStr.length == 0) {
        showToastMsg('please add price');
      } else {
        let data = {
          priceMatrixId: editPrice.priceMatrixId,
          price: priceStr,
        };
        API.updatePriceMatrix(saveCompanyPriceMatrixUpdateRes, data);
      }
    } else {
      if (saveInfectionType == '') {
        showToastMsg('please select Inspection type ');
      } else if (saveInstStr.length == 0) {
        showToastMsg('please select Inspector');
      } else if (
        saveInfectionType.id != CHIMENY_ID &&
        saveProperty.length == 0
      ) {
        showToastMsg('please select Property type');
      } else if (
        saveInfectionType.id == CHIMENY_ID &&
        saveChimney.length == 0
      ) {
        showToastMsg('please select Chimney type');
      } else if (
        saveInfectionType &&
        saveInfectionType.foundationTypeRequired &&
        saveProperty &&
        saveProperty.foundationTypeRequired &&
        saveFoundationType.length == 0
      ) {
        showToastMsg('please select Foundation type');
      } else if (saveInfectionType.id == CHIMENY_ID && chimneyNo.length == 0) {
        showToastMsg('please add No. of chimney');
      } else if (
        saveInfectionType.id != CHIMENY_ID &&
        saveInfectionType.id == ROOF_ID &&
        noOfProperty.length == 0
      ) {
        showToastMsg('please add No. of stories');
      } else if (
        saveInfectionType.id != CHIMENY_ID &&
        saveInfectionType.id == POOL_ID &&
        noOfProperty.length == 0
      ) {
        showToastMsg('please add No. of pool');
      } else if (
        saveInfectionType.id != CHIMENY_ID &&
        saveInfectionType.id != POOL_ID &&
        saveAreaRange.length == 0
      ) {
        showToastMsg('please select Area range');
      } else if (priceStr.length == 0) {
        showToastMsg('please add price');
      } else {
        if (saveInfectionType.id == CHIMENY_ID) {
          let arrayID = [];
          for (let index = 0; index < saveInspector.length; index++) {
            const element = saveInspector[index];
            arrayID.push(element.inspectorId);
          }
          let data = {
            companyId: compayID,
            chimneyTypeId: saveChimney.chimneyTypeId,
            ftypeId: 0,
            duration: 0,
            noOfChimney: chimneyNo,
            price: priceStr,
            createdBy: userID,
            inspectorId: arrayID,
          };
          API.saveCompanyChimneyPriceMatrix(saveCompanyPriceMatrixRes, data);
        } else {
          let arrayID = [];
          for (let index = 0; index < saveInspector.length; index++) {
            const element = saveInspector[index];
            arrayID.push(element.inspectorId);
          }
          let data = {
            areaRangeId: saveAreaRange.areaRangeId,
            isMaxLimit: true,
            companyId: compayID,
            inspectionTypeId: saveInfectionType.id,
            ptypeId: saveProperty.id,
            ftypeId: saveFoundationType ? saveFoundationType.id : 0,
            duration: 0,
            noOfStories: saveInfectionType.id == ROOF_ID ? noOfProperty : 0,
            noOfPool: saveInfectionType.id == POOL_ID ? noOfProperty : 0,
            price: priceStr,
            inspectorIdList: arrayID,
          };
          API.saveCompanyPriceMatrix(
            saveCompanyPriceMatrixRes,
            JSON.stringify(data),
          );
        }
      }
    }
  };

  const saveCompanyPriceMatrixRes = {
    success: response => {
      console.log('save_price_matrix_id >>>', response);
      showToastMsg(response.message);
      setSaveInfectionType('');
      setSaveInspector([]);
      setSaveInsStr([]);
      setSaveProperty('');
      closeModal();
      setSaveChimney('');
      setNOProperty('');
      setAreaRange('');
      setPrice('');
      props.navigation.goBack();
    },
    error: error => {
      console.log('save_price_matrix_id_error>>>', error);
    },
  };

  const handleProfileActive = status => {
    setIsActive(status);
    let data = {
      priceMatrixId: editPrice.priceMatrixId,
      isActive: status,
    };
    API.priceMatrixStatus(priceMatrixStatusRes, data);
  };

  const priceMatrixStatusRes = {
    success: response => {
      console.log('save_price_matrix_id >>>', response);
      showToastMsg(response.message);
    },
    error: error => {
      console.log('save_price_matrix_id_error>>>', error);
      showToastMsg(error.message);
    },
  };

  return (
    <View style={{flex: 1, width: '100%', height: '100%', padding: 15}}>
      <ScrollView>
        <View style={{flex: 1}}>
          {editPrice ? (
            <View style={{flexDirection: 'row', marginBottom: 25}}>
              <Text style={{fontSize: 14, fontWeight: '800', flex: 1}}>
                STATUS
              </Text>
              <ToggleSwitch
                isOn={isActive}
                onColor="green"
                offColor="grey"
                label={isActive ? 'Active' : 'Inactive'}
                labelStyle={{color: 'black', fontWeight: '200'}}
                size="small"
                onToggle={isOn => handleProfileActive(isOn)}
              />
            </View>
          ) : null}

          <View style={styles.main_container}>
            <Text style={styles.heading_txt_style}>Inspection Type</Text>
            <TouchableOpacity
              disabled={editPrice ? true : false}
              onPress={() => {
                if (editPrice != '') {
                } else {
                  fetchInfectionType();
                  setIsModalType(0);
                  setIsModal(true);
                }
              }}>
              <Text style={styles.value_txt_style}>
                {saveInfectionType
                  ? saveInfectionType.name
                  : 'Select Inspection Type'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.main_container}>
            <Text style={styles.heading_txt_style}>Inspector</Text>
            <TouchableOpacity
              disabled={editPrice ? true : false}
              onPress={() => {
                if (editPrice != '') {
                } else {
                  if (saveInfectionType) {
                    fetchInspector();
                    setIsModalType(1);
                    setIsModal(true);
                  } else {
                    showToastMsg('please select Inspection type ');
                  }
                }
              }}>
              <Text style={styles.value_txt_style}>
                {saveInstStr.length > 0
                  ? saveInstStr.toString()
                  : 'Select Inspector'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {saveInfectionType.id == CHIMENY_ID ? (
            <View style={styles.main_container}>
              <Text style={styles.heading_txt_style}>Chimney Type</Text>
              <TouchableOpacity
                disabled={editPrice ? true : false}
                onPress={() => {
                  if (editPrice != '') {
                  } else {
                    fetchChimneyType();
                    setIsModalType(4);
                    setIsModal(true);
                  }
                }}>
                <Text style={styles.value_txt_style}>
                  {saveChimney ? saveChimney.chimneyTypeName : 'Select Chimney'}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.main_container}>
              <Text style={styles.heading_txt_style}>Property Type</Text>
              <TouchableOpacity
                disabled={editPrice ? true : false}
                onPress={() => {
                  if (editPrice != '') {
                  } else {
                    fetchPropertyType();
                    setIsModalType(2);
                    setIsModal(true);
                  }
                }}>
                <Text style={styles.value_txt_style}>
                  {saveProperty ? saveProperty.name : 'Select Property Type'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.divider} />

          {saveInfectionType &&
          saveInfectionType.foundationTypeRequired &&
          saveProperty &&
          saveProperty.foundationTypeRequired ? (
            <View style={styles.main_container}>
              <Text style={styles.heading_txt_style}>Foundation Type</Text>
              <TouchableOpacity
                disabled={editPrice ? true : false}
                onPress={() => {
                  fetchFoundationType();
                  setIsModalType(6);
                  setIsModal(true);
                }}>
                <Text style={styles.value_txt_style}>
                  {saveFoundationType
                    ? saveFoundationType.name
                    : 'Select Foundation Type'}
                </Text>
              </TouchableOpacity>

              <View style={styles.divider} />
            </View>
          ) : null}

          {saveInfectionType.id == CHIMENY_ID ? (
            <View style={styles.main_container}>
              <Text style={styles.heading_txt_style}>{'No. of Chimney'}</Text>

              <TouchableOpacity
                disabled={editPrice ? true : false}
                onPress={() => {
                  if (editPrice != '') {
                  } else {
                    generateChimneyList();
                    setIsModalType(5);
                    setIsModal(true);
                  }
                }}>
                <Text style={styles.value_txt_style}>
                  {chimneyNo ? chimneyNo : 'Select Chimney'}
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
            </View>
          ) : null}

          {(saveInfectionType && saveInfectionType.id == ROOF_ID) ||
          saveInfectionType.id == POOL_ID ? (
            <View style={styles.main_container}>
              <Text style={styles.heading_txt_style}>
                {saveInfectionType.id == ROOF_ID
                  ? 'No. of Stories'
                  : 'No. of Pool'}
              </Text>
              {saveInfectionType.id == ROOF_ID ? (
                <TextInput
                  style={{
                    width: deviceWidth * 0.9,
                    color: colors.black,
                    padding: 0,
                    fontSize: 14,
                  }}
                  keyboardType="number-pad"
                  placeholder="Enter value"
                  value={noOfProperty}
                  editable={editPrice ? false : true}
                  onChangeText={val => {
                    setNOProperty(val.replace(/[^0-9]/g, ''));
                  }}
                />
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    generateNoOfPoolList();
                    setIsModalType(7);
                    setIsModal(true);
                  }}
                  disabled={editPrice ? true : false}>
                  <Text
                    style={{
                      width: deviceWidth * 0.9,
                      color: colors.black,
                      padding: 0,
                      fontSize: 14,
                      marginTop: 5,
                    }}
                    keyboardType="number-pad"
                    placeholder="Enter value"
                    value={noOfProperty}
                    editable={editPrice ? false : true}>
                    {noOfProperty
                      ? noOfProperty.toString()
                      : 'Select No. of pool'}{' '}
                  </Text>
                </TouchableOpacity>
              )}

              <View style={styles.divider} />
            </View>
          ) : null}

          {saveInfectionType.id != CHIMENY_ID &&
          saveInfectionType.id != POOL_ID ? (
            <View>
              <View style={styles.main_container}>
                <Text style={styles.heading_txt_style}>Square Footage</Text>
                <TouchableOpacity
                  disabled={editPrice ? true : false}
                  onPress={() => {
                    if (editPrice != '') {
                    } else {
                      fetchAreaRange();
                      setIsModalType(3);
                      setIsModal(true);
                    }
                  }}>
                  <Text style={styles.value_txt_style}>
                    {saveAreaRange
                      ? saveAreaRange.areaRange
                      : 'Select Square Footage'}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.divider} />
            </View>
          ) : null}

          <View style={styles.main_container}>
            <Text style={styles.heading_txt_style}>Price</Text>

            <TextInput
              style={{
                width: deviceWidth * 0.9,
                color: colors.black,
                padding: 0,
                fontSize: 14,
              }}
              keyboardType="numeric"
              placeholder="Enter value"
              value={priceStr}
              onChangeText={val => {
                setPrice(val);
              }}
            />
          </View>
          <View style={styles.divider} />

          <TouchableOpacity
            style={{
              width: 150,
              height: 45,
              backgroundColor: colors.toolbar_bg_color,
              borderRadius: 20,
              justifyContent: 'center',
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: 15,
            }}
            onPress={() => savePriceMatrix()}>
            <Text
              style={{color: colors.white, fontSize: 14, fontWeight: 'bold'}}>
              {editPrice ? 'Save Price' : 'SAVE'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        testID={'modal'}
        isVisible={isModal}
        onBackButtonPress={() => {
          setIsModal(false);
        }}
        onBackdropPress={() => {
          setIsModal(false);
        }}
        style={styles.modal_view}>
        <View
          style={{
            width: deviceWidth,
            height: deviceHeight * 0.5,
            backgroundColor: colors.white,
          }}>
          <View
            style={{flex: 1, width: deviceWidth * 0.9, alignSelf: 'center'}}>
            <View
              style={{
                width: '100%',
                height: 50,
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.toolbar_bg_color,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  flex: 1,
                }}>
                {modalTypeHeading()}
              </Text>
              <TouchableOpacity onPress={() => setIsModal(false)}>
                <AntDesign
                  name="closecircle"
                  color={colors.toolbar_bg_color}
                  size={25}
                />
              </TouchableOpacity>
            </View>
            {infectionType.length > 0 ? (
              <View style={{flex: 1}}>
                <FlatList
                  data={infectionType}
                  renderItem={renderModalItem}
                  style={{flex: 1}}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center',
                }}>
                <Text>data not found</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    width: '100%',
  },
  heading_txt_style: {
    color: colors.toolbar_bg_color,
    fontSize: 14,
    fontWeight: '900',
  },
  value_txt_style: {
    color: colors.black,
    fontSize: 16,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 10,
  },
  modal_view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
export default CompanyPriceMatrix;

// export default class CompanyPriceMatrix extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {

//         }
//         this.common = new Common();
//     }
//     render() {
//         return (
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Coming Soon</Text>
//             </View>
//         );
//     }
// }
