import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
//import styles from '../../../../assets/styles/style';
import style from '../../../../assets/styles/style';

import { Icon, Input, Button, Avatar, Overlay } from 'react-native-elements';
import Common from '../../Common/index';
import Rating from '../../../Components/Rating';
export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isVisible: false,
            data: {
                name: 'Pool Inspection',
                creatorName: 'Vaun Nicolos',
                contact: 'Contact Number',
                contactNumber: '+1 201 508 3652',
                companyText: 'Company Detail',
                companyName: 'TIC Inspection',
                companyData: 'The Inspection Compant Ltd. was founded in 2007 with the aim to avoid buyers risk on purchasing goods and improve the quality of product from all over Asia. We perform proffessional quality control like inspection services. Factory audit and Laboratory testing for Small and Medium Enterprisess (SMEs) as for Multination Enterprisess.',
                address: 'Address: 201 Route 17 North, Rutherford, New Jursey, 07070, United States',
                addressContact: 'Contact No: +1201 508 8000'
            }
        }
        this.common = new Common();
    }

    save() {
        this.setState({ isVisible: true })
    }
    back() {
        this.setState({ isVisible: false })
    }



    render() {
        return (
            <ScrollView style={{ flex: 1 }}>
                <Overlay isVisible={this.state.isVisible} overlayStyle={{ width: '78%', height: '55%' }}>
                    <View>
                        <Icon size={20} name="exclamation" type='font-awesome' color="#28558E" iconStyle={{ borderColor: '#28558E', borderWidth: 1, padding: 21, borderRadius: 150, width: 55, height: 60 }} />
                    </View>
                    <View style={{ marginTop: 5, padding: 13 }}>
                        <Text style={{ color: '#666262' }}>Are you sure want to mark the inspection as a complete?</Text>
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 40 }}>
                        <View style={style.nextButtonWrappers}>
                            <Button
                                title="Yes"
                                buttonStyle={style.yesButton}
                                iconRight>
                            </Button>
                        </View>
                        <View style={style.nextButtonWrappers}>
                            <Button
                                onPress={() => this.back()}
                                title="No"
                                buttonStyle={style.noButton}
                                titleStyle={{ color: '#28558E' }}
                                iconRight>
                            </Button>
                        </View>
                    </View>
                </Overlay>
                <View style={{ flexDirection: 'row', padding: 13, borderBottomColor: '#333', borderBottomWidth: 1 }}>
                    <View style={{ flexDirection: 'column', width: '60%' }}>
                        <Text style={{ color: '#28558E' }}>Inspection Details</Text>
                        <View style={{ paddingTop: 7 }}>
                            <Text style={style.Text}>11112 La Maida St Unit 15,</Text>
                            <Text style={style.Text}>Los Angeles. CA 91601</Text>
                            <Text style={style.Text}>Date & Time</Text>
                            <Text style={style.Text}>10/24/2019 | 02:30 PM</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'column', width: '40%', alignItems: 'flex-end' }}>
                        <Text style={{ color: '#28558E' }}>Cost</Text>
                        <View style={{ paddingTop: 7 }}>
                            <Text style={style.Text}>$489</Text>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 13 }}>
                    <View style={{ marginVertical: 10, marginLeft: 2 }}>
                        <Text style={[style.capitalize, { fontSize: 13, color: '#28558E', fontWeight: 'bold' }]}>{this.state.data.name}</Text>
                    </View>
                    <View style={[style.list]}>
                        <View style={[style.center, { width: 100 }]}>
                            <Avatar
                                overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                                rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                                size={65}
                                containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}
                            />
                            <Text style={[style.nameTxt, { textAlign: 'center', marginTop: 6, textDecorationLine: 'underline' }]}>{this.state.data.creatorName}</Text>
                            <Rating />
                        </View>
                        <View style={style.flatListItemTextRow}></View>
                        <View style={{ width: 120, alignItems: 'flex-end' }}>
                            <Text style={style.nameTxt}>{this.state.data.contact}</Text>
                            <View style={{ flex: 1, marginTop: 2 }}>
                                <Text style={{ marginTop: 4, fontSize: 13, color: '#6b6868' }}>{this.state.data.contactNumber}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ padding: 13 }}>
                    <Text style={{ color: '#28558E' }}>{this.state.data.companyText}</Text>
                    <View style={{ marginTop: 10 }}>
                        <Text>{this.state.data.companyName}</Text>
                        <Text style={{ fontSize: 13, marginTop: 3, color: '#6b6868' }}>{this.state.data.companyData}</Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', padding: 13 }}>
                    <Text style={{ fontSize: 13, color: '#6b6868' }}>{this.state.data.address}</Text>
                </View>
                <View style={{ flexDirection: 'row', padding: 13 }}>
                    <Text style={{ fontSize: 13, color: '#6b6868' }}>{this.state.data.addressContact}</Text>
                </View>
                <View style={style.nextButtonWrappers}>
                    <Button
                        onPress={() => this.save()}
                        title="Mark as Complete"
                        buttonStyle={style.btnNexts}
                        iconRight>
                    </Button>
                </View>
            </ScrollView>
        )
    }
}

