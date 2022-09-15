import React, { Component, useEffect, useState } from 'react';
import {
    Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity,
    FlatList, Dimensions, BackHandler, TextInput
} from 'react-native';
import {
    Container, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Title, Form, Item, Toast, Picker
} from 'native-base';
import Loader from '../../../../../Components/Loader';
import Common from '../../../../../Containers/Common';
import { API } from "../../../../../network/API";
import { color } from 'react-native-reanimated';
import colors from '../../../../../utils/colors';
import { showToastMsg } from '../../../../../utils';
import { deviceWidth, INSPECTION_TYPE, range } from '../../../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../../../../utils/strings';
import SliderHeader from '../common/SliderHeader';
import Constants from '../../../../../constants/Constants';

let areaS = ''
let propertyS = ''
let foundationS = ''
const HomePestInfo = ({
    item,
    onSubmit, page
}) => {
    const [areaList, setAreaList] = useState([])
    const [propertyList, setPropertyList] = useState([])
    const [foundationList, setFoundationList] = useState([])
    const [areSelect, setSelectArea] = useState('')
    const [propertySelect, setSelectProperty] = useState('')
    const [foundationSelect, setSelectFoundation] = useState('')
    const [loading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchRequiredAPI()
    }, [])

    const fetchRequiredAPI = () => {
        setIsLoading(true)
        API.fetchAreaRange(areaRangeRes, '')
        API.fetchPropertyTypeTax(propertyTypeTaxRes, '')
        API.fetchFoundationType(founddationTypeRes, '')
    }

    const areaRangeRes = {
        success: (response) => {
            if (response.data.length > 0) {
                setAreaList(response.data)
            } else {
                setIsLoading(false)
            }
        },
        error: (error) => {
            setAreaList([])
            setIsLoading(false)
        }
    }

    const propertyTypeTaxRes = {
        success: (response) => {
            if (response.data.length > 0) {
                setPropertyList(response.data)
            } else {
                setIsLoading(false)
            }
        },
        error: (error) => {
            setPropertyList([])
            setIsLoading(false)
        }
    }

    const founddationTypeRes = {
        success: (response) => {
            console.log("price_matrix", response)
            if (response.data.length > 0) {
                setFoundationList(response.data)
            }
            setIsLoading(false)
        },
        error: (error) => {
            console.log("price_matrix_error>>>", error)
            setFoundationList([])
            setIsLoading(false)
        }
    }

    const onSaveData = () => {
        if (areSelect.length == 0) {
            showToastMsg(strings.pls_select_sq_foot)
        } else if (propertySelect == 0) {
            showToastMsg(strings.pls_select_properties_home)
        }
        else if (foundationSelect == 0) {
            showToastMsg(strings.pls_select_foundation_home)
        } else {
            let savedata = {
                sq_foot: areSelect.areaRangeId,
                ptypeId: propertySelect,
                fTypeid: foundationSelect
            }
            onSubmit(true, savedata, item)
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <SliderHeader item={item} />
            {loading ? <Loader /> :
                <View style={styles.mainView}>
                    <View style={{}}>
                        <Picker
                            pickerStyleType="Android"
                            selectedValue={areSelect}
                            onValueChange={(value, key) => {
                                console.log("value", value)
                                if (key != 0) {
                                    setSelectArea(value)
                                }
                            }}>
                            <Picker.Item
                                style={styles.picker_header}
                                label={strings.sqare_foot} value={strings.sqare_foot}
                            />
                            {areaList.map(area => <Picker.Item label={area.areaRange}
                                style={styles.picker_value}
                                value={area} key={area.areaRangeId} />)}
                        </Picker>
                    </View>
                    <View style={styles.divider} />
                    <View style={{}}>
                        <Picker
                            pickerStyleType="Android"
                            selectedValue={propertySelect}
                            onValueChange={(value, key) => {
                                console.log("value", value)
                                if (key != 0) {
                                    setSelectProperty(value)
                                }
                            }}>
                            <Picker.Item
                                style={styles.picker_header}
                                label={strings.property} value={strings.property}
                            />

                            {propertyList.map(property => <Picker.Item label={property.name}
                                style={styles.picker_value}
                                value={property.id} key={property.id} />)}
                        </Picker>
                    </View>
                    <View style={styles.divider} />
                    <View style={{}}>
                        <Picker
                            pickerStyleType="Android"
                            selectedValue={foundationSelect}
                            onValueChange={(value, key) => {
                                console.log("value", value)
                                if (key != 0) {
                                    setSelectFoundation(value)
                                }
                            }}>
                            <Picker.Item
                                style={styles.picker_header}
                                label={strings.foundation} value={strings.foundation}
                            />
                            {foundationList.map(foundation => <Picker.Item label={foundation.name}
                                style={styles.picker_value}
                                value={foundation.id} key={foundation.id} />)}
                        </Picker>
                        <View style={styles.divider} />
                    </View>

                    <View style={{
                        flexDirection: 'row', justifyContent: 'space-between',
                        alignContent: 'center',
                        alignItems: 'center', alignSelf: 'center', marginVertical: 15
                    }}>
                        <TouchableOpacity style={styles.action_btn_view}
                            onPress={() => onSaveData()}
                        >
                            <Text style={styles.action_btn_txt}>{Constants.companyBookingInspectionTypeList.length == page + 1 ? "Continue" : strings.next}</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            }

        </View>
    )
}


const styles = StyleSheet.create({
    mainView: {
        flex: 1, paddingHorizontal: 15
    },
    divider: {
        width: '100%', height: 1, backgroundColor: colors.lightGray
    },
    picker_header: {
        color: 'gray', fontSize: 16, fontWeight: '900'
    },
    picker_value: {
        color: 'black', fontSize: 14, fontWeight: '900'
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
export default HomePestInfo

