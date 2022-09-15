import React, { Component } from 'react';
import { Animated, NativeModules, Text, processColor, LayoutAnimation, UIManager, BackHandler, Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { Avatar, Icon, Overlay, Rating, CheckBox, Card, Button } from 'react-native-elements';
import Common from '../../Common';
import Errors from '../../../Components/Errors';
import Loader from '../../../Components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
import { API } from "../../../network/API";
import { COMPANY_ROLE, INSPECTOR_ROLE, REAL_AGENT_ROLE, ROLE_ID, showToastMsg } from '../../../utils.js';
import { INSPECTION_TYPE } from '../../../utils/utils.js';
import Constants from '../../../constants/Constants.js';

let roleID = 0
export default class SearchSummary extends Component {
    constructor(props) {
        super(props)
        this.state = {
            date: '',
            time: '',
            address: '',
            inspectionList: [],
            inspectiontype: [],
            inspectionMarked: [],
            errors: [],
            success: false,
            response: [],
            loading: false,
        }
        this.common = new Common();

        this.animatedValue = new Animated.Value(0);
        if (Platform.OS === 'android') {
            UIManager.setLayoutAnimationEnabledExperimental(true);
        }

        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    handleBackButtonClick() {
        this.props.navigation.goBack();
        return true;
    }

    async getData() {
        var request = this.props.navigation.getParam('request');
        console.log("Previous screen data in SearchSummary : ", request)
        roleID = await AsyncStorage.getItem("role");
        this.setState({
            address: request.address,
            date: request.date,
            time: request.time,
            inspectionList: request.inspectionList,
        })

        console.log('role_idd >', roleID)
    }
    componentDidMount() {
        Animated.timing(
            this.animatedValue,
            {
                toValue: 0.5,
                duration: 500,
                useNativeDriver: true
            }
        ).start(() => {
            this.getData();
        });
    }

    removeRow = (id) => {
        console.log("Removing item id : ", id);
        var filteredAry = this.state.inspectionMarked.filter((item) => {
            return item.inspectionTypeId !== id
        })
        if (filteredAry.length < 1) {
            console.log("id:", id, filteredAry, this.state.inspectionMarked)
            this.common.showToast("You cannot remove all Inspections", this.state.inspectionMarked)
            return false;
        }
        this.setState(() => {
            return {
                inspectionMarked: filteredAry
            }
        }, () => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        });
    }

    Row = (item) => {
        return (
            <View key={item.inspectionTypeID}>
                <Text style={[styles.heading2, styles.capitalize, styles.container]}>{this.common.getInspectionName(item.inspectionTypeId, this.state.inspectionList)} Inspection</Text>
                <View style={[styles.summarySelectedIspector, { marginBottom: 15 }]}>
                    <View style={[styles.center, { width: 80 }]}>
                        <Avatar
                            rounded
                            source={{
                                uri: "http://" + item.profilePic,
                            }}
                            size="large"
                        />
                        <Text style={[styles.nameTxt, { textAlign: 'center', marginBottom: 6, textDecorationLine: 'underline' }]}>{item.inspectorName}</Text>
                        <Rating
                            ratingCount={5}
                            imageSize={14}
                            readonly
                            startingValue={parseInt(4)}
                        />
                    </View>
                    <View style={styles.flatListItemTextRow}>
                        <Text style={styles.nameTxt}>{item.companyName}</Text>
                        <Text style={styles.nameTxt2}>{item.companyBio}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <View style={styles.center}>
                            {/* <Text style={styles.nameTxt}>$ {item.Price}</Text> */}
                            <Text style={styles.nameTxt}>$ {item.price}</Text>
                        </View>
                        {/* <View style={[styles.center]}>
                            <Icon type="font-awesome" size={28} name='trash-o' onPress={() => this.removeRow(item.inspectionTypeId)} />
                        </View> */}
                    </View>
                </View>
            </View>
        )
    }

    closeModel = async (nhdFlag) => {
        this.setState({ success: false })
        // var authToken = await AsyncStorage.getItem("authToken");
        // var inspectionid = this.state.response.result.InspectionId;
        // var header = {"authentication":authToken};
        // var data = {"inspectionid":inspectionid,flag:nhdFlag};
        // var response = new API('NHDFlagUpdate',data,header).getResponse()        
        // this.props.navigation.navigate('Search',{'success':inspectionid})
        if (roleID == REAL_AGENT_ROLE) {
            console.log("role_dssadbas_dsadad>> iff ", roleID)
            this.props.navigation.navigate("RealEstateInspection");
        }
        else if (roleID == COMPANY_ROLE) {
            console.log("role_dssadbas_dsadad>> else ", roleID)
            this.props.navigation.navigate('Main');
        }
        else if (roleID == INSPECTOR_ROLE) {
            console.log("role_dssadbas_dsadad>> else ", roleID)
            this.props.navigation.navigate('Main');
        }
        //this.props.navigation.navigate("RealEstateInspection");

    }

    save = async () => {
        let selectedInspectors = this.state.inspectionList;
        console.log("Inspection List: ", selectedInspectors);
        this.getRequestData(selectedInspectors).then(async (data) => {
            console.log("Request data is :", data);
            try {
                this.setState({ loading: true })
                API.bookingAPi(this.bookApiRes, data)
               
            } catch (error) {
                this.setState({ loading: false })
            }

        })
    }


    bookApiRes = {
        success: async (response) => {
            console.log("booking_res>>>", response)
            showToastMsg(response.message)
            this.setState({ success: true })
            this.setState({ loading: false })
            const companyBookingInspectionTypeList = []
            const AllBookingINspectionList = []

            // if (roleID == REAL_AGENT_ROLE) {
            //     console.log("role_dssadbas_dsadad>> iff ",roleID  )
            //     this.props.navigation.navigate("RealEstateInspection");
            // }
            // else if (roleID == COMPANY_ROLE) {
            //     console.log("role_dssadbas_dsadad>> else ",roleID  )
            //     this.props.navigation.navigate('Main');
            // }

            //this.props.navigation.navigate("RealEstateInspection");
        },
        error: (error) => {
            console.log("booking_res_error>>>", error)
            showToastMsg(error.message)
            this.setState({ success: false })
            this.setState({ loading: false })
        }
    }

    getRequestData = async (inspectors) => {
        this.setState({ success: false })
        var request = this.props.navigation.getParam('request');
        let agentId = await AsyncStorage.getItem('reAgentID');
        console.log("Parsed Address is : ", await AsyncStorage.getItem("AgentRequestedAddress"));
        let addressData = await AsyncStorage.getItem("AgentRequestedAddress");
        var parseAdderss = this.common.parseAddress(JSON.parse(addressData));
        let dataObj = {};

        
        dataObj["bookingID"] = 0,
            dataObj["reAgentID"] = agentId,
            dataObj["address"] = request.address,
            dataObj["city"] = parseAdderss.city,
            dataObj["state"] = parseAdderss.state,
            dataObj["zipCode"] = parseAdderss.zipcode,
            dataObj["bookingType"] = roleID == ROLE_ID[0].id ? 3 : 1,
            dataObj["bookingLatitude"] = parseAdderss.lat,
            dataObj["bookingLongitude"] = parseAdderss.long
        dataObj["bookingDetails"] = await this.getBookingDetails(inspectors)
        return dataObj;
    }

    getBookingDetails = async (inspectors) => {
        let bookingDetails = [];
        let date = moment(this.state.date).toISOString();
        let startDate = moment(this.state.date, "MM-DD-YYYY").format("YYYY-MM-DD");
        let startDateVal = startDate + "T" + this.common.getTwentyFourHourTime(this.state.time) + ":" + "00.000Z";
        let endDate = moment(this.state.date, "MM-DD-YYYY").format("YYYY-MM-DD");
        inspectors.map((item) => {
            console.log("Inspector item  :", item)
            var tempTime = moment(this.state.time, "hh:mm:ss A")
                .add(item.duration, 'minutes')
                .format('LTS');
            let endDateVal = endDate + "T" + this.common.getTwentyFourHourTime(tempTime) + ":" + "00.000Z";
            let inspector = {};
            console.log("End date final : ", endDateVal ,startDateVal);
            inspector["inspectorID"] = item.inspectorId,
                inspector["companyID"] = item.companyId,
                inspector["startDate"] = endDateVal,
                inspector["endDate"] = endDateVal,
                inspector["InspectorPriceID"] = item.priceMatrixId,
                inspector["Price"] = item.price,
                inspector["bookingStatus"] = 1
            bookingDetails.push(inspector)
        })

        return bookingDetails
    }

    generateRow = () => {
        this.state.inspectionList.map((item, index) => {
            return this.Row(item)
        })
    }


    generateTitle = (item) => {
        let title = ''
        if (item.inspectionTypeId == INSPECTION_TYPE[0].id) {
            title = "Home"
        }
        else if (item.inspectionTypeId == INSPECTION_TYPE[1].id) {
            title = "Pest"
        }
        else if (item.inspectionTypeId == INSPECTION_TYPE[2].id) {
            title = "Pool"
        }
        else if (item.inspectionTypeId == INSPECTION_TYPE[3].id) {
            title = "Roof"

        }
        else if (item.inspectionTypeId == INSPECTION_TYPE[4].id) {
            title = "Chimney"
        }
        return title
    }

    renderCellItem = ({ item, index }) => {
        return (
            <View key={item.inspectionTypeID}>
                <Text style={[styles.heading2, styles.capitalize, styles.container]}>{this.generateTitle(item) + ' Inspection'}</Text>
                <View style={[styles.summarySelectedIspector, { marginBottom: 15 }]}>
                    <View style={[styles.center, { width: 80 }]}>
                        <Avatar
                            rounded
                            source={{
                                uri:  item.profilePic,
                            }}
                            size="large"
                        />
                        <Text style={[styles.nameTxt, { textAlign: 'center', marginBottom: 6, textDecorationLine: 'underline' }]}>{item.inspectorName}</Text>
                        <Rating
                            ratingCount={5}
                            imageSize={14}
                            readonly
                            startingValue={parseInt(4)}
                        />
                    </View>
                    <View style={styles.flatListItemTextRow}>
                        <Text style={styles.nameTxt}>{item.companyName?item.companyName:'companyName'}</Text>
                        <Text style={styles.nameTxt2}>{item.companyBio?item.companyBio:'companyBio'}</Text>
                    </View>
                    <View style={{ justifyContent: 'space-between' }}>
                        <View style={styles.center}>
                            {/* <Text style={styles.nameTxt}>$ {item.Price}</Text> */}
                            <Text style={styles.nameTxt}>$ {item.price ? item.price :'10'}</Text>
                        </View>
                        {/* <View style={[styles.center]}>
                            <Icon type="font-awesome" size={28} name='trash-o' onPress={() => this.removeRow(item.inspectionTypeId)} />
                        </View> */}
                    </View>
                </View>
            </View>
        )
    }


    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <View style={{ flex: 1 }}>
                <Overlay
                    isVisible={this.state.success}
                    windowBackgroundColor="rgba(255, 255, 255, .8)"
                    overlayStyle={[styles.overlayContainer, { width: '95%', height: 'auto', }]}
                >
                    <Icon
                        name="check-circle"
                        type="material"
                        color="#43DEAE"
                        size={100}
                    />
                    <Text style={[styles.heading2, { fontSize: 26 }]}>Congratulations!</Text>
                    <Text style={{ color: '#808080' }}>Inspection(s) has been scheduled.</Text>
                    <Text style={[styles.heading2, { marginTop: 40, marginBottom: 30 }]}>Check your email for more details</Text>
                    <Button
                        buttonStyle={styles.modelButton}
                        title="OK"
                        onPress={() => this.closeModel(1)}
                    />
                </Overlay>
                {/* <Advertisement /> */}
                <Animated.View
                    style={{ flex: 1 }}
                >
                    <View style={[styles.container]}>
                        <Text style={styles.heading2}>Inspection Request</Text>
                        <View style={[styles.row]}>
                            <View style={{ justifyContent: "space-between", flex: 1 }}>
                                <Text style={styles.font12}>{this.state.address}</Text>
                            </View>
                            <View style={{ justifyContent: "space-between", flex: 1 }}>
                                <Text style={[{ textAlign: 'right' }, styles.font12]}>{moment(this.state.date).format('MM-DD-YYYY') + ' | ' + moment(this.state.time, 'hh:mm').format('LT')}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.border2}></View>
                    {/* <Errors errors={this.state.errors} /> */}
                    <View style={{ flex: 1, }}>
                        <FlatList
                            data={this.state.inspectionList}
                            renderItem={this.renderCellItem}
                            keyExtractor={(item, index) => index}
                            style={{ flex: 1 }}
                        />
                        {/* {this.state.inspectionList.filter((item) => item.isChecked).map((item) => this.Row(item))} */}
                    </View>
                    <View style={styles.center}>
                        <Button
                            buttonStyle={styles.modelButton}
                            onPress={() => this.save()}
                            title="Confirm"
                        />
                    </View>
                </Animated.View>
            </View>
        );
    }
}