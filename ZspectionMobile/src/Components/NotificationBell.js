import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity, ActivityIndicator} from 'react-native';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, Icon, Input, Badge } from 'react-native-elements';
import Common from '../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
class NotificationBell extends Component {
	constructor(props) {
    super(props)
    this.state = {
      counter: 0,
      role: 0
    }
    this.common = new Common();
  }
  
  async componentDidMount() {
    var role = await AsyncStorage.getItem("roleid");
    this.setState({role: role})
    // this.common.getInvites().then(res => {
    //   console.log("invites: ",res)
    //   if(res.result && res.result.length) {
    //     this.setState({counter: res.result.length})
    //   }
    // })
  }
	
  render() {
    if(this.state.role == 2) {
      return (
        <TouchableOpacity onPress={() => this.props.navigation.navigate('Invites')}>
          <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={22} color="#FFF" name='notifications' type='material' />
          {this.state.counter ? <Badge
            status="error"
            value={this.state.counter}
            containerStyle={{ position: 'absolute', top: -4, right: 8 }}
          /> : null}
        </TouchableOpacity>
      );  
    }
    else {
      return (
        <TouchableOpacity>
          <Icon iconStyle={{ marginRight:15, fontWeight:'normal',}} size={22} color="#FFF" name='notifications' type='material' />
          {this.state.counter ? <Badge
            status="error"
            value={this.state.counter}
            containerStyle={{ position: 'absolute', top: -4, right: 8 }}
          /> : null}
        </TouchableOpacity>
      );
    }
    
  }
}
export default withNavigation(NotificationBell);