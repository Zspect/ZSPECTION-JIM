import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, 
    TouchableOpacity, FlatList} from 'react-native';
import Loader from '../Components/Loader';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, Icon, Input, Badge, ListItem } from 'react-native-elements';
import Common from '../Containers/Common';
import API from '../Api/Api';
import RNCalendarEvents from 'react-native-calendar-events';
import AsyncStorage from '@react-native-async-storage/async-storage';
class Invites extends Component {
	constructor(props) {
    super(props)
    this.state = {
      data: [],
      refreshing: false,

    }
    this.common = new Common();
  }
  
  componentDidMount() {
    this.getData()
    this.getEndDate()
  }

  getData = () => {
    this.common.getInvites().then(res => {
      console.log("res.result: ",res.result)
        if(res.result && res.result.length) {
          this.setState({data: res.result})
        }
      })
  }

  getDateFormat(date, time) {
    date = date + " " + time;
    return new Date(date)
  }

  getEndDate = (date, time) => {
    date = new Date(date + " " + time)
    date.setDate(date.getDate() + 1);
    return date;
  }

  markCalendar = async (item) => {
    var self = this;
        RNCalendarEvents.authorizeEventStore().then(permission => {
            if(permission == 'authorized') {
                RNCalendarEvents.findCalendars().then(calendars => {
                  console.log("calendars: ",calendars)
                    calendars.forEach(calendar => {
                        if(calendar.allowsModifications && calendar.isPrimary) {
                            RNCalendarEvents.saveEvent(item.InvitationName, {
                                calendarId: calendar.id,
                                startDate: this.getDateFormat(item.InvitationDate, item.InvitationTime),
                                endDate: this.getEndDate(item.InvitationDate, item.InvitationTime),
                                notes: item.InvitationName
                            }).then(status => {
                                if(status) {
                                  self.common.showToast("Invite Added Successfully in your calendar")
                                  self.getData()
                                }
                            })
                            .catch(error => {
                                console.log("error event: ",error)
                            })
                        }
                    })
                })
            }
            
        }).catch(error => {
            console.log("error: ",error)
        })
        // var calendars = RNCalendarEvents.findCalendars()
    }

  markInvite = async (item, status) => {
    var authToken = await AsyncStorage.getItem("authToken");
    var header = {"authentication":authToken};		
    var request = {"invitationid": item.InvitationId, "status": status};
    var response = new API('MarkInvite',request, header).getResponse();
    response.then( result => {
      console.log("InvitationList result: ",result)
        if(result.statuscode == 200) {
            if(status == 1) {
                this.markCalendar(item)
            }
            else {
              this.getData()
            }
        }
        
    }).catch(error => {
        console.log("error: ",error)
    })
  }

  rightIcons = (item) => {
      return (
        <View>
            <Icon name='check' onPress={() => this.markInvite(item,1)} reverse size={14} color="#28558E" type='font-awesome'  />
            <Icon name='times' onPress={() => this.markInvite(item,2)} reverse size={14} color="#B9183A" type='font-awesome'  />
        </View>
      )
  }
  renderItem = ({item, index}) => {
    if(item.ConfirmStatus) return null;
    var subtitle = "You received the invitation from "+item.inspectorName+" at " + item.InvitationDate + " " + item.InvitationTime
    return(
        <ListItem
            title={item.InvitationName}
            titleStyle={{color:'#28558E', fontWeight:'bold'}}
            subtitle={subtitle}
            bottomDivider
            rightIcon={this.rightIcons(item)}
            
        />
    )
  }

  refresh = () => {
    this.getData()
  }
	
  render() {
    return (
        <FlatList
            data={this.state.data}
            keyExtractor={(item, index) => index}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.refresh}
        />
    );
  }
}
export default withNavigation(Invites);