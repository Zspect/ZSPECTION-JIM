import React, {Component} from 'react';
import {
    Platform, StyleSheet, View, ScrollView, Image, RefreshControl, FlatList, Text
} from 'react-native';

import Common from '../../Common/index.js';

export default class InspectorPriceMatrix extends Component {
	constructor(props) {
        super(props)
        this.state = {
           
        }
        this.common = new Common();
    }
    render() {
        return (
            <View style = {{flex:1,justifyContent:'center',alignItems:'center'}}>
             <Text style = {{fontSize:22,fontWeight:'bold'}}>Coming Soon</Text>   
            </View>
        );
    }
}