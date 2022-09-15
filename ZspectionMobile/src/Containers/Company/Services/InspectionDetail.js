import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, BackHandler, SectionList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/style.js';
import { CheckBox, Avatar, SearchBar, Input, Icon, Rating } from 'react-native-elements';
import Loader from '../../../Components/Loader';
import Schedule from '../../../Components/Schedule';
import Common from '../../../Containers/Common';
import AntDesign from 'react-native-vector-icons/AntDesign'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exampleArray } from './demoArray.js';
import moment from 'moment';
import { API } from "../../../network/API";
import InspectionCell from '../../../Components/InspectionCell/index.js';
import Modal from 'react-native-modal'
import colors from '../../../utils/colors.js';
import { deviceHeight, deviceWidth } from '../../../constants/Constants.js';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { showToastMsg } from '../../../utils.js';
import EmptyUI from '../../../Components/EmptyUI.js';

let refinedArray = [];

class InspectionDetail extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            loading: false,
            error: null,
            value: ' ',
            data: [],
            originalData: [],
            searchValue: '',
            searchTerm: "",
            searchAttribute: "",
            ignoreCase: true,
            showSearchField: false,
            date: this.props.navigation.state.params.Inspection.date,
            isActionModal: false,
            showDateTimePicker: false,
            rescheduleDateTime: '',
            selectInspection: '',
            inspectorID: this.props.navigation.state.params.Inspection.inspectorID ? this.props.navigation.state.params.Inspection.inspectorID : 0
        }
        this.common = new Common();
    }

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.getData()
        console.log("Date found here : ", this.state.date);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    async getData() {
        refinedArray = [];
        this.setState({ data: [], originalData: [] })
        var authToken = await AsyncStorage.getItem("authToken");
        let agentID = await AsyncStorage.getItem('reAgentID')
        let companyID = await AsyncStorage.getItem("companyId");
        let data = {};
        data["fetchDate"] = this.state.date;
        data["inspectorID"] = this.state.inspectorID;
        data["companyID"] = companyID;
        data["searchString"] = this.state.searchValue;
        try {
            this.setState({ loading: true })
            API.fetchDayWiseBookingDetails(this.dayWisebookingRes, data)
            //let upcomingBookingResponse = await new API('fetchdaywisebookingdetails', data).getResponse();

            // console.log("upcoming_booking_response",upcomingBookingResponse)
            // this.setState({loading: false})
            // let values = upcomingBookingResponse.values;
            // // let values = exampleArray;
            // if(values && values.length>0){
            //         let group = values.reduce((r, a) => {
            //             console.log("RR : ",r)
            //             console.log("AA : ",a)
            //             r[moment(a.startDate,"YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY')] = [...r[moment(a.startDate,"YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY')] || [], a];
            //             return r;
            //            }, []);
            //            console.log("group", group);
            //            for (const property in group) {
            //                let objV = {};
            //                objV["title"] = property
            //                objV["data"] = group[property]
            //                refinedArray.push(objV);
            //           }
            //           this.setState({data:refinedArray,originalData:refinedArray})
            //           console.log("refinedArray",refinedArray)
            // }else{
            //     this.common.showToast(upcomingBookingResponse.message);
            // }
        } catch (e) {
            this.common.showToast("Invalid Response")
        }
    }

    dayWisebookingRes = {
        success: (response) => {
            let values = response.data;
            if (response.data.length > 0) {
                console.log("day_wsie_booking >>>", values)
                let group = values.reduce((r, a) => {
                    console.log("RR : ", r)
                    console.log("AA : ", a)
                    r[moment(a.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY')] = [...r[moment(a.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY')] || [], a];
                    return r;
                }, []);
                console.log("group", group);
                for (const property in group) {
                    let objV = {};
                    objV["title"] = property
                    objV["data"] = group[property]
                    refinedArray.push(objV);
                }
                this.setState({ data: refinedArray, originalData: refinedArray })
                console.log("refinedArray", refinedArray)
            } else {
                console.log("day_wsie_booking elseee>>>")
                // this.common.showToast(upcomingBookingResponse.message);
            }

            this.setState({ loading: false })
        },
        error: (error) => {
            console.log("day_wsie_booking_error>>>", error)
            this.setState({ loading: false })
        }
    }

    onRefresh() {
        this.getData()
    }

    manageSearch = () => {
        if (this.state.searchValue.length > 0) {
            this.setState({ searchValue: "" });
            this.getData();
        }
    }


    renderItem = ({ item, index }) => {
        return <InspectionCell
            item={item}
            onPressClick={() => this.onSwitchToInspectionDetails(item)}
            screenName="InspectionDetail"
            onActionClick={() => {
                this.clearScheduledateModal()
                this.setState({ isActionModal: true, selectInspection: item })

            }}
        />
        // return <Schedule review={false} item={item}
        //     callBackHandler={() => { this.getData() }}
        //     onPressClick={() => this.onSwitchToInspectionDetails(item)}
        // />;
    }

    /**
     * inspection details switch
     */
    onSwitchToInspectionDetails = (item) => {
        this.props.navigation.navigate('CompanyInspectorDetails', {
            inspectorData: item
        })
    }


    header = () => {
        return (
            <View style={[{ flexDirection: 'row', marginTop: 20, marginLeft: -10, marginRight: -6, marginBottom: 10 }]}>
                <Input placeholder='Search via company, inspector name, address'
                    onChangeText={text => this.setState({ searchValue: text })}
                    inputStyle={{ fontSize: 13 }}
                    containerStyle={{ width: '86%', }}
                    inputContainerStyle={{
                        borderWidth: 1, borderColor: '#ccc', borderRadius: 2,
                        paddingHorizontal: 6, marginVertical: 2
                    }}
                    rightIcon={
                        <Icon
                            size={20}
                            name={this.state.searchValue.length > 0 && 'close'}
                            color="gray"
                            onPress={() => { this.manageSearch() }}
                        />
                    }
                    value={this.state.searchValue}
                />
                <View style={{ justifyContent: 'center', alignSelf: 'center' }}>
                    <Icon
                        size={22.5}
                        name="search"
                        type="font-awesome"
                        color="grey"
                        containerStyle={[style.borderIcon]}
                        onPress={() => { this.state.searchValue.length > 0 ? this.getData() : null }}
                    />

                </View>
            </View>
        )
    }


    handleConfirm = (date) => {
        console.warn("A date has been picked: ", date);
        this.setState({
            rescheduleDateTime: moment(date).format('YYYY-MM-DD hh:mm a'),
            showDateTimePicker: false
        })
    };

    hideDatePicker = () => {
        this.setState({
            rescheduleDateTime: '',
            showDateTimePicker: false
        })
    };

    onResheduleClick = () => {
        let data = {
            "bookingDetailId": this.state.selectInspection.bookingDetailId,
            "inspectionDate": this.state.rescheduleDateTime
        }
        API.rescheduleInspection(this.rescheduleInsRes, data)
        console.log("dsadsadsabdba >>", data, this.state.selectInspection)
    }



    clearScheduledateModal = () => {
        this.setState({
            showDateTimePicker: false,
            rescheduleDateTime: '',
            selectInspection: '',
            isActionModal: false,

        })
    }

    rescheduleInsRes = {
        success: (response) => {
            console.log("rescheduleInsRes__SUce", response)
            showToastMsg(response.message)
            this.clearScheduledateModal()
            this.onRefresh()
        },
        error: (error) => {
            console.log("rescheduleInsRes__error", error)
            showToastMsg(error.message)
        }
    }

    render() {
        if (this.state.refreshing || this.state.loading) return <Loader />
        return (
            <View
                style={{ flex: 1 }}
            >
                <View style={style.container}>
                    <SectionList
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                        sections={this.state.data}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.header}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={{ backgroundColor: '#C0C0C0', paddingLeft: 5 }}>{title}</Text>
                        )}
                        ListEmptyComponent={() => {
                            return (
                                <EmptyUI str='No Inspection Details found' />
                            )
                        }}
                    />
                </View>

                <Modal
                    testID={'modal'}
                    isVisible={this.state.isActionModal}
                    onBackButtonPress={() => {
                        this.setState({ isActionModal: false })
                        this.clearScheduledateModal()
                    }}
                    onBackdropPress={() => {
                        this.setState({ isActionModal: false })
                        this.clearScheduledateModal()
                    }}
                    style={mainStyle.main_container}>
                    <View style={{
                        width: deviceWidth, height: deviceHeight * 0.30,
                        backgroundColor: colors.white
                    }}>
                        <View style={{ flex: 1, width: deviceWidth * 0.9, alignSelf: 'center' }}>
                            <View style={{ width: '100%', height: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{
                                    color: colors.toolbar_bg_color,
                                    fontWeight: 'bold', textTransform: 'uppercase', flex: 1
                                }}>Reschedule</Text>
                                <TouchableOpacity
                                    onPress={() => this.setState({ isActionModal: false })}
                                >
                                    <AntDesign name='closecircle' color={colors.toolbar_bg_color} size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ color: colors.txtColor, fontSize: 14 }}>Select date and time to reschedule your inspection</Text>
                                <TouchableOpacity style={{
                                    borderColor: colors.toolbar_bg_color, borderWidth: 0.5, alignSelf: 'center', borderRadius: 2,
                                    paddingHorizontal: 10, paddingVertical: 10, marginVertical: 15
                                }}
                                    onPress={() => {
                                        this.setState({
                                            showDateTimePicker: true
                                        })
                                    }}
                                >
                                    <Text style={{ color: colors.txtColor, fontSize: 12, textTransform: 'uppercase' }}>{this.state.rescheduleDateTime ? this.state.rescheduleDateTime : 'Select Date and Time'}</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    backgroundColor: this.state.rescheduleDateTime.length > 0 ? colors.toolbar_bg_color : colors.gray,
                                    paddingHorizontal: 5,
                                    paddingVertical: 10, justifyContent: 'center', alignItems: 'center',
                                    borderRadius: 10, width: 150, alignSelf: 'center', marginVertical: 2
                                }}
                                    onPress={() => {
                                        this.onResheduleClick()
                                    }}
                                    disabled={this.state.rescheduleDateTime.length > 0 ? false : true}
                                >
                                    <Text style={{ color: colors.white, fontSize: 12, textTransform: 'uppercase' }}>Reschedule</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>
                <DateTimePickerModal
                    isVisible={this.state.showDateTimePicker}
                    mode="datetime"
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                    minimumDate={new Date()}
                >

                </DateTimePickerModal>
            </View>
        );
    }
}
const mainStyle = StyleSheet.create({
    main_container: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    child_container: {
        flex: 1, marginHorizontal: 8
    },
    value_txt_style: {
        color: '#28558E', fontWeight: 'bold', fontSize: 14
    }
})

export default InspectionDetail
