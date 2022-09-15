import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList,
    Text,
    TouchableOpacity,
    Image,
    StyleSheet,
    Alert,
    Dimensions,
    ScrollView,
} from 'react-native';
import Loader from '../../../Components/Loader';
import { API } from '../../../network/API';

import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import colors from '../../../utils/colors.js';
import { deviceWidth } from '../../../constants/Constants.js';
import {
    convertInspectorBookingStatusToStr,
    INSPECTION_TYPE,
    INSPECTOR_BOOKING_STATUS,
    parseGoogleLocation,
} from '../../../utils/utils.js';
import EmptyUI from '../../../Components/EmptyUI.js';
import { showToastMsg } from '../../../utils.js';
import GoogleSearch from '../../../Components/GoogleSearch';
import DateTimePicker from 'react-native-modal-datetime-picker';
import styles from '../../../../assets/styles/style.js';
import { Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import {
    Form,
} from 'native-base';
import HomePestInfo from '../../Company/Booking/InspectionInputDetails/InformationSlider/HomePestInfo';
import PoolInfo from '../../Company/Booking/InspectionInputDetails/InformationSlider/PoolInfo';
import RoofInfo from '../../Company/Booking/InspectionInputDetails/InformationSlider/RoofInfo';
import ChimneyInfo from '../../Company/Booking/InspectionInputDetails/InformationSlider/ChimneyInfo';

let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;


const Booking = ({ navigation }) => {
    const [profile, setProfile] = useState('')
    const [loading, setIsLoading] = useState(false)

    useEffect(() => {
        fetchInspectorInfo()
    }, [])

    const fetchInspectorInfo = async () => {
        setIsLoading(true)
        let inspectorID = await AsyncStorage.getItem('inspectorID');
        API.fetchInspectorProfile(fetchInspectorRes, inspectorID)
    }

    const fetchInspectorRes = {
        success: (response) => {
            console.log("ins_profile_res>>>", response)
            setProfile(response.data)
            if(response.data){
                for (let index = 0; index < response.data.inspectionTypeIdList.length; index++) {
                    const element = response.data.inspectionTypeIdList[index];
                    console.log("dsagdgsayudgsad>",element)
                    
                }
            }
            setIsLoading(false)
        },
        error: (error) => {
            console.log("ins_profile_error>>>", error)
            setIsLoading(false)
        }
    }

    const generateChildUI = () => {
        if (profile.inspectionTypeId == INSPECTION_TYPE[0].id) {
            return <HomePestInfo
                item={{
                    name:'Home'
                }}
                onSubmit={''}
                isCheckHomeTypeData={''}
                page={0}
            />
        }
        else if (profile.inspectionTypeId == INSPECTION_TYPE[1].id) {
            return <HomePestInfo
                item={{
                    name:'Home'
                }}
                onSubmit={''}
                isCheckHomeTypeData={''}
                page={0}
            />
        }
        else if (profile.inspectionTypeId == INSPECTION_TYPE[2].id) {
            return <PoolInfo
                item={{
                    name:'Pool'
                }}
                onSubmit={''}
                page={2}
            />
        }
        else if (profile.inspectionTypeId == INSPECTION_TYPE[3].id) {
            return <RoofInfo
                item={{
                    name:'Roof'
                }}
                onSubmit={''}
                page={3}
            />
        }
        else if (profile.inspectionTypeId == INSPECTION_TYPE[4].id) {
            return <ChimneyInfo
                item={{
                    name:'Chimney'
                }}
                onSubmit={''}
                page={4}
            />
        }
    }

    return (
        <View style={{ flex: 1 }}>
            {generateChildUI()}
        </View>
    )
}
const styleSearch = StyleSheet.create({
    btnNext: {
        backgroundColor: '#28558E',
        paddingHorizontal: SW * 0.051,
        paddingVertical: SH * 0.013,
        borderRadius: 5,
        marginTop: SH * 0.081,
    },
});
export default Booking;