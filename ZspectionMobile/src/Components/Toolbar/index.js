import React, { Component } from 'react';
import { Platform, TouchableOpacity, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import colors from '../../utils/colors.js';
import { deviceWidth } from '../../utils/utils.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";


const Toolbar = ({
    innerScreen, title,
    onCallbackPress
}) => {
    return (
        <View style={{ width: deviceWidth, height: 50, backgroundColor: colors.toolbar_bg_color, flexDirection: 'row' }}>
            <TouchableOpacity
                style={{ width: 40, height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}
                onPress={() => onCallbackPress()}
            >
                <MaterialCommunityIcons name={innerScreen ? 'chevron-left' : 'menu'} color={colors.white} size={30} />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: colors.white, fontSize: 18, fontWeight: 'bold' }}>{title}</Text>
            </View>
            <TouchableOpacity style={{ width: 40, height: 50, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }}>
                {/* <MaterialCommunityIcons name='menu' color={colors.white} size={30} /> */}
            </TouchableOpacity>
        </View>
    )
}
export default Toolbar