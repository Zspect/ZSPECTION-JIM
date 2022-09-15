import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
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
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMsg } from '../../utils.js';
import { API } from '../../network/API';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../utils/colors.js';

let didBlurSubscription = ''
export default class ChangePasswordInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errors: [],
      submit: false,
      oldPassHide: false,
      newPassHide: false,
      confirmPssHide: false,
    };
    this.common = new Common();
  }

  componentDidMount() {
    didBlurSubscription = this.props.navigation.addListener(
      'didBlur',
      payload => {
        console.debug('didBlur', payload);
        this.setState({
          oldPassword: '',
          password: '',
          confirmPassword: '',
          loading: false,
          errors: [],
          submit: false,
          oldPassHide: false,
          newPassHide: false,
          confirmPssHide: false,
        })
      }
    );

   
    this.props.navigation.setParams({ handleSave: this.savePassword });
  }

  componentWillUnmount(){
    didBlurSubscription.remove();
  }

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
      showToastMsg('Old password cannot be blank');
    } else if (this.state.password.length == 0) {
      showToastMsg('New password cannot be blank');
    } else if (this.state.confirmPassword.length == 0) {
      showToastMsg('Confirm password cannot be blank');
    } else if (this.state.confirmPassword != this.state.password) {
      showToastMsg('Password does not match');
    } else {
      var profile = JSON.parse(await AsyncStorage.getItem('profile'));
      console.log('profile_id >>>', profile);
      var data = {
        userid: profile.userId,
        oldpassword: this.state.oldPassword,
        newpassword: this.state.password,
        confirmpassword: this.state.confirmPassword,
      };
      API.updateChangePassword(this.changePassword, data);
    }
  };

  changePassword = {
    success: response => {
      console.log('profile_update_res>>>', response);
      showToastMsg(response.message);
      setTimeout(() => {
        this.logoutData();
      }, 2000);
    },
    error: error => {
      console.log('profile__update__error>>>', error);
      this.setState({ loading: false });
      showToastMsg(error.message);
    },
  };

  logoutData = async () => {
    await AsyncStorage.removeItem('roleid');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('profile');
    this.props.navigation.navigate('UserSelection');
    console.log('Logout done successfully.');
  };

  async success() {
    // await AsyncStorage.setItem("profile", JSON.stringify(profile));
    this.props.navigation.goBack();
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
      <View style={{ flex: 1 }}>
        <Errors errors={this.state.errors} />
        <Item style={styles.formItem}>
          <Input
            secureTextEntry={!this.state.oldPassHide}
            inputContainerStyle={oldPassword && styles.inputError}
            rightIcon={
              <MaterialCommunityIcons
                name={this.state.oldPassHide ? 'eye' : 'eye-off'}
                color={colors.black}
                size={22}
                onPress={() =>
                  this.setState({
                    oldPassHide: !this.state.oldPassHide,
                  })
                }
              />
            }
            errorMessage={oldPassword && 'Old Password Required'}
            value={this.state.oldPassword}
            onChangeText={text => this.setState({ oldPassword: text })}
            placeholder="Enter Old Password"
            inputStyle={[styles.font15]}
          />
        </Item>
        <Item style={styles.formItem}>
          <Input
            secureTextEntry={!this.state.newPassHide}
            inputContainerStyle={password && styles.inputError}
            rightIcon={
              <MaterialCommunityIcons
                name={this.state.newPassHide ? 'eye' : 'eye-off'}
                color={colors.black}
                size={22}
                onPress={() =>
                  this.setState({
                    newPassHide: !this.state.newPassHide,
                  })
                }
              />
            }
            errorMessage={password && 'Password Required'}
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            placeholder="Enter New Password"
            inputStyle={[styles.font15]}
          />
        </Item>
        <Item style={styles.formItem}>
          <Input
            secureTextEntry={!this.state.confirmPssHide}
            inputContainerStyle={confirmPassword && styles.inputError}
            rightIcon={
              <MaterialCommunityIcons
                name={this.state.confirmPssHide ? 'eye' : 'eye-off'}
                color={colors.black}
                size={22}
                onPress={() =>
                  this.setState({
                    confirmPssHide: !this.state.confirmPssHide,
                  })
                }
              />
            }
            errorMessage={confirmPassword && 'Confirm Password Required'}
            value={this.state.confirmPassword}
            onChangeText={text => this.setState({ confirmPassword: text })}
            placeholder="Confirm New Password"
            inputStyle={[styles.font15]}
          />
        </Item>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            style={styles.loginButton}
            onPress={() => this.savePassword()}>
            <Text style={styles.textCenter}>Update</Text>
          </Button>
        </View>
      </View>
    );
  }
}
