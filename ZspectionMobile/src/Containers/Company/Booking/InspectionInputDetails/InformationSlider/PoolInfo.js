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
import Common from '../../../../Common';
import { API } from "../../../../../network/API";
import { color } from 'react-native-reanimated';
import colors from '../../../../../utils/colors';
import { showToastMsg } from '../../../../../utils';
import { deviceWidth, INSPECTION_TYPE, range } from '../../../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../../../../utils/strings';
import SliderHeader from '../common/SliderHeader';
import Constants from '../../../../../constants/Constants';

let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;
let squareFootateResponse;
let numberOfUnitResponse;
let itemMain = undefined;
let agentID = 0

const PoolInfo = ({
    item, onSubmit, page
}) => {
    const [poolList, setPoolList] = useState(range(1, 2))
    const [poolSelect, setPoolSelect] = useState('')



    const onSaveData = () => {
        if (poolSelect.length == 0) {
            showToastMsg(strings.pls_select_no_pool)
        } else {
            let savedata = {
                noOfPool: poolSelect,
            }
            onSubmit(true, savedata, item)
        }
    }


    return (
        <View style={{ flex: 1 }}>
            <SliderHeader item={item} />
            <View style={styles.mainView}>
                <View style={{}}>
                    <Picker
                        pickerStyleType="Android"
                        selectedValue={poolSelect}
                        onValueChange={(value, key) => {
                            console.log("value", value)
                            if (key != 0) {
                                setPoolSelect(value)
                            }
                        }}>
                        <Picker.Item
                            style={styles.picker_header}
                            label={strings.no_of_pool} value={strings.no_of_pool}
                        />
                        {poolList.map(pool => <Picker.Item label={pool.toString()}
                            value={pool} key={pool}
                            style={styles.picker_value}
                        />)}
                    </Picker>

                </View>
                <View style={styles.divider} />

                <View style={{
                    flexDirection: 'row', justifyContent: 'space-between',
                    width: deviceWidth * 0.9, alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginBottom: 15
                }}>
                    {console.log("dsadsadsabj >>", Constants.companyBookingInspectionTypeList[0],item)}
                    {Constants.companyBookingInspectionTypeList[0].id != item.id ?
                        <TouchableOpacity style={styles.action_btn_view}
                            onPress={() => onSubmit(false)}
                        >
                            <Text style={styles.action_btn_txt}>{strings.previous}</Text>
                        </TouchableOpacity>
                        :
                        <View style={{ flex: 1, height: 1 }} />
                    }

                    <TouchableOpacity style={styles.action_btn_view}
                        onPress={() => onSaveData()}
                    >
                        <Text style={styles.action_btn_txt}>{Constants.companyBookingInspectionTypeList.length == page + 1 ? "Continue" : strings.next}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
export default PoolInfo

