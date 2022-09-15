import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    Text,
    TouchableOpacity,
    StyleSheet, Alert, Platform, Linking, BackHandler
} from 'react-native';
import Loader from '../../../../Components/Loader';
import { API } from "../../../../network/API";

import moment from 'moment';
import colors from '../../../../utils/colors.js';
import { deviceWidth } from '../../../../constants/Constants.js';
import { convertInspectorBookingStatusToStr, INSPECTION_TYPE, INSPECTOR_BOOKING_STATUS, showToastMsg } from '../../../../utils/utils.js';
import EmptyUI from '../../../../Components/EmptyUI';
import Toolbar from '../../../../Components/Toolbar';

let bookingChimneyStatus = undefined


const REAInspectorDetails = ({ navigation }) => {
    const [bookLoading, setBookLoading] = useState(false)
    const [bookInfo, setBookInfo] = useState(undefined)

    // on back press
    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        fetchBookingInfo()
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    const fetchBookingInfo = async () => {
        setBookLoading(true)
        API.fetchInspectorDetailsById(inspectorBookRes, navigation.state.params.inspectorData.bookingDetailId)
    }

    const inspectorBookRes = {
        success: (response) => {
            console.log("bookingres >>>", response)
            setBookInfo(response.data)
            bookingChimneyStatus = INSPECTION_TYPE.find((data) => data.id == data.inspectionTypeId)
            setBookLoading(false)
        },
        error: (error) => {
            console.log("ins_error>>>", error)
            setBookLoading(false)
        }
    }

    const reejctBooking = () => {
        Alert.alert('Decline', 'Are you sure want to decline this booking?', [{
            text: 'Yes',
            onPress: () => {
                onDeclineBooking()
            }
        }, {
            text: 'No',
            onPress: () => {

            }
        }])
    }

    const onDeclineBooking = () => {
        API.rejectBookingByInspector(rejectBookingRes, bookInfo.bookingDetailId)
    }

    const rejectBookingRes = {
        success: (response) => {
            console.log("booking_update", response)
            showToastMsg(response.message)
            fetchBookingInfo()
        },
        error: (error) => {
            console.log("booking_update_errr", error)
            showToastMsg(error.message)
        }
    }

    const acceptBooking = () => {
        API.acceptBookingByInspector(acceptBookingRes, bookInfo.bookingDetailId)
    }

    const acceptBookingRes = {
        success: (response) => {
            console.log("booking_update", response)
            showToastMsg(response.message)
            fetchBookingInfo()
        },
        error: (error) => {
            console.log("booking_update_errr", error)
            showToastMsg(error.message)
        }
    }


    const openPhoneDiler = (phone) => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    }

    const openEmail = (email) => {
        Linking.openURL(`mailto:${email}`)
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            {bookLoading ? <Loader /> :
                bookInfo ?
                    <ScrollView>
                        <View style={{ flex: 1 }}>
                            <Toolbar
                                innerScreen
                                title={"Inspector Details"}
                                onCallbackPress={() => navigation.goBack()}
                            />


                            <View style={{ paddingHorizontal: 15 }}>
                                <Text style={styles.heading_title_txt}>Inspection Info</Text>

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>status</Text>
                                    <Text style={[styles.value_child_txt, {
                                        color: bookInfo.bookingStatus == INSPECTOR_BOOKING_STATUS.PENDING ? colors.toolbar_bg_color :
                                            bookInfo.bookingStatus == INSPECTOR_BOOKING_STATUS.COMPLETED ? colors.txtColor : colors.lightGray,
                                    }]}>{convertInspectorBookingStatusToStr(bookInfo?.bookingStatus)}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>Name</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo?.inspectorName}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <TouchableOpacity style={styles.child_main_view}
                                    onPress={() => openEmail(bookInfo?.inspectorEmail)}
                                >
                                    <Text style={styles.value_child_txt_heading}>Email</Text>
                                    <Text style={[styles.value_child_txt, { color: colors.loginBlue, textDecorationLine: 'underline' }]}>{bookInfo?.inspectorEmail}</Text>
                                </TouchableOpacity>

                                <View style={styles.divider_view} />

                                <TouchableOpacity style={styles.child_main_view}
                                    onPress={() => openPhoneDiler(bookInfo?.inspectorPhone)}
                                >
                                    <Text style={styles.value_child_txt_heading}>Mobile</Text>
                                    <Text style={[styles.value_child_txt, { color: colors.loginBlue, textDecorationLine: 'underline' }]}>{bookInfo?.inspectorPhone}</Text>
                                </TouchableOpacity>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>Type</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo?.inspectionTypeName}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>Date</Text>
                                    <Text style={styles.value_child_txt}>{moment(bookInfo?.startDate).format('MM-DD-YYYY hh:mm a')}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>price</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo?.price.toString()}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                {INSPECTION_TYPE[0].id == bookInfo.inspectionTypeId ||
                                    INSPECTION_TYPE[1].id == bookInfo.inspectionTypeId ||
                                    INSPECTION_TYPE[3].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>Square/Footage</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.areaRange}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }

                                {INSPECTION_TYPE[0].id == bookInfo.inspectionTypeId ||
                                    INSPECTION_TYPE[1].id == bookInfo.inspectionTypeId ||
                                    INSPECTION_TYPE[3].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>Property</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.propertyTypeName}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }

                                {INSPECTION_TYPE[0].id == bookInfo.inspectionTypeId ||
                                    INSPECTION_TYPE[1].id == bookInfo.inspectionTypeId
                                    ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>Foundation</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.foundationTypeName}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View> : null

                                }

                                {INSPECTION_TYPE[2].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>No. Of pool</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.noOfPool ? bookInfo.noOfPool : 0}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }

                                {INSPECTION_TYPE[4].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>Chimney</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.chimneyTypeName ? bookInfo.chimneyTypeName : 'N/A'}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }

                                {INSPECTION_TYPE[4].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>No. Of chimney</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.noOfChimney ? bookInfo.noOfChimney : 0}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }


                                {INSPECTION_TYPE[3].id == bookInfo.inspectionTypeId ?
                                    <View>
                                        <View style={styles.child_main_view}>
                                            <Text style={styles.value_child_txt_heading}>No. Of stories</Text>
                                            <Text style={styles.value_child_txt}>{bookInfo.noOfStories ? bookInfo.noOfStories : 0}</Text>
                                        </View>
                                        <View style={styles.divider_view} />
                                    </View>
                                    : null
                                }
                            </View>

                            <View style={{ width: deviceWidth, height: 1, backgroundColor: colors.gray, marginTop: 15 }} />

                            <View style={{ paddingHorizontal: 15 }}>
                                <Text style={styles.heading_title_txt}>Inspection Location</Text>

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>Address</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo?.address}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>city</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo?.city}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                <View style={styles.child_main_view}>
                                    <Text style={styles.value_child_txt_heading}>state</Text>
                                    <Text style={styles.value_child_txt}>{bookInfo.state}</Text>
                                </View>

                                <View style={styles.divider_view} />

                                {bookInfo.areaRange != null ?
                                    <View style={styles.child_main_view}>
                                        <Text style={styles.value_child_txt_heading}>zipCode</Text>
                                        <Text style={styles.value_child_txt}>{bookInfo.zipCode}</Text>
                                    </View> : null
                                }


                            </View>

                            {/* {bookInfo.bookingStatus == INSPECTOR_BOOKING_STATUS.PENDING ?
                                <View style={{
                                    height: 40, flexDirection: 'row', alignSelf: 'center',
                                    alignContent: 'center', alignItems: 'center',
                                    borderColor: colors.toolbar_bg_color, borderWidth: 0.5, borderRadius: 10,
                                    marginHorizontal: 15, marginVertical: 25, marginBottom: 50
                                }}>

                                    <View style={{ flex: 1.8, flexDirection: 'row' }}>
                                        <TouchableOpacity style={styles.action_touch}
                                            onPress={() => acceptBooking()}
                                        >
                                            <Text style={styles.action_txt}>Accept</Text>
                                        </TouchableOpacity>

                                        <View style={{ width: 0.8, height: 32, backgroundColor: colors.gray }} />
                                        <TouchableOpacity style={[styles.action_touch,]}
                                            onPress={() => reejctBooking()}
                                        >
                                            <Text style={[styles.action_txt, { color: colors.red }]}>Decline</Text>
                                        </TouchableOpacity>
                                        <View style={{ width: 0.8, height: 32, backgroundColor: colors.gray }} />
                                    </View>
                                </View>
                                : null
                            } */}


                        </View>
                    </ScrollView> : <EmptyUI />
            }

        </View>
    )
}

const styles = StyleSheet.create({
    heading_title_txt: {
        color: colors.toolbar_bg_color, fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', marginVertical: 15
    },
    child_main_view: {
        flexDirection: 'row', width: '95%', alignSelf: 'center', alignContent: 'center', alignItems: 'center'
    },
    value_child_txt_heading: {
        color: colors.txtColor, fontSize: 12, textTransform: 'uppercase', fontWeight: '900', flex: 0.4,
    },
    value_child_txt: {
        color: colors.txtColor, fontSize: 12, textTransform: 'uppercase', textAlign: 'right', flex: 1,
    },
    divider_view: {
        width: '95%', height: 0.8, backgroundColor: 'red', marginVertical: 8, alignSelf: 'center'
    },
    chile_value_main_view: {
        flexDirection: 'row', flex: 1, marginBottom: 8, justifyContent: 'center', alignContent: 'center', alignItems: 'center'
    },
    chile_value_txt_heading: {
        color: colors.black, fontSize: 12, fontWeight: '700', flex: 0.55
    },
    child_value_value_txt: {
        color: colors.black, fontSize: 13, flex: 1,
    },
    action_touch: {
        flex: 1,
        justifyContent: 'center', alignContent: 'center', alignItems: 'center'
    },
    action_txt: {
        color: colors.toolbar_bg_color, fontWeight: '700', textTransform: 'uppercase', fontSize: 12,
    },
})

export default REAInspectorDetails
