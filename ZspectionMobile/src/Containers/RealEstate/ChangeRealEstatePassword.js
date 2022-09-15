import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import styles from '../../../assets/styles/style.js';
import {
  Container,
  Header,
  Content,
  Button,
  Card,
  CardItem,
  Text,
  Body,
  Form,
  Item,
  Title,
  Root,
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import { API } from "../../network/API";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMsg } from '../../utils.js';
export default class ChangeRealEstatePassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errors: [],
      submit: false,
      oldPassVisivle: true,
      oldNewVisivle: true,
      oldConfirNewVisivle: true
    };
    this.common = new Common();
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.savePassword });
  }

  // static navigationOptions = ({navigation}) => {
  //   const {params = {}} = navigation.state;
  //   return {
  //     title: 'Change Password',
  //     headerStyle: {backgroundColor: '#28558E'},
  //     headerTintColor: '#FFF',
  //     headerRight: (
  //       <Icon
  //         iconStyle={{marginRight: 15}}
  //         color="#FFF"
  //         name="floppy-o"
  //         type="font-awesome"
  //         onPress={() => params.handleSave()}
  //       />
  //     ),
  //   };
  // };

  displayErrors(error) {
    var errors = [];
    errors.push(error);
    this.setState({ errors: errors });
  }

  validate() {
    var messages = [];
    this.setState({ submit: true });
    messages.push(!this.state.oldPassword && 'Old Password required');
    messages.push(!this.state.password && 'Password required');
    messages.push(
      !this.state.confirmPassword && 'Confirmation Password required',
    );
    if (this.state.password && this.state.confirmPassword) {
      if (this.state.password != this.state.confirmPassword) {
        messages.push('Both password should be same');
      }
    }

    var errorShow = [];
    messages = messages.filter(msg => {
      if (msg) {
        return msg;
      }
    });
    for (var i = 0; i < messages.length; i++) {
      var required = messages[i].indexOf('required');
      if (required > 0) {
      } else {
        errorShow.push(messages[i]);
      }
    }
    this.setState({ errors: errorShow });
    if (messages.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  savePassword = async () => {
    if (this.state.oldPassword.length == 0) {
      showToastMsg("Old Password Cannot be Blank")
    } else if (this.state.password.length == 0) {
      showToastMsg("New Password Cannot be Blank")
    }
    else if (this.state.confirmPassword.length == 0) {
      showToastMsg("Confirm Password Cannot be Blank")
    }
    else if (this.state.confirmPassword != this.state.password) {
      showToastMsg("Password does not match")
    } else {
      var profile = JSON.parse(await AsyncStorage.getItem('profile'));
      console.log("profile_id >>>", profile)
      var token = await AsyncStorage.getItem('authToken');
      var header = { authentication: token };
      var data = {
        userid: profile.userId,
        oldpassword: this.state.oldPassword,
        newpassword: this.state.password,
        confirmpassword: this.state.confirmPassword,
      };
      API.updateChangePassword(this.changePassword, data)
    }

    // if (this.validate()) {
    //   // var response = new API('ChangePassword', data, header).getResponse();
    //   // console.log('requst: ', data, 'header: ', header, 'response: ', response);
    //   // response
    //   //   .then(result => {
    //   //     console.log(result)
    //   //     if (result.statuscode == 200) {
    //   //       this.success(result.result);
    //   //     } else {
    //   //       this.displayErrors(result.message);
    //   //     }
    //   //   })
    //   //   .catch(error => {
    //   //     console.log(error)
    //   //     this.displayErrors(error);
    //   //   });
    // }
  };

  changePassword = {
    success: (response) => {
      console.log("profile_update_res>>>", response)
      showToastMsg(response.message)
      setTimeout(() => {
        this.logoutData()
        // this.props.navigation.navigate('Profile');
      }, 2000);
    },
    error: (error) => {
      console.log("profile__update__error>>>", error)
      this.setState({ loading: false })
      showToastMsg(error.message)
    }
  }


  logoutData = async () => {
    await AsyncStorage.removeItem('roleid');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('profile');
    this.props.navigation.navigate('UserSelection');
    console.log("Logout done successfully.");
  }


  async success(profile) {
    // console.log("pass profile: ",profile);
    // await AsyncStorage.setItem("profile", JSON.stringify(profile));
    Toast.show({
      text: 'Password Change Successfully.',
      duration: 2000,
      type: 'success',
    });
    setTimeout(() => {
      this.props.navigation.navigate('Profile');
    }, 2000);
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    var oldPassword =
      !this.state.oldPassword && this.state.submit ? true : false;
    var password = !this.state.password && this.state.submit ? true : false;
    var confirmPassword =
      !this.state.confirmPassword && this.state.submit ? true : false;

    return (
      <View>
        <View>
          {/* <Header style={{backgroundColor: '#28558E'}}>
            <Body style={{justifyContent: 'center', alignItems: 'center'}}>
              <Title>Change Password</Title>
            </Body>
          </Header> */}
          <Errors errors={this.state.errors} />
          <Item style={[styles.formItem, { flexDirection: 'row', paddingHorizontal: 10 }]}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ flex: 1, color: 'black' }}
                placeholder="Enter Old Password"
                value={this.state.oldPassword}
                onChangeText={text => this.setState({ oldPassword: text })}
                secureTextEntry={this.state.oldPassVisivle}
              />
              {/* <Input
                secureTextEntry={true}
                inputContainerStyle={oldPassword && styles.inputError}
                errorMessage={oldPassword && 'Old Password Required'}
                value={this.state.oldPassword}
                onChangeText={text => this.setState({ oldPassword: text })}
                placeholder="Enter Old Password"
                inputStyle={[styles.font15, { flex: 1 }]}
              /> */}
            </View>

            <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({
                oldPassVisivle: !this.state.oldPassVisivle
              })}
            >
              <MaterialCommunityIcons name={this.state.oldPassVisivle ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </Item>

          <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center' }} />

          <Item style={[styles.formItem, { flexDirection: 'row', paddingHorizontal: 10 }]}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ flex: 1, color: 'black' }}
                placeholder="Enter New Password"
                onChangeText={text => this.setState({ password: text })}
                secureTextEntry={this.state.oldNewVisivle}
                value={this.state.password}
              />

            </View>
            {/* <Input
              secureTextEntry={true}
              inputContainerStyle={password && styles.inputError}
              rightIcon={password && this.common.getIcon()}
              errorMessage={password && 'Password Required'}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
              placeholder="Enter New Password"
              inputStyle={[styles.font15]}
            /> */}
            <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({
                oldNewVisivle: !this.state.oldNewVisivle
              })}
            >
              <MaterialCommunityIcons name={this.state.oldNewVisivle ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </Item>
          <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center' }} />
          <Item style={[styles.formItem, { flexDirection: 'row', paddingHorizontal: 10 }]}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ flex: 1, color: 'black' }}
                placeholder="Confirm New Password"
                value={this.state.confirmPassword}
                onChangeText={text => this.setState({ confirmPassword: text })}
                secureTextEntry={this.state.oldConfirNewVisivle}
              />

            </View>
            {/*  <Input
              secureTextEntry={true}
              inputContainerStyle={confirmPassword && styles.inputError}
              rightIcon={confirmPassword && this.common.getIcon()}
              errorMessage={confirmPassword && 'Confirm Password Required'}
              value={this.state.confirmPassword}
              onChangeText={text => this.setState({ confirmPassword: text })}
              placeholder="Confirm New Password"
              inputStyle={[styles.font15]}
            /> */}
            <TouchableOpacity style={{ width: 50, height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({
                oldConfirNewVisivle: !this.state.oldConfirNewVisivle
              })}
            >
              <MaterialCommunityIcons name={this.state.oldConfirNewVisivle ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </Item>

          <View style={{ width: '95%', height: 1, backgroundColor: 'gray', alignSelf: 'center' }} />
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Button style={styles.loginButton} onPress={() => this.savePassword()}>
            <Text style={styles.textCenter}>Update</Text>
          </Button>
        </View>
      </View>
    );
  }
}
