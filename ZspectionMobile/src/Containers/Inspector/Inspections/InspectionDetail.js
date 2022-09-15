import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, SectionList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/style.js';
import { CheckBox, Avatar, SearchBar, Input, Icon, Rating } from 'react-native-elements';
import Loader from '../../../Components/Loader';
import Schedule from '../../../Components/Schedule';
import Common from '../../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { API } from "../../../network/API";

let refinedArray = [];
export default class InspectionDetail extends Component {
    constructor(props) {
        super(props)
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
            date: this.props.navigation.state.params.Inspection.date
        }
        this.common = new Common();
    }

    async componentDidMount() {
        this.getData()
        console.log("Date found here : ", this.state.date);
    }

    async getData() {
        refinedArray = [];
        this.setState({ data: [], originalData: [] })
        var authToken = await AsyncStorage.getItem("authToken");
        let agentID = await AsyncStorage.getItem('reAgentID')
        let companyID = await AsyncStorage.getItem("companyId");
        let inspectorID = await AsyncStorage.getItem("inspectorID");
        let data = {};
        data["fetchDate"] = this.state.date;
        data["inspectorID"] = 0;
        data["companyID"] = companyID;
        data["searchString"] = this.state.searchValue;
        try {
            this.setState({ loading: true })
            console.log("search_dat >>", data)
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
            console.log("dsakdbskadsabsa",response)
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
        return <Schedule review={false} item={item} callBackHandler={() => { this.getData() }} />;
    }

    header = () => {
        return (
            <View style={[style.row, { marginTop: 20 }]}>
                <Input placeholder='Search via company, inspector name, address'
                    onChangeText={text => this.setState({ searchValue: text })}
                    inputStyle={{ fontSize: 13 }}
                    containerStyle={{ width: '86%', paddingLeft: 7 }}
                    inputContainerStyle={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 2, paddingHorizontal: 6, marginVertical: 2 }}
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
                        size={15}
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

    render() {
        if (this.state.refreshing || this.state.loading) return <Loader />
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
                style={{ flex: 1 }}
            >
                <View style={style.container}>
                    <SectionList
                        sections={this.state.data}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.header}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={{ backgroundColor: '#C0C0C0', paddingLeft: 5 }}>{title}</Text>
                        )}
                    />
                </View>
            </ScrollView>
        );
    }
}