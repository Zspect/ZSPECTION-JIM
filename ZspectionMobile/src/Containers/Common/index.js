import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';
import API from '../../Api/Api';
import Toast from 'react-native-simple-toast'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class Common {
	constructor() {
	}

	validateEmail(email) {
		if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
		{
			return true;
		}
		return false;
	}

	validatePhone(phone)
	{
		return false;
		// var phoneno = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
		// return phone.match(phoneno) ? true : false;
	}

	validateZipCode(zipcode){
		var zipCodePattern = /^[0-9]{5}(?:-[0-9]{4})?$/;
		return zipCodePattern.test(zipcode);
	}

	getIcon() {
		return <Icon name='times-circle-o' color='red' type='font-awesome' />
	}

	getState = async () => {
		var request = {"stateid": 0,"flag": 1};
		var response = await new API('StateList',request).getResponse();
		
		try {
			if(response.statuscode == 200 && response.result) {
                return response.result
			}
			else {
				console.log('not found 200 statsu');
				return false;
			}
		} catch (error) {
			console.log('error: ', error);
			return false;
		}
	}
	
    getCity = async (stateId) => {
        var response = await new API('CityList',{"stateid": stateId,"flag": 2}).getResponse();
        try {
			if(response.statuscode == 200 && response.result) {
                return response.result;
			}
			else {
				console.log('not found 200 statsu');
				return false;
			}
		} catch (error) {
			console.log('error: ', error);
			return false;
		}
	}
	
	getPropertyList = async() => {
		return [
			{propertyName: 'Rental', propertyId:1},
			{propertyName: 'Owner', propertyId:2},
		]
	}

	getInspectionList = async() => {
		var data = {"roleid":3, flag: 0, recordid: 0};
		var res = new API('SignUpHelper',data).getResponse();
		return res;
	}

	getFoundation = async(companyId) => {
		var data = {"roleid":3, flag: 1, recordid: companyId};
		return new API('SignUpHelper',data).getResponse();
	}

	getCategory = async(foundationId) => {
		var data = {"roleid":3, flag: 2, recordid: foundationId};
		return new API('SignUpHelper',data).getResponse();
	}

	getInspectionData = async(data) => {
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
		console.log("getInspectionData request: ",data,header)
		var res = new API('InspectionData',data,header).getResponse();
		return res;
	}

	getCompanyFoundation = async () => {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
		var data = {"inspector_id":0, "companyid": profile.CompanyId, "flag": 0,"foundationid": 0};
		return new API('InspectorHelper',data,header).getResponse();
	}

	Scheduled = async () => {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var companyId = profile.companyId
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
		var data = {"inspection_id":0, "user_id":companyId};
		return new API('Scheduled',data,header).getResponse();
	}

	getCompanyCategory = async (foundationId) => {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
		var data = {"inspector_id":0, "companyid": profile.CompanyId, "flag": 1,"foundationid": foundationId};
		return new API('InspectorHelper',data,header).getResponse();
	}

	getInspectorDetail = async (InspectorId) => {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};
		var data = {"inspector_id":InspectorId, "companyid": profile.CompanyId, "flag": 0};
		return new API('InspectorHelper',data,header).getResponse();
	}

	getInspectionName = (inspectionId, inspections) => {
		console.log("Inspections : ",inspections )
		console.log("inspectionId : ",inspectionId)
		var name = '';
		inspections.filter( (item) => {
			if(item.inspectionTypeID == inspectionId) {
				name = item.inspectionTypeName;
				console.log("Name found : ", name);
			}
		})
		return name;
	}

	getTwentyFourHourTime(amPmString) { 
        var d = new Date("1/1/2013 " + amPmString); 
        return (d.getHours()<10 ? '0' : '') + d.getHours() + ':' + (d.getMinutes()<10 ? '0' : '') + d.getMinutes();
	}
	
	getDateFormat(date) {
		var dd = String(date.getDate()).padStart(2, '0');
        var mm = String(date.getMonth() + 1).padStart(2, '0');
        var yyyy = date.getFullYear();
        return mm + '/' + dd + '/' + yyyy;
	}

	parseAddress = (details) => {
		console.log("Add details : ",details);
		const stateFinder = "administrative_area_level_1";
        const zipFinder = "postal_code";
        const cityFinder = "administrative_area_level_2";
		const { address_components } = details;
		var row = {zipcode:'',state:'',city:'',lat:'',long:''}
        address_components.map( (item) => {
            item.types.map( (type) => {
                if(type == zipFinder) {
					row.zipcode = item.long_name
                }
                if(type == stateFinder) {
                    row.state = item.long_name
                }
                if(type == cityFinder) {
                    row.city = item.long_name
                }
            })
		})
		row.lat = details.geometry.location.lat;
		row.long = details.geometry.location.lng;
		return row;
	}
	showToast(msg) {
		return (
			Toast.show(msg)
		)
	}

	formatPhoneNumber(phoneNumberString) {
		var cleaned = ('' + phoneNumberString).replace(/\D/g, '')
		var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
		if (match) {
		  return match[1] + '-' + match[2] + '-' + match[3]
		}
		return phoneNumberString
	}
	
	getInvites = async () => {
		var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var authToken = await AsyncStorage.getItem("authToken");
		var header = {"authentication":authToken};		
		var request = {"agentid": profile.AgentId};
		return await new API('InvitationList',request, header).getResponse();		
	}

	
	
}