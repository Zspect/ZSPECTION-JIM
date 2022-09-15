import React, { Component } from 'react';
import { Text, View } from 'react-native';
import style from '../../assets/styles/style.js';
import colors from '../utils/colors';

const EmptyUI = ({ mainContainer, str, txtStyle }) => {
    return (
        <View style={[mainContainer, { flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center' }]}>
            <Text style={[txtStyle, { color: colors.txtColor, fontSize: 18, fontWeight: '400' }]}>
                {str ? str :'Data not found'}
            </Text>

        </View>
    )
}
export default EmptyUI