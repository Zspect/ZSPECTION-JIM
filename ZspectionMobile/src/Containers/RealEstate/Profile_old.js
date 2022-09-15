import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, Text, TouchableOpacity } from 'react-native';
import styles from '../../../assets/styles/styles.js';

import CalendarPicker from 'react-native-calendar-picker';

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStartDate: null,
        }
        this.onDateChange = this.onDateChange.bind(this);
    }
    onDateChange(date) {
        this.setState({
          selectedStartDate: date,
        });
      }

    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
        return (
            <ScrollView>
                <View style={styles.homeContainers}>
                    <View style={styles.advertisementSpace}>
                        <Text style={styles.white}>Company Details</Text>
                    </View>
                    <View style={{marginRight:8, marginLeft:8}}>
                    <View style={styles.inspectionRequestFormContainer}>
                        <View style={{ marginTop: 20 }}> 
                            <Text style={{ color: '#28558E' }}>ABC Company Pvt.Ltd</Text>
                        </View>
                    </View>
                    <View style={styles.row}>
                        <Image source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar7.png' }} style={styles.pic} />
                        <View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>Company Name</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>coolamitsourav@gmail.com</Text>
                            </View>
                            <View style={styles.nameContainer}>
                                <Text style={styles.nameTxt}>8210333218</Text>
                            </View>
                        </View>
                        <Image style={[styles.icon, { marginRight: 100 }]} source = {require('../../../assets/images/heart.png')} />
                    </View>
                    <View style={{justifyContent:'center', padding:10}}>
                        <View>
                            <Text style={{color:'#333', fontWeight:'bold'}}>Avaiblity:-</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Monday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Tuesday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Wednesday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Thursday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Friday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Saturday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.date}>Sunday</Text>
                            <Text style={styles.time}>9:00 AM - 4:00 PM</Text>
                        </View>
                        <View style={{marginTop:15}}>
                            <Text style={{color:'#333', fontWeight:'bold'}}>Schedules:-</Text>
                        </View>
                        <CalendarPicker
                            previousTitle="<"
                            nextTitle=">"
                            onDateChange={this.onDateChange}
                        />
                    </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}