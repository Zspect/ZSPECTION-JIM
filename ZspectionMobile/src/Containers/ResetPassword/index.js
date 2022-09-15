import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, TextInput, Text } from 'react-native';
import styles from '../../../assets/styles/style.js';
// import {
//     Container, Header, Content, Button, Card, CardItem,
//     Text, Body, Form, Item
// } from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMsg } from '../../utils.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import colors from '../../utils/colors.js';
import { API } from "../../network/API";

export default class ResetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            password: '',
            confirmPassword: '',
            loading: false,
            errors: [],
            submit: false,
            passIsHide: true,
            newPassIsHide: true,
            isLoading: false,
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
        var user = this.props.navigation.getParam('email');
        console.log('user_data >>', user)
        if (this.state.password.length == 0) {
            showToastMsg("Password is required")
        }
        else if (this.state.confirmPassword.length == 0) {
            showToastMsg("Confirm Password is required")
        }
        else if (this.state.confirmPassword != this.state.password) {
            showToastMsg("Password does not match")
        } else {
            this.setState({ isLoading: true })
            let data = {
                "email": user,
                "newPassword": this.state.password
            }
            API.changeForGotPassword(this.changeForGotPasswordRes, data)
        }
    }

    changeForGotPasswordRes = {
        success: (response) => {
            console.log("reset_pass_res>>>", response)
            showToastMsg(response.message)
            this.setState({ isLoading: false })
            this.props.navigation.navigate('UserSelection')
        },
        error: (error) => {
            console.log("reset_pass_res_error>>>", error)
            showToastMsg(error.message)
            this.setState({ isLoading: false })
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
        return (
            <View style={{ flex: 1, }}>
                <View style={{ flex: 1, width: '95%', alignItems: 'center', alignContent: 'center', alignSelf: 'center', marginVertical: 15 }}>
                    <View style={{ width: '100%' }}>
                        <Text style={{ color: colors.gray, fontSize: 16, fontWeight: 'bold' }}>Password</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={{
                                    color: colors.black, padding: 0, fontSize: 15, marginTop: 8,
                                    flex: 1
                                }}
                                secureTextEntry={this.state.passIsHide}
                                numberOfLines={1}
                                onChangeText={(txt) => this.setState({ password: txt })}
                                placeholder='Enter Password'
                            />
                            <TouchableOpacity style={{ marginTop: 10 }}
                                onPress={() => this.setState({
                                    passIsHide: !this.state.passIsHide
                                })}
                            >
                                <MaterialCommunityIcons name={!this.state.passIsHide ? 'eye' : 'eye-off'} color={colors.black} size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: colors.gray, marginVertical: 10 }} />

                    <View style={{ width: '100%' }}>
                        <Text style={{ color: colors.gray, fontSize: 16, fontWeight: 'bold' }}>New Password</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                            <TextInput
                                style={{
                                    color: colors.black, padding: 0, fontSize: 15, marginTop: 8,
                                    flex: 1
                                }}
                                secureTextEntry={this.state.newPassIsHide}
                                numberOfLines={1}
                                onChangeText={(txt) => this.setState({ confirmPassword: txt })}
                                placeholder='Enter New Password'
                            />
                            <TouchableOpacity style={{ marginTop: 10 }}
                                onPress={() => this.setState({
                                    newPassIsHide: !this.state.newPassIsHide
                                })}
                            >
                                <MaterialCommunityIcons name={!this.state.newPassIsHide ? 'eye' : 'eye-off'} color={colors.black} size={22} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{ width: '100%', height: 1, backgroundColor: colors.gray, marginVertical: 10 }} />

                    {this.state.isLoading ? <Loader /> :
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TouchableOpacity style={{
                                width: 150, height: 45, borderRadius: 15,
                                backgroundColor: colors.toolbar_bg_color, justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginVertical: 20
                            }}
                                onPress={() => this.changePassword()}
                            >
                                <Text style={{ color: colors.white, fontSize: 17 }}>Submit</Text>
                            </TouchableOpacity>
                        </View>
                    }


                </View>

                {/* <Item style={[styles.formItem,]}>
                    <Input secureTextEntry={true} inputContainerStyle={password && styles.inputError}
                        errorMessage={password && 'Password Required'}
                        value={this.state.password}
                        onChangeText={(text) => this.setState({ 'password': text })}
                        placeholder="Password" inputStyle={[styles.font15]} />

                    <TouchableOpacity>
                        <MaterialCommunityIcons name='eye' color={colors.black} size={15} />
                    </TouchableOpacity>

                </Item> */}
                {/* <Item style={styles.formItem}>
                    <Input secureTextEntry={true} inputContainerStyle={confirmPassword && styles.inputError}
                        rightIcon={confirmPassword && this.common.getIcon()} errorMessage={confirmPassword && 'Confirm Password Required'} value={this.state.confirmPassword} onChangeText={(text) => this.setState({ 'confirmPassword': text })} placeholder="Confirm Password" inputStyle={[styles.font15]} />
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
                </View> */}
            </View>

        );
    }
}