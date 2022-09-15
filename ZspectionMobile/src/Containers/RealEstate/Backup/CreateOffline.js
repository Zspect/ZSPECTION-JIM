import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import styles from '../../../../assets/styles/style';
import {
    Root, Form, Picker
} from 'native-base';

import { Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import DateTimePicker from '@react-native-community/datetimepicker';
import Common from '../../Common/index';

export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            propertyType: '',
            date:'',
            displayTime:'',
            time:''
        }
        this.common = new Common();
    }

    changeTime(time) {
        this.setState({
            time: time,
            displayTime: this.common.getTwentyFourHourTime(time)
        })
        console.log(this.state.time, this.state.displayTime)
    }

    changeDate(date) {
        this.setState({
            date: date
        })
        console.log(this.state.date)
    }

    render() {
        return (
            <Root>
                <ScrollView>
                    <View style={styles.container}>
                        <Form>
                            <Input autoCompleteType="off" placeholder="Address" inputStyle={[styles.font15]} />
                            <View style={styles.sectionRow}>
                                <View style={[styles.sectionColumn]}>
                                    <DatePicker
                                        mode="date"
                                        //minDate={this.state.date}
                                        date={this.state.date}
                                        placeholder="Date"
                                        format="MM/DD/YYYY"
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        //onDateChange={(date) => {this.setState({date: date})}}
                                        onDateChange={(date) => this.changeDate(date)}
                                        iconComponent={
                                            <Icon
                                                size={17}
                                                name='calendar'
                                                type='font-awesome'
                                                containerStyle={styles.dateIcon}
                                            />
                                        }
                                        customStyles={{
                                            dateText: styles.dateText,
                                            dateInput: styles.dateInput
                                        }}

                                    />
                                </View>
                                <View style={[styles.sectionColumn]}>
                                    <DatePicker
                                        style={[styles.datePicker]}
                                        mode="time"
                                        is24Hour={false}
                                        date={this.state.displayTime}
                                        placeholder="Time"
                                        format='h:mm A'
                                        confirmBtnText="Confirm"
                                        cancelBtnText="Cancel"
                                        onDateChange={(time) => this.changeTime(time)}
                                        iconComponent={
                                            <Icon
                                                size={17}
                                                name='clock-o'
                                                type='font-awesome'
                                                containerStyle={styles.dateIcon}
                                            />
                                        }
                                        customStyles={{
                                            dateText: styles.dateText,
                                            dateInput: styles.dateInput
                                        }}

                                    />
                                </View>
                            </View>
                            <View style={styles.border}>
                                <Picker
                                    mode="dialog"
                                    selectedValue={this.state.propertyType}
                                    onValueChange={(value) => this.setState({ propertyType: value })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Property Type" value="" />
                                </Picker>
                            </View>
                            <View style={styles.border}>
                                <Picker
                                    mode="dialog"
                                    selectedValue={this.state.propertyType}
                                    onValueChange={(value) => this.setState({ propertyType: value })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Foundation Type" value="" />
                                </Picker>
                            </View>
                            <View style={styles.border}>
                                <Picker
                                    mode="dialog"
                                    selectedValue={this.state.propertyType}
                                    onValueChange={(value) => this.setState({ propertyType: value })}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Square Footage" value="" />
                                </Picker>
                            </View>
                            <Input autoCompleteType="off" secureTextEntry={true} placeholder="# of Stories" inputStyle={[styles.font15]} />
                            <View style={styles.nextButtonWrappers}>
                                <Button
                                    title="Submit"
                                    buttonStyle={styles.btnNext}
                                    //icon={<Icon name="angle-right" containerStyle={{ position: 'absolute', right: 10 }} type="font-awesome" color="#FFF" />}
                                    iconRight>
                                </Button>
                            </View>

                        </Form>
                    </View>
                </ScrollView>
            </Root>
        )
    }
}