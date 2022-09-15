import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
    Container, Root, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Form, Item
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Slider, Button } from 'react-native-elements';

import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import GoogleSearch from '../Components/GoogleSearch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ifEmailExists } from '../utils.js';
import { formatPhoneNumber } from '../utils/utils.js';

export default class RegisterCompany extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapAddress: [],
            companyName: '',
            companyEmail: '',
            companyPhone: '',
            address: '',
            state: '',
            city: '',
            zipcode: '',
            loading: false,
            contactorLicesNo:''
        }
        this.common = new Common();
    }

    async success(profile) {
        await AsyncStorage.setItem("roleid", profile.RoleId);
        await AsyncStorage.setItem("userid", profile.userid);
        await AsyncStorage.setItem("authToken", profile.AuthToken);
        await AsyncStorage.setItem("profile", JSON.stringify(profile));

        console.log("profile>>>>>> ", profile)
        //this.props.navigation.navigate('RegisterPriceMatrix', { "profile": profile })
    }
    onRegister = async () => {
        if (!this.state.companyName) {
            this.common.showToast('Please enter your Company Name');
            this.companyName.focus()
        }
        else if (!this.state.companyEmail) {
            this.common.showToast('Please enter your Company Email');
            this.companyEmail.focus()
        }
        else if (this.state.companyEmail && !this.common.validateEmail(this.state.companyEmail)) {
            this.common.showToast('Please enter your valid Company Email');
            this.companyEmail.focus()
        }
        else if (!this.state.companyPhone) {
            this.common.showToast('Please enter your Company Phone Number');
            this.companyPhone.focus()
        }
        else if (!this.state.address) {
            this.common.showToast('Please enter your Address');
            this.address.focus()
        }
        else if (!this.state.state) {
            this.common.showToast('Please enter your State');
            this.stateName.focus()
        }
        else if (!this.state.city) {
            this.common.showToast('Please enter your City');
            this.cityName.focus()
        }
        else if (!this.state.zipcode) {
            this.common.showToast('Please enter your Zipcode');
            this.zipCode.focus()
        }
        else {
            await this.getRequestData().then(data => {
                console.log("request data: ", JSON.stringify(data))
                this.props.navigation.navigate('RegisterCompany', { "request": data })
            });
        }
        // this.setState({loading:true})
        // let res = await ifEmailExists(this.state.companyEmail);
        // this.setState({loading:false})
        // console.log("Validate response is :" ,res);
        // if (res.values && res.values == true){
        //     await this.getRequestData().then(data => {
        //         console.log("request data: ", JSON.stringify(data))
        //         this.props.navigation.navigate('RegisterCompany', { "request": data })
        //     });
        // }
        //  else {
        //     this.companyEmail.focus();
        //     this.common.showToast('Email address already exists!')
        //  }
        // }
    }

    async getRequestData() {
        var request = this.props.navigation.getParam('request');
        var newRequest = {
            // "loginprovider": "",
            // "providerkey": "",
            "companyID": 0,
            "address": this.state.address,
            // "country": "USA",
            "state": this.state.state,
            "city": this.state.city,
            "zipcode": this.state.zipcode,
            "companyName": this.state.companyName,
            "emailID": this.state.companyEmail,
            "companyPhone": this.state.companyPhone,
            "contractorLicenseNo":this.state.contactorLicesNo
            // "pricemetrix" : "",
        }
        return { ...request, ...newRequest }
    }


    getSelectedColor(status) {
        return status ? '#28558E' : '#808080';
    }
    mapAddress = (data, details) => {
        console.log("map address called : ", data, details)
        this.setState({ address: data.description, mapAddress: details })
        var parseAdderss = this.common.parseAddress(details);
        this.setState({
            zipcode: parseAdderss.zipcode,
            state: parseAdderss.state,
            city: parseAdderss.city,
        })
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <Root>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View>
                        <View style={styles.container}>
                            <Text style={styles.heading}>Company Details</Text>
                            <Form>
                                <Input autoCompleteType="off" ref={companyName => { this.companyName = companyName }} value={this.state.companyName} onChangeText={(text) => this.setState({ 'companyName': text })} placeholder="Company Name" inputStyle={[styles.font15]} />

                                <Input autoCompleteType="off"
                                    ref={companyEmail => { this.companyEmail = companyEmail }}
                                    keyboardType="email-address"
                                    value={this.state.companyEmail}
                                    onChangeText={(text) => this.setState({ 'companyEmail': text })}
                                    placeholder="Company Email"
                                    inputStyle={[styles.font15]}
                                    autoCapitalize='none' />


                                <Input autoCompleteType="off"
                                    value={this.state.contactorLicesNo}
                                    onChangeText={(text) => this.setState({ contactorLicesNo: text })}
                                    placeholder="Contractor's license no"
                                    inputStyle={[styles.font15]}
                                    maxLength={15}
                                    autoCapitalize='none' />
                                    
                                <Input autoCompleteType="off"
                                    ref={companyPhone => { this.companyPhone = companyPhone }}
                                    keyboardType="numeric" value={this.state.companyPhone}
                                    onChangeText={(text) => this.setState({ 'companyPhone': formatPhoneNumber(text) })}
                                    placeholder="Company Phone No"
                                    inputStyle={[styles.font15]}
                                    maxLength={14} />

                                <GoogleSearch ref={address => { this.address = address }} value={this.state.address} mapAddress={this.mapAddress.bind(this)} icon={false} />
                                <View style={[styles.twoRow]}>
                                    <Input autoCompleteType="off" ref={stateName => { this.stateName = stateName }} containerStyle={styles.threeRow} onChangeText={(text) => this.setState({ 'state': text })} placeholder="State" value={this.state.state} inputStyle={[styles.font15]} disabled={true} />
                                </View>
                                <View style={styles.sectionRow}>
                                    <View style={[styles.threeRow]}>
                                        <Input autoCompleteType="off" ref={cityName => { this.cityName = cityName }} containerStyle={styles.threeRow} onChangeText={(text) => this.setState({ 'city': text })} placeholder="City" value={this.state.city} inputStyle={[styles.font15]} disabled={true} />
                                    </View>
                                    <View style={[styles.threeRow]}>
                                        <Input autoCompleteType="off" ref={zipCode => { this.zipCode = zipCode }} containerStyle={styles.threeRow} keyboardType="numeric" value={this.state.zipcode} onChangeText={(text) => this.setState({ 'zipcode': text })} placeholder="Zip Code" inputStyle={[styles.font15]} disabled={true} />
                                    </View>
                                </View>
                                <View style={[styles.center, styles.mtop15]}>
                                    <Button
                                        title="Next"
                                        buttonStyle={styles.btnNext}
                                        onPress={() => this.onRegister()}>
                                    </Button>
                                </View>
                            </Form>
                        </View>
                    </View>
                </ScrollView>
            </Root>
        );
    }
}