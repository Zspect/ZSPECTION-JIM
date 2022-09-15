import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert, BackHandler } from 'react-native';
import style from '../../../../assets/styles/styles.js';

import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';

//import API from '../../../Api/Api';
import { API } from "../../../network/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../utils/colors.js';


export default class Inspectionlist extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
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
    onFocus = (payload) => {
        this.setState({ data: [], fullData: [], refreshing: false, loading: false })
        this.Inspectorlist();
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.focusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                this.onFocus(payload);
            }
        );
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.focusSubscription.remove();
    }
    componentDidUpdate(prevProps, prevState) {
        // if(this.props.navigation.getParam('InspectorId') !== prevProps.navigation.getParam('InspectorId')) {
        //     this.Inspectorlist()
        // }
    }

    handleBackButtonClick() {
        //this.props.navigation.goBack(null);
        BackHandler.exitApp();
        return true;
    }

    Inspectorlist = async () => {
        this.setState({ loading: true })
        let companyId = await AsyncStorage.getItem('companyId');
        API.fetchCompanyInspector(this.companyInspector, companyId)
        // let response = await new API('CompanyInspectors', {}).getApiResponse('/' + companyId);
        // if(response.status==200){
        //     this.setState({data:response.data,fullData:response.data,refreshing: false,loading:false})
        // }else{
        //     var errors = [];
        //     this.setState({errors: errors,loading:false})
        // }
        //   console.log("Inspector response is :" , response);
    }

    companyInspector = {
        success: (response) => {
            console.log("company_inspector >>>", response)
            this.setState({ data: response.data, fullData: response.data, refreshing: false, loading: false })
        },
        error: (error) => {
            console.log("company_inspector_error>>>", error)
            this.setState({ errors: errors, loading: false })
        }
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
            return item.firstName.toUpperCase().includes(textData) || item.emailId.toUpperCase().includes(textData) || item.mobileNumber.toUpperCase().includes(textData);
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
        console.log("dsaddadad >>", item)
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate('InspectorDetail', { inspector: item }),
                    this.setState({ data: [], fullData: [], refreshing: false, loading: false })
                }
                }
                style={styles.rows}>
                <Image source={{ uri: item.profilePic }} style={styles.pic} />
                <View style={{ flex: 1, marginHorizontal: 10 }}>
                    <View style={styles.nameContainers}>
                        <Text style={[styles.nameTxt, { color: item.isActive ? colors.black : colors.gray }]}>{item.firstName + ' ' + item.lastName}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={[styles.nameTxt, { fontSize: 13, color: item.isActive ? colors.black : colors.gray }]}>{item.emailId}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={[styles.nameTxt, { fontSize: 13, color: item.isActive ? colors.black : colors.gray }]}>{item.mobileNumber}</Text>
                    </View>
                </View>
                <Icon
                    size={20}
                    name="angle-right"
                    type="font-awesome"
                    raised
                    color="#28558E"
                />
            </TouchableOpacity>

        );
    }

    header = () => {
        return (
            <View style={[style.row, { marginBottom: 10 }]}>
                <Input placeholder='Search via Inspector name, email or phone'
                    inputStyle={{ fontSize: 12 }}
                    onChangeText={text => this.searchFilterFunction(text)}
                    containerStyle={{ width: '85%' }}
                    value={this.state.value}
                    inputContainerStyle={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 2, paddingHorizontal: 6, marginVertical: 2 }}
                    rightIcon={
                        <Icon
                            size={20}
                            name={this.state.value.length > 0 ? 'close' : 'search'}
                            onPress={() => {
                                this.setState({
                                    value: ''
                                })
                                this.Inspectorlist();
                            }}

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
            <View style={{ flex: 1 }}>
                <View style={styles.homeContainer}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        refreshControl={
                            <RefreshControl
                                //refresh control used for the Pull to Refresh
                                refreshing={this.state.refreshing}
                                onRefresh={this.onRefresh.bind(this)}
                            />
                        }
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.header}
                        ItemSeparatorComponent={() => {
                            return (<View style={{
                                backgroundColor: colors.gray,
                                height: 0.5, width: '95%', alignSelf: 'center', marginVertical: 10
                            }} />)
                        }}
                    />
                </View>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    rows: {
        flexDirection: 'row',
        width: '95%', alignSelf: 'center', alignContent: 'center', alignItems: 'center'
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
