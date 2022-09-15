import React, { useEffect, useRef, useState } from 'react';
import {
    StyleSheet,
    StatusBar,
    View,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import {
    Text,
    Form,
} from 'native-base';
import { Icon, Input, Button, } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import PagerView from 'react-native-pager-view';
import Constants, { deviceWidth } from '../../../../../constants/Constants';
import colors from '../../../../../utils/colors';
import strings from '../../../../../utils/strings';
import { INSPECTION_TYPE } from '../../../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

let companyID = 0
const FindInspectorFrInspection = ({ navigation }) => {

    useEffect(() => {
        console.log("dsadsabdsadbsajd >>", navigation.state.params)
        fetchData()
    }, [])

    const fetchData = async()=>{
        companyID = await AsyncStorage.getItem('companyId')
        let time = moment(navigation.state.params.storeLocation.time, 'h:mm:ss A').format('HH:mm:ss');
        console.log('Time string : ', time);
        let timeString =
            moment(navigation.state.params.storeLocation.inspectiondate, 'MM/DD/YYYY').format('YYYY-MM-DD') +
            'T' +
            time +
            '.000Z';

        let data = {
            inspectorId: 0,
            companyId: companyID,
            ReAgentID: 0,
            inspectionDate: timeString,
            ilatitude: navigation.state.params.storeLocation.inspectionlat ? navigation.state.params.storeLocation.inspectionlat : 0,
            ilongitude: navigation.state.params.storeLocation.inspectionlng ? navigation.state.params.storeLocation.inspectionlng : 0,
        }

       

        // for (let index = 0; index < Constants.companyBookingInspectionTypeList.length; index++) {
        //     const element = Constants.companyBookingInspectionTypeList[index];
        //     if (element.id == INSPECTION_TYPE[0].id && navigation.state.params.inspectionVal.homeOrPest) {
        //         data.inspectionTypeId = element.id;
        //         data.areaRangeId = navigation.state.params.inspectionVal.homeOrPest.sq_foot;
        //         data.pTypeId = navigation.state.params.inspectionVal.homeOrPest.ptypeId;
        //         data.fTypeId = navigation.state.params.inspectionVal.homeOrPest.fTypeid;
        //     } 
        //     else if (element.id == INSPECTION_TYPE[1].id && navigation.state.params.inspectionVal.homeOrPest) {
        //         data.inspectionTypeId = element.id;
        //         data.areaRangeId = navigation.state.params.inspectionVal.homeOrPest.sq_foot;
        //         data.pTypeId = navigation.state.params.inspectionVal.homeOrPest.ptypeId;
        //         data.fTypeId = navigation.state.params.inspectionVal.homeOrPest.fTypeid;
        //     }
        //     else if (element.id == INSPECTION_TYPE[2].id && navigation.state.params.inspectionVal.pool) {
        //         data.inspectionTypeId = element.id;
        //         data.noOfPools = navigation.state.params.inspectionVal.pool.noOfPool;
        //     }
        //     else if (element.id == INSPECTION_TYPE[3].id && navigation.state.params.inspectionVal.roof) {
        //         data.inspectionTypeId = element.id;
        //         data.areaRangeId =  navigation.state.params.inspectionVal.roof.sq_foot;
        //         data.pTypeId =  navigation.state.params.inspectionVal.roof.ptypeId;
        //         data.noOfStories = navigation.state.params.inspectionVal.roof.noOfStory;
        //     }
        //     else if (element.id == INSPECTION_TYPE[4].id && navigation.state.params.inspectionVal.chimney) {
        //         data.inspectionTypeId = element.id;
        //         data.chimneyTypeId = navigation.state.params.inspectionVal.chimney.chimney;
        //         data.noOFChimney = navigation.state.params.inspectionVal.chimney.noOfChimney;
        //     }
        // }

        console.log("fetch_profile_dat",data)
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ width: '100%', paddingHorizontal: 15, paddingTop: 10, flex: 1 }}>
                <Text style={{ color: colors.toolbar_bg_color, fontWeight: 'bold', fontSize: 16 }}>Inspection Request</Text>
                <View style={{ width: '100%', flexDirection: 'row', marginTop: 2 }}>
                    <View style={{ flex: 1, }}>
                        <Text style={{ color: colors.txtColor, fontSize: 14 }}>{navigation.state.params.storeLocation.address}</Text>
                    </View>
                    <View style={{ flex: 1, }}>
                        <View style={{ justifyContent: 'space-between', flex: 1 }}>
                            <Text style={[{ textAlign: 'right', color: colors.txtColor, fontSize: 14 }]}>
                                {moment(navigation.state.params.storeLocation.inspectiondate).format('MM/DD/YYYY')} |{' '}
                                {moment(navigation.state.params.storeLocation.time, 'hh:mm').format('LT')}
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ width: '100%', height: 1, backgroundColor: colors.lightGray, marginVertical: 15 }} />
                <View style={{ flex: 1, }}>
                </View>
            </View>
        </View>
    )
}
export default FindInspectorFrInspection