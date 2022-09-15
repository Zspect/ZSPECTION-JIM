import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../assets/styles/style.js';
import moment from 'moment';
import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common/index.js';
import colors from '../../utils/colors.js';



const InspectionCell = ({ item, onPressClick, onActionClick }) => {
    return (
        <TouchableOpacity
            style={styles.main_container}
            onPress={() => onPressClick()
                //this.props.navigation.navigate('InspectorDetail', { 'Inspectors': this.props.item })
            }>
            <View style={{ flex: 1 }}>
                <View style={[style.scheduleInspectorWrapper]}>
                    <View style={[style.center, { justifyContent: 'center', alignItems: 'center' }]}>
                        <Image
                            style={{ width: 50, height: 50, borderRadius: 25 }}
                            source={{
                                uri: item.pictureUrl,
                            }}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={styles.child_container}>
                            <Text style={styles.value_txt_style}>
                                {item.inspectorName}</Text>
                            <Text numberOfLines={1}
                                style={[styles.value_txt_style, { fontSize: 12, color: colors.txtColor, fontWeight: 'normal', marginVertical: 2 }]}>
                                {moment(item.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY - hh:mm A')}</Text>
                            <Text numberOfLines={4} style={[styles.value_txt_style, { fontSize: 12, color: colors.txtColor, fontWeight: 'normal' }]}>{item.address}</Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 0.5, marginLeft: 20 }}>
                                <Text style={{ color: '#28558E', fontWeight: 'bold', fontSize: 14 }}>
                                    {item.inspectorName}</Text>
                            </View>
                             <View style={{ flexDirection: 'row', flex: .5, textAlign: 'right', justifyContent: 'flex-end' }}>
                                {item.showReviewButton == true && item.review && <TouchableOpacity onPress={() => { this.review(item) }} >
                                    <Text style={{ paddingHorizontal: 5, paddingVertical: 4, color: "#28558E" }}>Leave a rating</Text>
                                </TouchableOpacity>}

                                {item.showReviewButton !== true && <TouchableOpacity onPress={() => { this.review(item) }} >
                                    <Rating rating={item.InspectorRating ? parseInt(item?.Rating) : 2.5} />
                                </TouchableOpacity>}

                                 {item.showCancelButton == true && <TouchableOpacity onPress={() => { this.delete(item) }} style={{ marginHorizontal: 6 }}>
                                    <Icon size={25} name="delete" color="red" />
                                </TouchableOpacity>}

                                {item?.showHeartIcon == true && <TouchableOpacity onPress={() => { this.markAsFavourite(item); item.markFav = true }} style={{ marginHorizontal: 6 }}>
                                </TouchableOpacity>} 
                            </View>
                        </View>
                        <View style={{ marginBottom: 5 }}>
                            <Text numberOfLines={4} style={[style.nameTxt2, { paddingHorizontal: 20 }]}>{moment(item.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY- hh : mm A')}</Text>
                            <Text numberOfLines={4} style={[style.nameTxt2, { marginHorizontal: 20, flex: 1, flexWrap: 'wrap' }]}>{item.address}</Text>
                        </View> */}
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {item.isReschedulable && (
                            <TouchableOpacity style={{ backgroundColor: colors.toolbar_bg_color, paddingHorizontal: 5, paddingVertical: 10, justifyContent: 'center', alignItems: 'center', justifyContent: 'center', borderRadius: 10 }}
                                onPress={() => onActionClick()}
                            >
                                <Text style={{ color: colors.white, fontSize: 12, textTransform: 'uppercase' }}>Reschedule</Text>
                            </TouchableOpacity>
                        )}

                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    main_container: {
        width: '100%',
    },
    child_container: {
        flex: 1, marginHorizontal: 8
    },
    value_txt_style: {
        color: '#28558E', fontWeight: 'bold', fontSize: 14
    }
})
export default InspectionCell