
import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View,Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../assets/styles/style.js';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import Rating from './Rating';

class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: [],
        }
    }

    render() {

        return (

            <View style={{ padding: 10 }}>
                <View style={{ marginVertical: 10, marginLeft: 2 }}>
                    <Text style={[style.capitalize, { fontSize: 13, color: '#28558E', fontWeight: 'bold' }]}>{this.props.data.name}</Text>
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
        )
    }
}