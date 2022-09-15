import React, { Component } from 'react';
import { Platform, StatusBar, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem, Toast,
    Text, Body, Form, Item, Root, Left, Right, Title
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../../Components/Errors';
import API from '../../Api/Api';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class ChangePassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            oldPassword: '',
            password: '',
            confirmPassword: '',
            loading: false,
            errors: [],
            submit: false,
        }
        this.common = new Common();
    }

    componentDidMount() {
        this.setState({
            oldPassword: '',
            password: '',
            confirmPassword: '',
            loading: false,
            errors: [],
            submit: false,
        })
    }

    displayErrors(error) {
        var errors = [];
        errors.push(error);
        this.setState({ errors: errors })
    }

    validate() {
        var messages = [];
        this.setState({ submit: true });
        messages.push(!this.state.oldPassword && 'Old Password required');
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

    savePassword = async () => {
        if (this.validate()) {
            var profile = JSON.parse(await AsyncStorage.getItem('profile'));
            var token = await AsyncStorage.getItem('authToken');
            var header = { 'authentication': token };
            var data = { userid: profile.userid, oldpassword: this.state.oldPassword, newpassword: this.state.password, confirmpassword: this.state.confirmPassword };
            var response = new API('ChangePassword', data, header).getResponse();
            console.log("requst: ", data, "header: ", header, "response: ", response);
            response.then(result => {
                if (result.statuscode == 200) {
                    this.success(result.result);
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
        // console.log("pass profile: ",profile);
        // await AsyncStorage.setItem("profile", JSON.stringify(profile));
        Toast.show({
            text: "Password Change Successfully.",
            duration: 2000,
            type: "success"
        })
        setTimeout(() => {
            this.props.navigation.navigate('Profile')
        }, 2000)
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        var oldPassword = !this.state.oldPassword && this.state.submit ? true : false;
        var password = !this.state.password && this.state.submit ? true : false;
        var confirmPassword = !this.state.confirmPassword && this.state.submit ? true : false;

        return (
            <Root>
                <Header style={{ backgroundColor: '#28558E' }}>
                    <Body>
                        <Title style={{ color: '#FFF' }}>Change Password</Title>
                    </Body>
                    <Right>
                        <Button transparent>
                            <Icon name='floppy-o' type="font-awesome" color="#FFF" onPress={() => this.savePassword()} />
                        </Button>
                    </Right>
                </Header>
                <StatusBar backgroundColor="#28558E" barStyle="light-content" />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Errors errors={this.state.errors} />
                    <Item style={styles.formItem}>
                        <Input secureTextEntry={true} inputContainerStyle={oldPassword && styles.inputError} rightIcon={oldPassword && this.common.getIcon()} errorMessage={oldPassword && 'Old Password Required'} value={this.state.oldPassword} onChangeText={(text) => this.setState({ 'oldPassword': text })} placeholder="Enter Old Password" inputStyle={[styles.font15]} />
                    </Item>
                    <Item style={styles.formItem}>
                        <Input secureTextEntry={true} inputContainerStyle={password && styles.inputError} rightIcon={password && this.common.getIcon()} errorMessage={password && 'Password Required'} value={this.state.password} onChangeText={(text) => this.setState({ 'password': text })} placeholder="Enter New Password" inputStyle={[styles.font15]} />
                    </Item>
                    <Item style={styles.formItem}>
                        <Input secureTextEntry={true} inputContainerStyle={confirmPassword && styles.inputError} rightIcon={confirmPassword && this.common.getIcon()} errorMessage={confirmPassword && 'Confirm Password Required'} value={this.state.confirmPassword} onChangeText={(text) => this.setState({ 'confirmPassword': text })} placeholder="Confirm New Password" inputStyle={[styles.font15]} />
                    </Item>
                </View>
            </Root>
        );
    }
}