import React, {Component} from 'react';
import {
    Platform, StyleSheet, View, ScrollView, Image, RefreshControl, FlatList, Dimensions, TouchableOpacity
} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { Text, Body, Form, Item, Picker } from 'native-base';
import { CheckBox, Avatar, Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import GoogleSearch from '../../../Components/GoogleSearch';
import Common from '../../Common/index.js';
import Loader from '../../../Components/Loader';
import API from '../../../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from "moment";
export default class CreateOfflineBooking extends Component {
    constructor(props) {
        super(props)
        this.state = {
            address: '',
            startDate: null,
            startTime : null,
            endDate:null,
            endTime:null,
            displayTime: null,
            loading: false,
            refreshing: false,
            parseAddress:[],
            profile:this.props.navigation.state.params && this.props.navigation.state.params.inspector!==undefined ? this.props.navigation.state.params.inspector : {},
            lat: this.props.navigation.state.params && this.props.navigation.state.params.inspector.iLatitude!==undefined ? this.props.navigation.state.params.inspector.iLatitude :'',
            long:this.props.navigation.state.params && this.props.navigation.state.params.inspector.iLongitude!==undefined ? this.props.navigation.state.params.inspector.iLongitude : '',
            companyID:this.props.navigation.state.params &&  this.props.navigation.state.params.inspector.companyID!==undefined ? this.props.navigation.state.params.inspector.companyID :'',
            inspectorID:this.props.navigation.state.params &&  this.props.navigation.state.params.inspectorID!==undefined ? this.props.navigation.state.params.inspectorID : '',
            inspectorList:[],
        }
        this.common = new Common();
        this.mapAddress = this.mapAddress.bind(this);
        this.baseState = this.state;

    }
    
    mapAddress = (data, details) => {
        var address = this.common.parseAddress(details)
        this.setState({parseAddress:address, address:details.formatted_address,lat:address.lat,long:address.long})
    }
    getInspectors=async()=>{
        let cid  = await AsyncStorage.getItem('companyId');
        this.setState({loading: true})
        let userId = await AsyncStorage.getItem("userid")
        console.log("User id is :",userId)
        let response = await new API('CompanyInspectors', {}).getApiResponse('/' + cid);
        console.log("Company Inspectors response is:", response);
        this.setState({loading: false})
        try{
            if (response.status == 200) {
                console.log("Response status is ;", response);
                  this.setState({inspectorList:response.data, companyID: cid })
            }
            else {
                this.common.showToast(response.message)
            }
        }catch(error){
            this.common.showToast(error);
        }
    }

    onFocus=(payload)=>{
        this.getInspectors();
      }
      onBlur=(payload)=>{
        this.setState({
            address: '',
            startDate: null,
            startTime : null,
            endDate:null,
            endTime:null,
            displayTime: null,
            loading: false,
            refreshing: false,
            parseAddress:[],
            profile: {},
            lat: '',
            long: '',
            companyID:'',
            inspectorID:'',
            inspectorList:[],
        })
      }
      
    componentDidMount() {
        console.log("I am on CreateOfflineBooking page")
        this.focusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
             this.onFocus(payload);
            }
          );
          this.unfocusSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
             this.onBlur(payload);
            }
          );
    }
    componentWillUnmount(){
        this.focusSubscription.remove();
      }
   
    booking = async()=> {
       let start  = this.state.startDate
       let startDate = moment(this.state.startDate,"MM-DD-YYYY").format("YYYY-MM-DD");
       let startDateVal = startDate+"T"+this.common.getTwentyFourHourTime(this.state.startTime)+":"+"00.000Z";
       let endDateVal = startDate+"T"+this.common.getTwentyFourHourTime(this.state.endTime)+":"+"00.000Z";
       console.log("Start Time string is : ",startDateVal)
       console.log("End time string is : ",endDateVal)
       if(this.state.inspectorID=='') {
        this.common.showToast('Please select Inspector.')
        }
        else if(!this.state.address) {
            this.common.showToast('Select Address')
        }
        else if(this.state.startDate==null) {
            this.common.showToast('Select start date')
        }
        else if(this.state.startTime==null) {
            this.common.showToast('Select start time')
        }
        
        else if(this.state.endTime==null) {
            this.common.showToast('Select end time')
        }
        else {
           
            var data = {
                "bookingID":0,
                "inspectorID":parseInt(this.state.inspectorID),
                "companyID":parseInt(this.state.companyID),
                "startDate": startDateVal,
                "endDate": endDateVal,
                // "startTime": this.state.startTime,
                // "endTime": this.state.endTime,
                "bookingType":2,
                "createdOn":new Date().toISOString(),
                "bookingLatitude":this.state.lat,
                "bookingLongitude":this.state.long,
                "bookingStatus": 1,
            }
            console.log("Data to post for offline booking : " ,JSON.stringify(data));
            this.setState({loading: true})
            var response = await new API('OfflineBooking', data).getResponse();
            console.log("Response is :", response);
            try{
                if (response.response == 200) {
                    this.setState({loading: false})
                    this.common.showToast(response.message)
                    setTimeout(() => {
                        this.props.navigation.navigate('Services')
                    },2000)                
                }
                else {
                    this.setState({loading: false})
                    this.common.showToast(response.message)
                }
            }catch(error){
                this.setState({loading: false});
                this.common.showToast(error);
            }
        }
        
    }

    changeStartTime(time) {
        this.setState({
            startTime: time,
            displayTime: this.common.getTwentyFourHourTime(time)
        })
    }

    changeEndTime(time) {
        this.setState({
            endTime: time,
            displayTime: this.common.getTwentyFourHourTime(time)
        })
    }
    getInspectorProfile=async(inspectorId)=>{
        this.setState({loading: true})
        let response = await new API('InspectorDetail', {}).getApiResponse('/' + inspectorId);
        console.log("Inspector detail response is :", response);
        if(response.status==200){
            this.setState({profile:response.data.values})
        }
        this.setState({loading: false})
    }
   
    render() {
        console.log("Inspector profile : ", this.state.profile);
        if(this.state.loading) {
            return <Loader />
        }
        return (
            <ScrollView keyboardShouldPersistTaps='always'>
                <View>
                    <Form>
                   {this.state.inspectorList.length>0 && <View style={{borderColor:'#838b95',borderBottomWidth:SH*.001,}}>
                        <Picker
                            mode="dialog"
                            selectedValue={this.state.inspectorID}
                            onValueChange={ (value) => this.setState({inspectorID:value},()=>{
                                console.log("Inspector value :", this.state.inspectorID)
                                this.getInspectorProfile(this.state.inspectorID)
                            })}
                        >
                        <Picker.Item label="Choose Inspector" value="" />
                            {this.state.inspectorList.map(inspector => <Picker.Item label={inspector.fullName} value={inspector.inspectorID} key={inspector.inspectorID} />)}
                        </Picker>
                   </View>}
                    <View style={OfflineStyles.profileContainer}>
                    <Avatar
                            rounded
                            size="large"
                            source={{uri:'http://'+this.state.profile.profilePic}}
                            containerStyle={{marginRight:10,backgroundColor:'grey'}}
                    />
                    <View>
                            <View style={styles.nameContainer}>
                                <Text style={OfflineStyles.profileText}>{this.state.profile.firstName} {this.state.profile.lastName}</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={OfflineStyles.profileText}>{this.state.profile.emailID}</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={OfflineStyles.profileText}>{this.state.profile.mobileNumber}</Text>
                            </View>
                        </View>
                    </View>
                        <GoogleSearch value={this.state.address} mapAddress={this.mapAddress} iconMap={true} />
                        <View style={OfflineStyles.dateContainer}>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                mode="date"
                                date={this.state.startDate}
                                placeholder="Start Date"
                                format="MM-DD-YYYY"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                minDate = {new Date()}
                                onDateChange={(date) => {this.setState({startDate: date})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='calendar'
                                    type='font-awesome'
                                    color="#ccc"
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            />
                            </View>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                style={[styles.datePicker]}
                                mode="time"
                                is24Hour={false}
                                date={this.state.startTime}
                                placeholder="Start time"
                                format='hh:mm A'
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(time) => this.changeStartTime(time)}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='clock-o'
                                    type='font-awesome'
                                    color="#ccc"
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            />
                            </View>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                style={[styles.datePicker]}
                                mode="time"
                                is24Hour={false}
                                date={this.state.endTime}
                                placeholder="End time"
                                format='h:mm A'
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(time) => this.changeEndTime(time)}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='clock-o'
                                    type='font-awesome'
                                    color="#ccc"
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            />
                            </View>
                            <TouchableOpacity style = {OfflineStyles.button} onPress = {()=>{this.booking()}}>
                       <Text style={OfflineStyles.btnText}>Create Booking</Text>
                   </TouchableOpacity>
                        </View>
                    </Form>                    
                </View>
            </ScrollView>
        );
    }
}
const SW = Dimensions.get('window').width;
const SH = Dimensions.get('window').height;
const OfflineStyles = StyleSheet.create({
    profileContainer:{
        padding:SW*.01,
        flexDirection:'row',
        alignItems:'center',
    },
    profileText:{
        fontSize:SH*.021,
    },
    dateContainer:{
        marginVertical:SH*.021,
    },
    button:{
        marginTop:SH*.14,
        backgroundColor:'#28558e',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"space-around",
        width:SW*.45,
        alignSelf:"center",
        paddingVertical:SH*.014,
        borderRadius:SW*.01,
    },
    btnText:{
        color:"#fff",
        fontSize:SH*.021,
    },
})