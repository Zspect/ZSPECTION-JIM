import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../Components/Errors';
import API from '../Api/Api';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            confirmPassword: '',
            loading: false,
            errors: [],
            submit: false,
        }
        this.common = new Common();
    }


    displayErrors(error) {
        var errors = [];
        errors.push(error);
        this.setState({ errors: errors })
    }

    validate() {
        var messages = [];
        this.setState({ submit: true });
        messages.push(!this.state.password && 'Password required');
        messages.push(!this.state.confirmPassword && 'Confirmation Password required');
        if (this.state.password && this.state.confirmPassword) {
            if (this.state.password != this.state.confirmPassword) {
                messages.push("Both password should be same");
            }
        }

        var errorShow = [];
        messages = messages.filter((msg) => {
            if (msg) {
                return msg;
            }
        })
        for (var i = 0; i < messages.length; i++) {
            var required = messages[i].indexOf('required');
            if (required > 0) {

            }
            else {
                errorShow.push(messages[i]);
            }
        }
        this.setState({ errors: errorShow });
        if (messages.length > 0) {
            return false;
        }
        else {
            return true;
        }
    }

    changePassword() {
        var user = this.props.navigation.getParam('user');
        console.log('user', user)
        var otp = this.props.navigation.getParam('otp');
        console.log('otp', otp)
        if (this.validate()) {
            var data = { userid: user.userid, oldpassword: otp, newpassword: this.state.password, confirmpassword: this.state.confirmPassword };
            var response = new API('ChangePassword', data).getResponse();
            response.then(result => {
                if (result.statuscode == 200) {
                    this.success(user);
                }
                else {
                    this.displayErrors(result.message);
                }
            }).catch((error) => {
                this.displayErrors(error);
            })
        }
    }

    async success(profile) {
        await AsyncStorage.setItem("roleid", profile.RoleId);
        await AsyncStorage.setItem("userid", profile.userid);
        await AsyncStorage.setItem("authToken", profile.AuthToken);
        await AsyncStorage.setItem("profile", JSON.stringify(profile));
        if (profile.RoleId == 2) {
            this.props.navigation.navigate('RealEstateHome')
        }
        else if (profile.RoleId == 3) {
            this.props.navigation.navigate('CompanyHome')
        }
        else if (profile.RoleId == 4) {
            this.props.navigation.navigate('InspectorHome')
        }
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        var password = !this.state.password && this.state.submit ? true : false;
        var confirmPassword = !this.state.confirmPassword && this.state.submit ? true : false;

        return (

            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Errors errors={this.state.errors} />
                <Item style={styles.formItem}>
                    <Input secureTextEntry={true} inputContainerStyle={password && styles.inputError} rightIcon={password && this.common.getIcon()} errorMessage={password && 'Password Required'} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Password" inputStyle={[styles.font15]} />
                </Item>
                <Item style={styles.formItem}>
                    <Input secureTextEntry={true} inputContainerStyle={confirmPassword && styles.inputError} rightIcon={confirmPassword && this.common.getIcon()} errorMessage={confirmPassword && 'Confirm Password Required'} value={this.state.confirmPassword} onChangeText={(text) => this.setState({ 'confirmPassword': text })} placeholder="Confirm Password" inputStyle={[styles.font15]} />
                </Item>
                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <Button style={styles.loginButton} onPress={() => this.changePassword()}>
                        <Text style={styles.textCenter}>Submit</Text>
                    </Button>
                </View>
            </View>

        );
    }
}