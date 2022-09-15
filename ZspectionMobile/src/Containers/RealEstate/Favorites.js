import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item,
} from 'native-base';
import FavoritesSchedule from '../../Components/FavoritesSchedule';
//import API from '../../Api/Api';
import Loader from '../../Components/Loader';
import EmpltyResult from '../../Components/EmpltyResult';
import Common from '../Common/index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from "../../network/API";
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';

export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            data: [],
            refreshing: false,
        }
        this.common = new Common()
    }

    componentDidMount() {
        this.refresh()
    }

    refresh = async () => {
        var token = await AsyncStorage.getItem('authToken');
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var header = { 'authentication': token };
        console.log("profile data", profile);
        var data = { agent: profile.reAgentID };

        this.setState({ loading: true });
        //var response = new API('FavInspectors', {}).getApiWithId('/' + profile.reAgentID);
        API.fetchFavInpector(this.favRes, profile.reAgentId)


        // response.then(result => {
        //     console.log("AgentFavouriteList result: ", result);
        //     if (result.response == 200) {
        //         this.setState({
        //             data: result.values,
        //             loading: false,
        //         })
        //     }
        //     else {
        //         console.log("error: ", result)
        //         this.setState({ loading: false });
        //     }
        // })
    }

    favRes = {
        success: (response) => {
            console.log("fav_inspector_res>>>", response)
            this.setState({
                data: response.data,
                loading: false,
            })
        },
        error: (error) => {
            console.log("fav_inspector_res_error>>>", error)
            this.setState({
                data: [],
                loading: false,
            })

        }
    }

    renderItem = ({ item, index }) => {
        return (
            <View>
                <View style={[style.favInspectorWrappers]}>
                    <View style={[style.center, { width: 100 }]}>
                        {item.profilePic ? <Avatar
                            overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                            rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                            size={60}
                            containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}
                            source={{ uri: 'http://' + this.props.item?.profilePic }}
                        /> : <Avatar
                            overlayContainerStyle={{ backgroundColor: '#ebebe0' }}
                            rounded icon={{ name: 'person', color: '#C39666', size: 40 }}
                            size={60}
                            containerStyle={{ borderColor: '#C39666', borderWidth: 1, }}

                        />}
                        <Text style={[styles.nameTxt, {
                            textAlign: 'center', marginTop: 6, textDecorationLine: 'underline',
                            color: '#28558E'
                        }]}>{item.agencyName}</Text>
                        {/* <Rating rating={this.props.item.InspectorRating ? parseInt(this.props.item.Rating) : 2.5} /> */}
                    </View>
                    <View style={style.flatListItemTextRow}>
                        <Text style={[style.nameTxt, { color: '#28558E', fontSize: 15 }]}>{item?.inspectorName}</Text>
                        <Text numberOfLines={3} style={[style.nameTxt2, { color: '#706c6c' }]}>{item?.reAgentName} </Text>
                    </View>
                    {/* <TouchableOpacity onPress={() => this.props.removeFavourite(this.props.item)} style={{ width: 40, alignItems: 'flex-end' }}>
                        <Icon size={15} name="heart" type='font-awesome' color="#B9183A" />
                    </TouchableOpacity> */}
                </View>
            </View>
        )

    }

    removeFavourite = async (item) => {
        var self = this;
        this.setState({ loading: true });
        var authToken = await AsyncStorage.getItem("authToken");
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        var header = { "authentication": authToken };
        var data = { "inspectorid": item.InspectorId, "agentid": profile.AgentId };
        var response = new API('Favorite', data, header).getResponse();
        console.log("fav response: ", response)
        response.then(result => {
            if (result.statuscode == 200) {
                self.common.showToast("Agent removed from your favourite list")
                this.refresh()
            }
            else {
                self.common.showToast("Invalid Response")
            }
        }).catch(error => {
            this.common.showToast("Please try again later")
        }).finally(() => {
            this.setState({ loading: false });
        })
    }

    render() {
        if (this.state.loading) return <Loader />
        return (
            <Container style={{ backgroundColor: '#ccc' }}>
                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={this.renderItem}
                    refreshing={this.state.refreshing}
                    onRefresh={this.refresh}
                    ListEmptyComponent={<EmpltyResult />}
                />
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    nameTxt: {
        fontSize: 12,
    },
    nameTxtname: {
        fontSize: 12,
    }
});  