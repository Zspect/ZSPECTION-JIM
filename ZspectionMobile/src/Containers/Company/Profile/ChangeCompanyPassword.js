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
import styles from '../../../../assets/styles/style.js';
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
  Title
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../../../Components/Errors';
import { API } from "../../../network/API";
import Loader from '../../../Components/Loader';
import Common from '../../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { showToastMsg } from '../../../utils.js';

export default class ChangeCompanyPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      password: '',
      confirmPassword: '',
      loading: false,
      errors: [],
      submit: false,
      oldPassVisible: true,
      newPssVisible: true,
      confirmPassVisible: true
    };
    this.common = new Common();
  }

  componentDidMount() {

    this.focusSubscription = this.props.navigation.addListener(
      'didFocus',
      payload => {
        this.setState({
          oldPassword: '',
          password: '',
          confirmPassword: '',
        })
      }
    );



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
      showToastMsg("Old password cannot be blank")
    }
    else if (this.state.password.length == 0) {
      showToastMsg("Password cannot be blank")
    }
    else if (this.state.confirmPassword.length == 0) {
      showToastMsg("Confirm Password cannot be blank")
    }
    else if (this.state.confirmPassword != this.state.password) {
      showToastMsg("Both Password should be same")
    }
    else {
      var profile = JSON.parse(await AsyncStorage.getItem('profile'));
      var data = {
        userid: profile.userId,
        oldpassword: this.state.oldPassword,
        newpassword: this.state.password,
        confirmpassword: this.state.confirmPassword,
      };
      API.updateChangePassword(this.changePassword, data)
    }


    if (this.validate()) {




      // var response = new API('ChangePassword', data).getResponse();
      // console.log('response: ', response);
      // response
      //   .then(result => {
      //     if (result.statuscode == 200) {
      //       this.common.showToast('Password change successfully');
      //       this.success();
      //     } else {
      //       this.displayErrors(result.message);
      //     }
      //   })
      //   .catch(error => {
      //     this.displayErrors(error);
      //   });
    }
  };

  changePassword = {
    success: async (response) => {
      console.log("update_password>>>", response)
      //this.common.showToast('Password change successfully');
      this.common.showToast(response.message);
      await AsyncStorage.removeItem('roleid');
      await AsyncStorage.removeItem('userid');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('profile');
      this.props.navigation.navigate('UserSelection');
    },
    error: (error) => {
      console.log("profile__update__error>>>", error)
      this.common.showToast(error.message);
    }
  }

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
        <View style={{ marginHorizontal: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.font15, { flex: 1 }]}
              placeholder="Enter Old Password"
              value={this.state.oldPassword}
              secureTextEntry={this.state.oldPassVisible}
              onChangeText={text => this.setState({ oldPassword: text })}
            />
            <TouchableOpacity style={{
              width: 50, justifyContent: 'center',
              alignContent: 'center', alignItems: 'center'
            }}
              onPress={() => this.setState({
                oldPassVisible: !this.state.oldPassVisible
              })}
            >
              <MaterialCommunityIcons name={this.state.oldPassVisible ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />
        </View>

        {/* <Input
            secureTextEntry={true}
            inputContainerStyle={oldPassword && styles.inputError}
            rightIcon={oldPassword && this.common.getIcon()}
            errorMessage={oldPassword && 'Old Password Required'}
            value={this.state.oldPassword}
            onChangeText={text => this.setState({oldPassword: text})}
            placeholder="Enter Old Password"
            inputStyle={[styles.font15]}
          /> */}


        <View style={{ marginHorizontal: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.font15, { flex: 1 }]}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })}
              placeholder="Enter New Password"
              secureTextEntry={this.state.newPssVisible}
            />
            <TouchableOpacity style={{ width: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({
                newPssVisible: !this.state.newPssVisible
              })}
            >
              <MaterialCommunityIcons name={this.state.newPssVisible ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />
        </View>

        {/* <Item style={styles.formItem}>
          <Input
            secureTextEntry={true}
            inputContainerStyle={password && styles.inputError}
            rightIcon={password && this.common.getIcon()}
            errorMessage={password && 'Password Required'}
            value={this.state.password}
            onChangeText={text => this.setState({ password: text })}
            placeholder="Enter New Password"
            inputStyle={[styles.font15]}
          />
        </Item> */}

        <View style={{ marginHorizontal: 15 }}>
          <View style={{ flexDirection: 'row' }}>
            <TextInput
              style={[styles.font15, { flex: 1 }]}
              value={this.state.confirmPassword}
              onChangeText={text => this.setState({ confirmPassword: text })}
              placeholder="Confirm New Password"
              secureTextEntry={this.state.confirmPassVisible}
            />
            <TouchableOpacity style={{ width: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
              onPress={() => this.setState({
                confirmPassVisible: !this.state.confirmPassVisible
              })}
            >
              <MaterialCommunityIcons name={this.state.confirmPassVisible ? 'eye-off' : 'eye'} color='black' size={25} />
            </TouchableOpacity>
          </View>

          <View style={{ width: '100%', height: 1, backgroundColor: 'gray' }} />
        </View>

        {/* <Item style={styles.formItem}>
          <Input
            secureTextEntry={true}
            inputContainerStyle={confirmPassword && styles.inputError}
            rightIcon={confirmPassword && this.common.getIcon()}
            errorMessage={confirmPassword && 'Confirm Password Required'}
            value={this.state.confirmPassword}
            onChangeText={text => this.setState({ confirmPassword: text })}
            placeholder="Confirm New Password"
            inputStyle={[styles.font15]}
          />
        </Item> */}
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Button style={styles.loginButton}
            onPress={() => this.savePassword()}
          >
            <Text style={styles.textCenter}>Update</Text>
          </Button>
        </View>
      </View>
    );
  }
}
