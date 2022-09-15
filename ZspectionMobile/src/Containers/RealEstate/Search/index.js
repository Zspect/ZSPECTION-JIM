import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../../../assets/styles/style.js';
import { Button, Text, Body, Form, Picker } from 'native-base';

import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';
import Common from '../Common/index.js';
import Loader from '../../Components/Loader';
import Advertisement from '../../Components/Advertisement';
import Errors from '../../Components/Errors';

import moment from "moment";

export default class Register extends Component {
	constructor(props) {
        super(props)
        this.state = {
            address: '',
            state: '',
            city: '',
            zipcode: '',
            date: new Date(),
            time: '00:00',
            age: '',
            squareFootage: '',
            foundation: '',
            propertyType : 0,
            inspections: [],
            propertyList: [],
            inspectionList: [],
            stateList: [],
            cityList: [],
            submit: false,
            errors: [],
            isDatePickerVisible:false,
            pickerTime:'00:00',
            pickerKey:'',
            pickerInputName:'',
        }
        this.common = new Common();
    }
    
    componentDidMount() {
        this.getData();
    }

    validate = () => {
        var messages = [];
        var errorShow = [];
        this.setState({submit:true});
        messages.push(!this.state.propertyType  && 'Property Type required');
        messages.push(!this.state.address  && 'Address required');
        messages.push(!this.state.state  && 'state required');
        messages.push(!this.state.city  && 'city required');
        messages.push(!this.state.zipcode  && 'zipcode required');
        messages.push(!this.state.age  && 'age required');
        messages.push(!this.state.squareFootage  && 'squareFootage required');
        messages.push(!this.state.foundation  && 'foundation required');
        
        if(this.state.inspections.length <= 0) {
            messages.push(!this.state.propertyType  && 'Please select at least one inspection category');
        }

        messages = messages.filter( (msg) => {
			if(msg) {
				return msg;
			}
		})
		for(var i=0; i<messages.length; i++) {
			var required = messages[i].indexOf('required');
			if(required > 0) {
				
			}
			else {
				errorShow.push(messages[i]);
			}
		}
		this.setState({ errors: errorShow});
		if(messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
    }

    getCompanyList() {
        
        if(!this.validate()) {
            var inspections = [];
            this.state.inspections.map( inspectionId => {
                inspections.push({inspectiontypeid:inspectionId})    
            })
            var data = {"inspectionid":this.state.propertyType, "flag": 0,"inspectiontype": inspections,"inspectiondate":this.state.date}
            this.common.getInspectionData(data).then(response => {
                if(response.result.inspectioncompany && response.result.inspectioncompany.length) {
                    this.props.navigation.navigate('CompanyListing',{inspectionCompanies:response.result.inspectioncompany})
                    //this.props.navigation.navigate('Favorites',{inspectionCompanies:response.result.inspectioncompany})   
                }
                else {
                    this.showError('No company found');
                }
                
            }).catch( (error) => {
                this.showError('Invalid response')
            });

        }
    }

    showError(error) {
        var errors = [];
        errors.push(result.message);
        this.setState({errors: errors})
    }
       

    getData() {
        var data = {"inspectionid":this.state.propertyType, "flag": 0,"inspectiontype": [],"inspectiondate":''}
        this.common.getInspectionData(data).then(response => {
            this.setState({stateList: response.result.state})
            this.setState({propertyList: response.result.propertytype})
            this.setState({inspectionList: response.result.inspectiontype})    
        });
        console.log('dfglkf', this.state.inspectionList)
    }

    getCity(stateid) {
        this.setState({state:stateid});
        this.common.getCity(stateid).then(city => {
            this.setState({cityList: city})
        });
    }

    handleCheckbox(id,index) {
        var checkboxes = [...this.state.inspections];
        var index = checkboxes.indexOf(id);
        if(index >= 0) {
            checkboxes.splice(index,1);
        } else {
            checkboxes.push(id)
        }
        this.setState({inspections: checkboxes});
        
    }

    printInspectionList = () => {
        return(
            <View style={{flexDirection:'row', flexWrap: 'wrap'}}>
                {this.state.inspectionList.map((inspection, index) => {
                    var check = this.state.inspections.indexOf(inspection.InspectionTypeId) >= 0 ? true : false; 
                    return(
                        <CheckBox
                            containerStyle={{width:'44%',padding:0,height:40,borderWidth:0,marginHorizontal:0, backgroundColor:'#FFF'}}
                            key={inspection.InspectionTypeId}
                            title={inspection.InspectionTypeName}
                            checked={check}
                            onPress={() => this.handleCheckbox(inspection.InspectionTypeId,index)}
                        />
                    )
                })}               
            </View>
        )
    }

    showDatePicker = async (time,  name) => {
        console.log(time, name)
        this.setState({isDatePickerVisible:true, pickerTime:new Date(), pickerInputName:name})
      };
    
    
      onChange = (event, selectedDate) => {
        this.hideDatePicker()
        let time = event?.nativeEvent?.timestamp
        if(time){
        console.log(time,  this.state.pickerInputName);
        this.setState({
            time: moment(time).format('HH:mm'),
            //displayTime: moment(time).format('HH:mm')
        },()=>{
           // console.log("Display Time is : ", this.state.displayTime);
        })
      }
      };
    
        hideDatePicker = () => {
        this.setState({isDatePickerVisible:false})
      };
	
    render() {
        if(this.state.loading) {
            return <Loader />
        }
        
        var address = !this.state.address && this.state.submit ? true : false;
        var state = !this.state.state && this.state.submit ? true : false;
        var city = !this.state.city && this.state.submit ? true : false;
        var zipcode = !this.state.zipcode && this.state.submit ? true : false;
        var age = !this.state.age && this.state.submit ? true : false;
        var squareFootage = !this.state.squareFootage && this.state.submit ? true : false;
        var foundation = !this.state.foundation && this.state.submit ? true : false;
        return (
            <ScrollView>
                <View>
                    <Advertisement />
                    <Form>
                        <Errors errors={this.state.errors} />
                        <Text style={styles.heading}>INSPECTION REQUEST:-</Text>
                        <Input inputContainerStyle={address && styles.inputError} rightIcon={address && this.common.getIcon()} errorMessage={address && "Address required"} value={this.state.address} onChangeText={(text) => this.setState({'address': text})}  placeholder="Address" inputStyle={[styles.font15]}  />
                        <View style={styles.sectionRow}>
                            <View style={[styles.sectionColumn]}>
                                <Picker
                                    mode="dialog"
                                    selectedValue={this.state.state}
                                    onValueChange={ (value) => this.getCity(value)}
                                    
                                >
                                    <Picker.Item label="State" value="" />
                                    {this.state.stateList.map(state => <Picker.Item label={state.statename} value={state.stateid} key={state.stateid} />)}
                                </Picker>
                            </View>
                           <View style={[styles.sectionColumn]}>
                            <Picker
                                    mode="dialog"
                                    selectedValue={this.state.city}
                                    onValueChange={ (value) => this.setState({city:value})}
                                >
                                    <Picker.Item label="City" value="" />
                                    {this.state.cityList.map(city => <Picker.Item label={city.cityname} value={city.cityid} key={city.cityid} />)}
                                </Picker>
                           </View>
                           <View style={[styles.sectionColumn]}>
                                <Input inputContainerStyle={zipcode ? styles.inputError: styles.borderNone} rightIcon={zipcode && this.common.getIcon()} errorMessage={zipcode && "Zipcode required"} value={this.state.zipcode} onChangeText={(text) => this.setState({'zipcode': text})}  placeholder="Zipcode" inputStyle={[styles.font15]}  />
                            </View>
                        </View>
                        <View style={styles.sectionRow}>
                            <View style={[styles.sectionColumn]}>
                            <DatePicker
                                mode="date"
                                date={this.state.date}
                                placeholder="Date"
                                format="YYYY-MM-DD"
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(date) => {this.setState({date: date})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='calendar'
                                    type='font-awesome'
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

                            <View style={{flexDirection:'row', justifyContent:'flex-start', paddingTop:15, paddingBottom:5}}>
                                <TouchableOpacity style={{flexDirection:'row', justifyContent:'flex-start'}} onPress={() => this.showDatePicker(this.state.time, 'start_time' )}>
                                <Icon
                                    size={18}
                                    name="clock-o"
                                    type="font-awesome"
                                    color="black"
                                    containerStyle={{textAlignVertical:'center'}}
                                />
                                <Text style={[styles.dateText, {color:"black",  marginLeft:10}]}> {this.state.time? this.state.time : 'HH:MM'} </Text>
                                </TouchableOpacity>
                            </View>
                            {this.state.isDatePickerVisible && 
                                <DateTimePicker
                                testID="dateTimePicker"
                                value={this.state.time}
                                mode='time'
                                is24Hour={false}
                                display="default"
                                onChange={this.onChange}
                                />
                            }   

                            {/* <DatePicker
                                style={[styles.datePicker]}
                                mode="time"
                                is24Hour={false}
                                date={this.state.time}
                                placeholder="HH:MM"
                                format='HH:mm'
                                confirmBtnText="Confirm"
                                cancelBtnText="Cancel"
                                onDateChange={(time) => {this.setState({time: time})}}
                                iconComponent={
                                    <Icon 
                                    size={20}
                                    name='clock-o'
                                    type='font-awesome'
                                    containerStyle={styles.dateIcon}
                                    />
                                }
                                customStyles={{
                                    dateText : styles.dateText,
                                    dateInput: styles.dateInput
                                }}
                                
                            /> */}
                            </View>
                        </View>
                        <Input inputContainerStyle={age && styles.inputError} rightIcon={age && this.common.getIcon()} errorMessage={age && "age required"} value={this.state.age} onChangeText={(text) => this.setState({'age': text})}  placeholder="Age of the property" inputStyle={[styles.font15]}  />
                        <Input inputContainerStyle={squareFootage && styles.inputError} rightIcon={squareFootage && this.common.getIcon()} errorMessage={squareFootage && "Square Footage required"} value={this.state.squareFootage} onChangeText={(text) => this.setState({'squareFootage': text})}  placeholder="Square Footage" inputStyle={[styles.font15]}  />
                        <Input inputContainerStyle={foundation && styles.inputError} rightIcon={foundation && this.common.getIcon()} errorMessage={foundation && "Foundation required"} value={this.state.foundation} onChangeText={(text) => this.setState({'foundation': text})}  placeholder="Foundation" inputStyle={[styles.font15]}  />
                        <View style={styles.border}>
                            <Picker
                                mode="dialog"
                                selectedValue={this.state.propertyType}
                                onValueChange={ (value) => this.setState({propertyType:value})}
                            >
                                <Picker.Item label="Property Type" value="" />
                                {this.state.propertyList.map(propery => <Picker.Item label={propery.PropType} value={propery.PropTypeId} key={propery.PropTypeId} />)}
                            </Picker>
                        </View>
                        <Text style={styles.heading}>CHOOSE INSPECTION:-</Text>
                        {this.printInspectionList()}
                        <View style={{alignItems:'flex-end', marginRight:15}}>
                            <Button style={styles.loginButton} onPress={() => this.getCompanyList()}>
                                <Text style={styles.textCenter}>Next</Text>
                            </Button>
                        </View>
                    </Form>
                </View>
            </ScrollView>
        );
    }
}