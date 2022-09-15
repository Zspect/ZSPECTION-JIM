import React, { Component } from 'react';
import { Platform, StyleSheet, View, RefreshControl, LayoutAnimation, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
//import styles from '../../../assets/styles/styles.js';
import {Button, Text, Item, Input} from 'native-base';

import Icon from 'react-native-vector-icons/FontAwesome';

const calls = [
    { id: 1, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 2, name: "Jitendra", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 3, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 3, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
];
export default class CompanyList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: calls,
            favorite: false,
            like: false
        }
    }

    // componentWillMount() {
    //     const { favorite, like } = this.props;
    //     this.setState({ favorite, like });
    // }

    componentWillUpdate() {
        LayoutAnimation.easeInEaseOut();
    }

    searchFilterFunction = text => {
        this.setState({
            value: text
        });

        const newData = calls.filter(item => {
            const itemData = `${item.name.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData); // this will return true if our itemData contains the textData
        });

        this.setState({
            data: newData
        });
    };

    onRefresh() {
        //Clear old data of the list
        this.setState({ data: [] });

    }

    renderItem = ({ item, index }) => {
        const { favorite, like } = this.state;
        return (
            <View>
                <View style={styles.rows}>
                    <Image source={{ uri: item.image }} style={styles.pic} />
                    <View>
                        <View style={styles.nameContainers}>
                            <Text style={styles.nameTxt}>{item.name}</Text>
                        </View>
                        <View style={styles.nameContainers}>
                            <Text style={styles.nameTxt}>{item.status}</Text>
                        </View>
                        <View style={styles.nameContainers}>
                            <Text style={styles.nameTxt}>{item.mobile}</Text>
                        </View>
                    </View>
                    <View style={{ justifyContent: 'center', alignSelf: 'center', alignContent: 'center' }}>
                        <Text style={{ color: 'red', marginBottom: 10 }}>$420</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Icon
                                name={favorite ? 'heart' : 'heart-o'}
                                color={favorite ? '#F44336' : 'rgb(50, 50, 50)'}
                                size={15}
                                style={{ marginRight: 5 }}
                                onPress={() => this.setState({ favorite: !favorite })}
                            />
                            <Icon
                                name={like ? 'circle' : 'circle'}
                                color={like ? 'yellow' : 'rgb(50, 50, 50)'}
                                size={15}
                                style={{ marginRight: 5 }}
                                onPress={() => this.setState({ like: !like })}
                            />
                        </View>
                    </View>
                </View>
                {/* <View style={{ paddingLeft: 10 }}>
                    <Text style={styles.nameTxt}>It is established fact that</Text>
                </View> */}
            </View>
        );
    }

    render() {
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                <View style={styles.homeContainer}>
                    <View style={styles.advertisementSpace}>
                        <Text style={styles.white}>Advertisement Space</Text>
                    </View>
                    <View style={styles.inspectionRequestFormContainer}>
                        <View style={{ marginTop: 20 }}>
                            <Text style={{ color: '#28558E' }}>INSPECTION REQUEST:-</Text>
                        </View>
                    </View>
                    <View style={styles.inspectionRequestFormContainer}>
                        <View style={styles.card}>
                            <Text style={styles.nameTxt}>Woodland Hills</Text>
                            <Text style={styles.nameTxt}>20/07/19</Text>
                        </View>
                        <View style={styles.card}>
                            <Text style={styles.nameTxt}>CA-91367</Text>
                            <Text style={styles.nameTxt}>09:30 PM</Text>
                        </View>
                    </View>
                    <View style={styles.advertisementSpaces}>
                        <Text style={styles.white}>Home Inspection</Text>
                    </View>
                    <View searchBar rounded>
                        <Item style={styles.searchfilter}>
                            <Input placeholder="Search"
                                value={this.state.value}
                                onChangeText={text => this.searchFilterFunction(text)}
                                style={{ backgroundColor: '#fff', borderWidth: 1, borderColor: '#333', borderRadius: 6, height: 35, marginBottom: 5, marginTop: 5, fontSize: 13 }}
                            />
                            <Icon style={styles.icon} name="search" size={18} color="#333" style={{ position: 'absolute', marginLeft: 260 }} />
                            <Icon style={styles.icon} name="plus-square" size={30} color="#333" onPress={() => this.props.navigation.navigate('CreateInspector')} />
                        </Item>
                    </View>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem} />
                </View>
                <View style={styles.center}>
                    {/* <Button style={styles.loginButton} onPress={() => this.Login()}>
                        <Text style={styles.textCenter}>Back</Text>
                    </Button> */}
                    <Button style={styles.loginButton} onPress={() => this.Login()}>
                        <Text style={styles.textCenter}>Next</Text>
                    </Button>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    rows: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#dcdcdc',
        //backgroundColor: '#fff',
        //padding: 6,
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
        marginTop: 20,

    },
    pic: {
        borderRadius: 25,
        width: 50,
        height: 50,
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
    icon: {
        marginLeft: 10,
        padding: 5
    },
    searchfilter: {
        width: 330,
        marginLeft: 10
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
