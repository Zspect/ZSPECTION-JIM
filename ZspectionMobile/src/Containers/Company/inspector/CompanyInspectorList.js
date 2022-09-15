import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../../assets/styles/styles.js';

import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
//import Errors from '../../Components/Errors';
import API from '../../../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from "react-native-vector-icons/FontAwesome";

export default class CompanyInspectorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inspector_id: '',
            searchtext: '',
            company_id: "",
            value: '',
            data: [],
            fullData: [],
            errors: [],
            loading: false,
            refreshing: false,
            inspectionTypeId: "",
        }
    }

    componentDidMount() {
       // this.Inspectorlist();
    }

    Inspectorlist = async () => {
        this.setState({ loading: true })
        let companyId = await AsyncStorage.getItem('companyId');
        let response = await new API('CompanyInspectors', {}).getApiResponse('/' + companyId);
        console.log("Response of inspector list for company id : " + companyId, response);
        if (response.status == 200) {
            this.setState({ data: response.data, fullData: response.data, refreshing: false, loading: false })
        } else {
            var errors = [];
            this.setState({ errors: errors, loading: false })
        }
        console.log("Inspector response is :", response);
    }

    async getRequestData() {
        var profile = JSON.parse(await AsyncStorage.getItem('profile'));
        var companyId = profile.CompanyId;
        return {
            "inspector_id": 0,
            "searchtext": '',
            "company_id": companyId,
        }
    }

    searchFilterFunction = text => {
        var fullData = this.state.fullData
        this.setState({
            value: text
        });
        const textData = text.toUpperCase();
        const newData = fullData.filter(item => {
            return item.fullName.toUpperCase().includes(textData) || item.emailID.toUpperCase().includes(textData) || item.mobilenumber.toUpperCase().includes(textData);
        });

        this.setState({
            data: newData,
            //text:text
        });
    };

    onRefresh() {
        this.setState({ data: [] });
        this.Inspectorlist();
    }

    clickEventListener(item) {
        Alert.Alert(item.Name)
    }


    renderItem = ({ item, index }) => {
        return (
            <View style={styles.rows}>
                {item.profilePic ?
                    <Image source={{ uri: item.profilePic }} style={styles.pic} /> :
                    <FontAwesome name='user' size={55} color='black'
                        style={{ width: 100, height: 100, backgroundColor: 'red' }} />
                }

                <View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.fullName}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.emailID}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxt}>{item.mobilenumber}</Text>
                    </View>
                </View>
                <Icon
                    size={25}
                    name="angle-right"
                    type="font-awesome"
                    raised
                    color="#28558E"
                    onPress={() => this.props.navigation.navigate('CompanyOfflineBooking', { inspector: item })}
                />
            </View>

        );
    }

    header = () => {
        return (
            <View style={style.row}>
                <Input placeholder='Search via Inspector name, email or phone'
                    inputStyle={{ fontSize: 12 }}
                    onChangeText={text => this.searchFilterFunction(text)}
                    containerStyle={{ width: '85%' }}
                    inputContainerStyle={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 2, paddingHorizontal: 6, marginVertical: 2 }}
                    rightIcon={
                        <Icon
                            size={20}
                            name="search"
                        />
                    }
                />
                <View>
                    <Icon
                        size={20}
                        name="plus"
                        type="font-awesome"
                        reverse
                        color="#28558E"
                        onPress={() => this.props.navigation.navigate('CreateInspector')}
                    />
                </View>
            </View>
        )
    }

    render() {
        if (this.state.loading) {
            return (
                //loading view while data is loading
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <ScrollView keyboardShouldPersistTaps='always'
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }
            >
                <View style={styles.homeContainer}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                    // ListHeaderComponent={this.header}
                    />
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    rows: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        justifyContent: 'space-between',
        paddingLeft: 10,
        borderBottomColor: '#000',
        borderBottomWidth: 1,
        backgroundColor: '#FFF'
    },
    content: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center'
    },
    searchfilter: {
        width: 330,
        marginLeft: 10
    },
    pic: {
        borderRadius: 25,
        width: 50,
        height: 50,
    },
    icon: {
        marginLeft: 10,
        padding: 5
    },
    nameContainers: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
    },
    nameTxt: {
        fontWeight: '600',
        color: '#222',
        fontSize: 15,

    },
    homeContainer: {
        flex: 1,
    },
    advertisementSpace: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    white: {
        color: '#fff'
    },
    inspectionRequestFormContainer: {
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    nameTxt: {
        fontWeight: '600',
        color: '#222',
        fontSize: 15,

    },
    advertisementSpaces: {
        height: 35,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28558E',
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    loginButton: {
        backgroundColor: '#28558E',
        borderRadius: 10,
        paddingHorizontal: 30,
        marginVertical: 20,
        height: 35,
    },

});    
