import React, { Component } from 'react';
import {
    Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity,
    FlatList, Dimensions, BackHandler, TextInput
} from 'react-native';
import {
    Container, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Title, Form, Item, Toast, Picker
} from 'native-base';
import Loader from '../../../../../Components/Loader';
import Common from '../../../../../Containers/Common';
import { API } from "../../../../../network/API";
import { color } from 'react-native-reanimated';
import colors from '../../../../../utils/colors';
import { showToastMsg } from '../../../../../utils';
import { deviceWidth, INSPECTION_TYPE, range } from '../../../../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../../../../utils/strings';

let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;
let squareFootateResponse;
let numberOfUnitResponse;
let itemMain = undefined;
let agentID = 0

const SliderHeader = ({item}) => {
    return (
        <View style={styles.mainView}>
            <View style={[{ flexDirection: 'row', justifyContent: 'center', alignContent: 'center', alignItems: 'center', paddingVertical: 15 }]}>
                <Image style={{ width: 20, height: 20 }}
                    source={{ uri: item.pictureUrl }}
                />
                <Text style={{ fontSize: 14, marginLeft: 10 }}>{item.name}</Text>
            </View>
            <View style={styles.divider}></View>
        </View>
    )
}
const styles = StyleSheet.create({
    mainView: {
    },
    divider: {
        width: deviceWidth, height: 1,backgroundColor:colors.gray
    }
})
export default SliderHeader