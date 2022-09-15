import React, { useEffect, useState } from 'react';
import {
    View,
    FlatList, Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import Loader from '../../../Components/Loader';
import { API } from "../../../network/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import colors from '../../../utils/colors.js';
import { deviceHeight, deviceWidth } from '../../../constants/Constants.js';
import { showToastMsg } from '../../../utils/utils.js';
import EmptyUI from '../../../Components/EmptyUI.js';
import Toolbar from '../../../Components/Toolbar/index.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Modal from "react-native-modal";
import { ActivityIndicator } from 'react-native';

let selectIndex = -1
let selectEndIndex = -1
let dateTimeFormate = "YYYY-MM-DD HH:mm:ss"
let selectFromEndIndex = 0
let inspectorID = 0

let DATE_TIME_PICKER = 0
const InspectorAvailability = ({ navigation }) => {
    const [availability, setAvailability] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    //const [selectIndex,setSelectIndex] = useState(0)
    const [timePickerModal, setTimePickerModal] = useState(false)
    const [leaveModal, setLeaveModal] = useState(false)
    const [leaveDTModal, setLeaveDTModal] = useState(false)
    const [selectFromDate, setSelectFromDate] = useState('');
    const [selectEndDate, setSelectEndDate] = useState('');
    const [selectFromTime, setSelectFromTime] = useState('');
    const [selectEndTime, setSelectEndTime] = useState('');
    const [dummyDate, setDummyDate] = useState('');

    const [leaveLoading, setLeaveLoading] = useState(false);

    useEffect(() => {
        fetchAvailability()
    }, [])

    const fetchAvailability = async () => {
        setIsLoading(true)
        inspectorID = await AsyncStorage.getItem('inspectorID');
        API.fetchInspectorAvailability(availabilityRes, inspectorID)
    }

    const availabilityRes = {
        success: (response) => {
            let availblity = []
            for (let index = 0; index < response.data.length; index++) {
                const element = response.data[index];
                let data = element
                let startM = moment().format('YYYY-MM-DD')
                let endM = moment().format('YYYY-MM-DD')
                data['startTime'] = moment(startM + ' ' + element.startTime).format(dateTimeFormate)
                data['endTime'] = moment(endM + ' ' + element.endTime).format(dateTimeFormate)
                data['isChecked'] = element.available
                availblity.push(data)
            }
            setAvailability(availblity)
            setIsLoading(false)
        },
        error: (error) => {
            setAvailability([])
            setIsLoading(false)
        }
    }

    const renderAvailabilityTitle = (item) => {
        let title = ''
        if (item == 1) {
            title = "Sunday"
        } else if (item == 2) {
            title = "Monday"
        } else if (item == 3) {
            title = "Tuesday"
        } else if (item == 4) {
            title = "Wednesday"
        } else if (item == 5) {
            title = "Thursday"
        } else if (item == 6) {
            title = "Friday"
        } else if (item == 7) {
            title = "Saturday"
        }
        return <Text style={{
            color: colors.txtColor, fontSize: 15,
            marginLeft: 10
        }}>{title}</Text>
    }

    const onTImeStart = (item, index) => {
        setTimePickerModal(false)
        selectIndex = index
        selectEndIndex = -1
        setTimeout(() => {
            setTimePickerModal(true)
        }, 1000)
    }


    const onTImeEnd = (item, index) => {
        setTimePickerModal(false)
        selectEndIndex = index
        selectIndex = -1
        setTimeout(() => {
            setTimePickerModal(true)
        }, 1000)
    }

    const onCheckPress = (item, index) => {
        let update = [...availability]
        update[index].isChecked = !update[index].isChecked
        setAvailability(update)
    }

    const renderAvaItem = ({ item, index }) => {
        let startTimeFor = item.startTime ? moment(item.startTime, dateTimeFormate).format('LT') : 'Select Time'
        let endTimeFor = item.endTime ? moment(item.endTime, dateTimeFormate).format('LT') : 'Select Time'
        return (
            <View style={{ width: '95%', marginBottom: 10, marginVertical: 10, alignSelf: 'center' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity style={{ flex: 0.4, flexDirection: 'row', alignItems: 'center', alignContent: 'center', }}
                        onPress={() => {
                            onCheckPress(item, index)
                        }}>
                        <MaterialCommunityIcons
                            name={item.isChecked ? 'checkbox-marked' : 'checkbox-blank-outline'} size={25} color={colors.softBlue}
                        />
                        {renderAvailabilityTitle(item.daynumber)}
                    </TouchableOpacity>

                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity style={styles.time_txt_view}
                            onPress={() => onTImeStart(item, index)}
                            disabled={!item.isChecked}
                        >
                            <AntDesign
                                name='clockcircleo' size={17}
                                color={item.isChecked ? colors.txtColor : colors.lightGraySec}
                            />
                            <Text style={[styles.time_txt, {
                                color: item.isChecked ? colors.txtColor : colors.lightGraySec
                            }]}>{startTimeFor}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.time_txt_view}
                            onPress={() => onTImeEnd(item, index)}
                            disabled={!item.isChecked}
                        >
                            <AntDesign
                                name='clockcircleo' size={17}
                                color={item.isChecked ? colors.txtColor : colors.lightGraySec}
                            />
                            <Text style={[styles.time_txt, {
                                color: item.isChecked ? colors.txtColor : colors.lightGraySec
                            }]}>{endTimeFor}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    const hideDatePicker = () => {
        setTimePickerModal(false);
    };

    const handleConfirm = (date) => {
        let update = [...availability]
        if (selectIndex != -1) {
            update[selectIndex].startTime = moment(date).format(dateTimeFormate)
            update[selectIndex].endTime = ''
        } else if (selectEndIndex != -1) {
            let startT = moment(update[selectEndIndex].startTime)
            let endT = moment(date)
            if (startT.isBefore(endT)) {
                update[selectEndIndex].endTime = moment(date).format(dateTimeFormate)
            } else {
                showToastMsg("Please select end time before start time")
            }
        }
        setAvailability(update)
    };

    const handleDTConfirm = (date) => {
        console.log("opoppoo >>", selectFromEndIndex)
        if (DATE_TIME_PICKER == 1) {
            setSelectFromDate(date)
            let dateN = moment(date).add(1, 'days')
            console.log("dsadsadasj >", moment(dateN).format('DD.MM.YYYY'))
            setDummyDate(moment(dateN).toDate())
            setSelectFromTime('')
            setSelectEndDate('')
            setSelectEndTime('')
        }
        else if (DATE_TIME_PICKER == 2) {
            if (moment(date).isAfter(moment(new Date()))) {
                console.log("is_after")
                setSelectFromTime(date)
                setSelectEndDate('')
                setSelectEndTime('')
            } else {
                setSelectFromTime('')
                setSelectEndDate('')
                setSelectEndTime('')
                showToastMsg("Please select time before current time")
            }
        }
        else if (DATE_TIME_PICKER == 3) {
            setSelectEndDate(date)
        }
        else if (DATE_TIME_PICKER == 4) {
            setSelectEndTime(date)
        }
        // if (selectFromEndIndex == 0) {
        //     setSelectFromDateTime(moment(date).format(dateTimeFormate))
        // } else if (selectFromEndIndex == 1) {
        //     setSelectEndDateTime(moment(date).format(dateTimeFormate))
        // }
        setLeaveDTModal(false)
    }

    const hideDateTimePicker = () => {
        setLeaveDTModal(false);
    };


    const updateAvailability = () => {
        let availabilityList = []
        for (let index = 0; index < availability.length; index++) {
            const element = availability[index];
            let newElement = {
                "ihourId": element.ihourId,
                "available": element.isChecked,
                "startTime": moment(element.startTime, dateTimeFormate).format('HH:mm:ss'),
                "endTime": moment(element.endTime, dateTimeFormate).format("HH:mm:ss")
            }
            availabilityList.push(newElement)
        }
        let updateIns = {
            "inspectorHours": availabilityList
        }
        console.log("availabilityList__availabilityList ", availabilityList)
        API.updateInspectorAvailability(updateInspectorAvailabilityRes, JSON.stringify(updateIns))
    }

    const updateInspectorAvailabilityRes = {
        success: (response) => {
            showToastMsg(response.message)
            fetchAvailability()
        },
        error: (error) => {
            showToastMsg(error.message)
        }
    }

    const leaveClick = () => {
        setLeaveModal(true)
    }

    const leaveApply = () => {
        if (selectFromDate.length == 0) {
            showToastMsg("Please select from date")
        }
        else if (selectFromTime.length == 0) {
            showToastMsg("Please select from time")
        }
        else if (selectEndDate.length == 0) {
            showToastMsg("Please select end date")
        }
        else if (selectEndTime.length == 0) {
            showToastMsg("Please select end time")
        }
        // else if (!moment(selectFromDateTime).isBefore(selectEndDateTime)) {
        //     showToastMsg("Please select end date after from date")
        // } else if (selectEndDateTime.length == 0) {
        //     showToastMsg("Please select end date")
        // }
        else {
            setLeaveLoading(true)
            let data = {
                "inspectorId": inspectorID,
                "startDate": moment(selectFromDate).format('YYYY-MM-DD') + ' ' + moment(selectFromTime).format('hh:mm a'),
                "endDate": moment(selectEndDate).format('YYYY-MM-DD') + ' ' + moment(selectEndTime).format('hh:mm a'),
                "bookingStatus": 0
            }
            console.log("end_date_time _obj", data)
            API.leaveApplyInspector(leaveApplyInspectorRes, JSON.stringify(data))
        }
    }
    const leaveApplyInspectorRes = {
        success: (response) => {
            console.log("leave_sucess  ", response)
            setLeaveLoading(false)
            showToastMsg(response.message)
            setLeaveModal(false)
        },
        error: (error) => {
            console.log("leave_error  ", error)
            setLeaveLoading(false)
            showToastMsg(error.message)
            setLeaveModal(false)
        }
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.lightWhite }}>
            <Toolbar
                innerScreen={false}
                title='Availability'
                onCallbackPress={() => navigation.toggleDrawer()}
            />
            <View style={{ flex: 1 }}>
                <View style={{ width: '95%', flexDirection: 'row', height: 50, alignSelf: 'center' }}>
                    <View style={{ flex: 0.4, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: colors.black, fontWeight: '900', fontSize: 15 }}>DAYS</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: colors.black, fontWeight: '900', fontSize: 15 }}>FROM</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: colors.black, fontWeight: '900', fontSize: 15 }}>TO</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, }}>
                    {isLoading ? <Loader /> :
                        availability.length > 0 ?
                            <FlatList
                                data={availability}
                                keyExtractor={(item, index) => `${index}`}
                                renderItem={renderAvaItem}
                            /> : <EmptyUI />
                    }
                </View>

                {isLoading ? null :
                    <View style={{
                        width: '100%', flexDirection: 'row', justifyContent: 'center', alignContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor: colors.toolbar_bg_color, alignSelf: 'center',
                            width: 120, borderRadius: 10, height: 45, justifyContent: 'center', alignItems: 'center', alignContent: 'center', marginBottom: 15
                        }}
                            onPress={() => updateAvailability()}
                        >
                            <Text style={{ color: colors.white, fontSize: 16, textTransform: 'uppercase' }}>update</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={{
                            alignSelf: 'center',
                            width: 120, borderRadius: 10, height: 45, justifyContent: 'center',
                            alignItems: 'center', alignContent: 'center', marginBottom: 15, marginLeft: 20,
                            borderColor: colors.red, borderWidth: 1
                        }}
                            onPress={() => leaveClick()}
                        >
                            <Text style={{ color: colors.red, fontSize: 16, textTransform: 'uppercase', }}>Leave</Text>
                        </TouchableOpacity>

                    </View>
                }

            </View>
            <DateTimePickerModal
                isVisible={timePickerModal}
                mode="time"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />

            <DateTimePickerModal
                isVisible={leaveDTModal}
                display='spinner'
                mode={DATE_TIME_PICKER == 1 || DATE_TIME_PICKER == 3 ? 'date' : 'time'}
                onConfirm={handleDTConfirm}
                onCancel={hideDateTimePicker}
                minimumDate={selectFromDate ? dummyDate : new Date()}
            />

            <Modal
                testID={'modal'}
                isVisible={leaveModal}
                onBackButtonPress={() => {
                    setLeaveModal(false)
                }}
                onBackdropPress={() => {
                    setLeaveModal(false)
                }}
                style={styles.modal_view}>
                <View style={{
                    width: deviceWidth, height: deviceHeight * 0.5,
                    backgroundColor: colors.white
                }}>
                    <View style={{
                        width: deviceWidth, height: 60,
                        alignSelf: 'center', flexDirection: 'row',
                        justifyContent: 'center', alignContent: 'center', alignItems: 'center',
                        paddingHorizontal: 15
                    }}>
                        <Text style={{ color: colors.loginBlue, fontSize: 17, fontWeight: 'bold', flex: 1 }}>Select leave date and time</Text>
                        <TouchableOpacity
                            onPress={() => setLeaveModal(false)}
                        >
                            <MaterialCommunityIcons name='close-circle-outline'
                                color={colors.loginBlue} size={25} />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 10 }}>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    DATE_TIME_PICKER = 1
                                    setLeaveDTModal(true)
                                }}
                            >
                                <Text style={styles.from_to_time_heading}>From Date</Text>
                                <Text style={styles.from_to_time_value}>{selectFromDate ? moment(selectFromDate).format('YYYY-MM-DD') : 'Select From date'} </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginLeft: 15 }}
                                onPress={() => {
                                    DATE_TIME_PICKER = 2
                                    setLeaveDTModal(true)
                                }}
                            >
                                <Text style={styles.from_to_time_heading}>From Time</Text>
                                <Text style={styles.from_to_time_value}>{selectFromTime ? moment(selectFromTime).format('hh:mm a') : 'Select From time'} </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.time_divider} />

                        <View style={{ marginTop: 15 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    DATE_TIME_PICKER = 3
                                    setLeaveDTModal(true)
                                }}
                            >
                                <Text style={styles.from_to_time_heading}>End Date</Text>
                                <Text style={styles.from_to_time_value}>{selectEndDate ? moment(selectEndDate).format('YYYY-MM-DD') : 'Select To date'} </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={{ marginLeft: 15 }}
                                onPress={() => {
                                    DATE_TIME_PICKER = 4
                                    setLeaveDTModal(true)
                                }}
                            >
                                <Text style={styles.from_to_time_heading}>End Time</Text>
                                <Text style={styles.from_to_time_value}>{selectEndTime ? moment(selectEndTime).format('hh:mm a') : 'Select To time'} </Text>
                            </TouchableOpacity>
                        </View>


                        <View style={styles.time_divider} />

                        {leaveLoading ? <ActivityIndicator color={colors.loginBlue} size='large' style={{ marginTop: 15 }} /> :
                            <TouchableOpacity style={{
                                backgroundColor: colors.toolbar_bg_color, alignSelf: 'center',
                                width: 120, borderRadius: 10, height: 45, justifyContent: 'center',
                                alignItems: 'center', alignContent: 'center', marginTop: 35
                            }}
                                onPress={() => leaveApply()}
                            >
                                <Text style={{
                                    color: colors.white, fontSize: 16,
                                    textTransform: 'uppercase'
                                }}>leave</Text>
                            </TouchableOpacity>
                        }

                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    time_txt: {
        color: colors.txtColor, fontSize: 16, fontWeight: '800', marginHorizontal: 5
    },
    time_txt_view: {
        flex: 1, flexDirection: 'row', justifyContent: 'center',
        alignContent: 'center', alignItems: 'center'
    },
    modal_view: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    from_to_time_heading: {
        color: colors.softBlue, fontSize: 16, fontWeight: '500'
    },
    from_to_time_value: {
        color: colors.txtColor, fontSize: 16, marginTop: 3
    },
    time_divider: {
        width: '100%', height: 0.5, backgroundColor: colors.lightGraySec, marginTop: 8
    }
})
export default InspectorAvailability
