import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../assets/styles/style.js';
import moment from 'moment';

import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../Components/Loader';
import API from '../Api/Api.js';
import Common from '../Containers/Common/index.js';
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
        this.common = new Common();
    }
    cancelBooking = async (item) => {
        console.log("Cancel booking : ", item)
        let role = await AsyncStorage.getItem("role");
        let userId = await AsyncStorage.getItem("userid");
        this.setState({ loading: true })
        try {
            let cancelResponse = await new API('cancelBooking', {}).getApiResponse("/" + item.bookingDetailID + "/" + role + "/" + userId);
            console.log("cancelBooking response : ", cancelResponse);
            this.setState({ loading: false }, () => {
                this.common.showToast(cancelResponse.data.message);
                this.props.callBackHandler();
            })
        } catch (error) {
            console.log("cancelBooking error : ", error);
            this.setState({ loading: false })
        }
    }
    review = (item) => {
        //    console.log("This : ", this.props.callBackHandler())
        try {
            this.props.reviewHandler(item);
        } catch (error) {

        }

    }

    delete = (item) => {
        this.props.deleteHnadler(item);
    }

    markAsFavourite = async (item) => {
        console.log('Item for favorite is  : ', item);
        var agentId = JSON.parse(await AsyncStorage.getItem('reAgentID'));
        console.log('Agent id is :', agentId);
        var response = new API('FavoriteInspector', {}).getResponse2(
            '/' + agentId + '/' + item.inspectorID + '/' + !item.favorite,
        );
        console.log("Mark favorite response is : ", response);
        this.common.showToast("Marked as favorite")
    };


    render() {
        this.props.item.markFav = false;
        if (this.state.loading) return <Loader />
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPressClick()
                }
                    //this.props.navigation.navigate('InspectorDetail', { 'Inspectors': this.props.item })
                }>
                <View style={{ flex: 1 }}>
                    <View style={[style.scheduleInspectorWrapper]}>
                        <View style={[style.center, { justifyContent: 'center', alignItems: 'center' }]}>
                            <Image
                                style={{ width: 50, height: 50, borderRadius: 25 }}
                                source={{
                                    uri: this.props.item.pictureUrl,
                                }}
                            />
                        </View>
                        <View style={{ flex: 1 }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 0.5, marginLeft: 20 }}>
                                    <Text style={{ color: '#28558E', fontWeight: 'bold', fontSize: 14 }}>{this.props.item.inspectorName}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', flex: .5, textAlign: 'right', justifyContent: 'flex-end' }}>
                                    {this.props.item.showReviewButton == true && this.props.review && <TouchableOpacity onPress={() => { this.review(this.props.item) }} >
                                        <Text style={{ paddingHorizontal: 5, paddingVertical: 4, color: "#28558E" }}>Leave a rating</Text>
                                        {/* <Icon size={25} name="star" color="#28558E"/> */}
                                    </TouchableOpacity>}

                                    {this.props.item.showReviewButton !== true && <TouchableOpacity onPress={() => { this.review(this.props.item) }} >
                                        <Rating rating={this.props.item.InspectorRating ? parseInt(this.props.item?.Rating) : 2.5} />
                                    </TouchableOpacity>}

                                    {this.props.item.showCancelButton == true && <TouchableOpacity onPress={() => { this.delete(this.props.item) }} style={{ marginHorizontal: 6 }}>
                                        {/* <Text style={{paddingHorizontal:10,paddingVertical:4,color:"#fff"}}>Cancel</Text> */}
                                        <Icon size={25} name="delete" color="red" />
                                    </TouchableOpacity>}

                                    {this.props?.item?.showHeartIcon == true && <TouchableOpacity onPress={() => { this.markAsFavourite(this.props.item); this.props.item.markFav = true }} style={{ marginHorizontal: 6 }}>
                                        {/* <Text style={{paddingHorizontal:10,paddingVertical:4,color:"#fff"}}>Cancel</Text> */}
                                        {/* <Icon size={25} name="heart" type="font-awesome" color={this.props.item.markFav ? "red" : "grey"} /> */}
                                    </TouchableOpacity>}
                                </View>
                            </View>
                            <View style={{ marginBottom: 5 }}>
                                <Text numberOfLines={4} style={[style.nameTxt2, { paddingHorizontal: 20 }]}>{moment(this.props.item.startDate, "YYYY-MM-DDTHH:mm:ss.SSS[Z]").format('MM/DD/YYYY- hh : mm A')}</Text>
                                <Text numberOfLines={4} style={[style.nameTxt2, { marginHorizontal: 20, flex: 1, flexWrap: 'wrap' }]}>{this.props.item.address}</Text>
                            </View>
                        </View>

                        {/* <View >
                        <Text style={[style.nameTxt2,{textAlign:'right'}]}>{this.props.item.Address} {this.props.item.ZipCode}</Text>
                        <Text style={style.nameTxt,{marginTop:25}}>$ {this.props.item.Price ? this.props.item.Price : 0}</Text>
                    </View> */}
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default withNavigation(Schedule);