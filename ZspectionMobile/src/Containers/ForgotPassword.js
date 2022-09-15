import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from '../../assets/styles/style.js';
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
} from 'native-base';
import { CheckBox, Avatar, Icon, Input, Overlay } from 'react-native-elements';
import Errors from '../Components/Errors';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import { API } from '../network/API';
import { showToastMsg } from '../utils.js';
import colors from '../utils/colors';
import CountDown from '../Components/CountDown/index.js';

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      otp1: '',
      otp2: '',
      otp3: '',
      otp4: '',
      otp5: '',
      otp6: '',
      errors: '',
      role: 0,
      loading: false,
      submit: false,
      isVisible: false,
      otp: '',
      otpSubmit: false,
      otpResponse: [],
      otpError: [],
      emailLoading: false,
      resOtp: '',
      otpView: false,
      otpLoading: false,
      timerMinutes: 3,
      timerSeconds: 0,
    };
    this.common = new Common();
  }

  start = () => {
    console.log('dfadsf');
    let myInterval = setInterval(() => {
      if (this.state.timerSeconds > 0) {
        this.setState({ timerSeconds: this.state.timerSeconds - 1 });
        // setSeconds(seconds - 1);
      }
      if (this.state.timerSeconds === 0) {
        if (this.state.timerMinutes === 0) {
          clearInterval(myInterval);
        } else {
          this.setState({
            timerMinutes: this.state.timerMinutes - 1,
            timerSeconds: 59,
          });
          // setMinutes(minutes - 1);
          // setSeconds(59);
        }
      }
    }, 1000);
  };

  componentDidMount() {
    var role = this.props.navigation.getParam('role');
    this.setState({ role: role });
  }
  back() {
    this.setState({ otpView: false });
  }
  validate() {
    var messages = [];
    this.setState({ submit: true });
    messages.push(!this.state.email && 'Email required');
    if (this.state.email && !this.common.validateEmail(this.state.email)) {
      messages.push('Invalid Email');
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
  displayErrors(error, flag = 0) {
    this.common.showToast(error);
    // var errors = [];
    // errors.push(error);
    // if(flag) {
    //     this.setState({otpError: errors})
    // }
    // else {
    //     this.setState({errors: errors})
    // }
  }

  validateOtp() {
    this.setState({ otpSubmit: true });
    if (!this.state.otp1) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else if (!this.state.otp2) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else if (!this.state.otp3) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else if (!this.state.otp4) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else if (!this.state.otp5) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else if (!this.state.otp6) {
      this.displayErrors('Please Enter Your OTP', 1);
    } else {
      var finalOtp =
        this.state.otp1 +
        this.state.otp2 +
        this.state.otp3 +
        this.state.otp4 +
        this.state.otp5 +
        this.state.otp6;
      //this.setState({ otp: finalOtp.toString() });
      var otp = finalOtp.toString();
      if (otp == this.state.resOtp) {
        this.setState({
          otpView: false,
        });
        this.props.navigation.navigate('ResetPassword', {
          email: this.state.email,
        });
      } else {
        showToastMsg('Otp does not match');
      }

      // var data = { "username": this.state.email, "password": otp, "roleid": this.state.role };
      // console.log("validateOtp request data: ", data);
      // var response = new API('Login', data).getResponse();
      // console.log("validateOtp response data: ", response);
      // response.then(result => {
      //     console.log("login result: ", result);
      //     if (result.statuscode == 200 && result.result.userid) {
      //         this.setState({ isVisible: false })
      //         var user = result.result;
      //         this.props.navigation.navigate('ChangePassword', { user: user, otp: otp });
      //     }
      //     else {
      //         this.displayErrors("Please Enter Your Valid OTP", 1);
      //     }
      // }).catch((error) => {
      //     this.displayErrors("Error in OTP verification", 1);
      // })
    }
  }

  forgot() {
    if (!this.state.email) {
      this.common.showToast('Please Enter your Email');
      this.email.focus();
    } else if (
      this.state.email &&
      !this.common.validateEmail(this.state.email)
    ) {
      this.common.showToast('Please enter your valid Email');
      this.email.focus();
    } else {
      this.setState({
        emailLoading: false,
      });

      API.forgotPassword(this.forgotPasswordRes, this.state.email);
      // var response = new API('ForgotPassword', {}).getApiResponse('?EmailId=' + this.state.email + "&RoleId=" + this.state.role);
      // console.log("forgot response: ", response);
      // response.then(result => {
      //     if (result.status == 200) {
      //         console.log("forgot response: ", result.data.result);
      //         this.setState({ otpResponse: result.data.result, isVisible: true });
      //     }
      //     else {
      //         this.displayErrors('Not account exist.');
      //     }
      // }).catch(error => {
      //     this.displayErrors('No account exist');
      // })
    }
  }

  forgotPasswordRes = {
    success: response => {
      console.log('forgot_pass_res>>>', response);
      showToastMsg(response.message);
      this.setState({
        emailLoading: false,
        resOtp: response.data,
        otpView: true,
      });
      this.start();
    },
    error: error => {
      console.log('forgot_pass_res_error>>>', error);
      showToastMsg(error.message);
      this.setState({
        emailLoading: false,
        otpView: false,
      });
    },
  };

  resendOTP() {
    alert('dd');
  }

  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <View style={styles.forgotPasswordContainer}>
        <Overlay
          overlayStyle={[styles.otpModel]}
          isVisible={this.state.otpView}>
          <TouchableOpacity
            onPress={() => this.back()}
            style={{
              alignContent: 'flex-end',
              alignSelf: 'flex-end',
              alignItems: 'flex-end',
              position: 'absolute',
              paddingBottom: 320,
              paddingRight: 5,
              paddingTop: 3,
            }}>
            <Icon type="font-awesome" name="times" color="#bfbfbf" size={17} />
          </TouchableOpacity>
          <Text style={[styles.otpmsg, { color: '#877f7f', marginTop: 50 }]}>
            OTP has been sent to your registered Email / Phone number.
          </Text>
          {/* <View style={{ width: '100%', backgroundColor: 'red', flex: 1 }}>
            <Text></Text>
            <CountDown
              style={{ height: 50, backgroundColor: 'red' }}
              until={60 * 10 + 30}
              size={17}
              onFinish={() => alert('Finished')}
              digitStyle={{
                backgroundColor: colors.fullTraspnat, width: 25,
                padding: 0, height: 30, justifyContent: 'center', alignItems: 'center', alignContent: 'center', justifyContent: 'center'
              }}
              digitTxtStyle={{ color: colors.txtColor, fontSize: 15, marginTop: 2 }}
              timeToShow={['M', 'S']}
              showSeparator={true}
              separatorStyle={{ color: colors.toolbar_bg_color, height: 30, padding: 0 }}
              timeLabels={{ m: '', s: '' }}
            />
          </View> */}

          <View>
            <Text style={{ alignSelf: 'center', color: '#877f7f' }}>
              Enter OTP
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Input
                ref="otp1"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp1: text });
                  //console.log('onChangeText', this.refs.card_exp_date_mm)
                  if (text && text.length == 1) {
                    this.refs.otp2.focus();
                  }
                }}
              />
            </View>
            <View>
              <Input
                ref="otp2"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp2: text });
                  //console.log('onChangeText', this.refs.card_exp_date_mm)
                  if (text && text.length == 1) {
                    this.refs.otp3.focus();
                  }
                }}
              />
            </View>
            <View>
              <Input
                ref="otp3"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp3: text });
                  //console.log('onChangeText', this.refs.card_exp_date_mm)
                  if (text && text.length == 1) {
                    this.refs.otp4.focus();
                  }
                }}
              />
            </View>
            <View>
              <Input
                ref="otp4"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp4: text });
                  //console.log('onChangeText', this.refs.card_exp_date_mm)
                  if (text && text.length == 1) {
                    this.refs.otp5.focus();
                  }
                }}
              />
            </View>
            <View>
              <Input
                ref="otp5"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp5: text });
                  //console.log('onChangeText', this.refs.card_exp_date_mm)
                  if (text && text.length == 1) {
                    this.refs.otp6.focus();
                  }
                }}
              />
            </View>
            <View>
              <Input
                ref="otp6"
                maxLength={1}
                autoCompleteType="off"
                secureTextEntry={true}
                keyboardType="number-pad"
                inputContainerStyle={{ width: 30 }}
                onChangeText={text => {
                  this.setState({ otp6: text });
                }}
              />
            </View>
          </View>



          <Errors errors={this.state.otpError} />
          <View style={styles.orWrapper}>
            <Button
              style={styles.modelButton}
              onPress={() => this.validateOtp()}>
              <Text>Submit</Text>
            </Button>
          </View>
        </Overlay>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ alignItems: 'center', paddingBottom: 50 }}>
            <Text style={{ color: '#877f7f' }}>
              Please enter your registered{' '}
            </Text>
            <Text style={{ color: '#877f7f' }}>Email</Text>
          </View>
          <View>
            <Item style={styles.formItem}>
              <Input
                autoCompleteType="off"
                ref={email => {
                  this.email = email;
                }}
                keyboardType="email-address"
                value={this.state.email}
                onChangeText={text => this.setState({ email: text })}
                placeholder="Email"
                inputStyle={[styles.font15]}
                autoCapitalize="none"
              />
            </Item>
            <Errors errors={this.state.errors} />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.emailLoading ? (
                <ActivityIndicator
                  color={colors.toolbar_bg_color}
                  size="large"
                  style={{ marginTop: 35 }}
                />
              ) : (
                <Button
                  style={styles.loginButtons}
                  onPress={() => this.forgot()}>
                  <Text style={styles.textCenter}>Submit</Text>
                </Button>
              )}
            </View>

            <View style={[styles.center, { marginTop: 100 }]}>
              {this.state.otpView && (
                <Text>{`OTP will expired in ${this.state.timerMinutes} : ${this.state.timerSeconds < 10
                  ? `0${this.state.timerSeconds}`
                  : this.state.timerSeconds
                  }`}</Text>
              )}
              <Text style={[styles.textCenter, { color: '#877f7f' }]}>
                If you have not received an OTP then{' '}
              </Text>
              <Text
                onPress={() => this.forgot()}
                style={{ color: '#28558E', fontSize: 14, marginTop: 5 }}>
                Click Here
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
