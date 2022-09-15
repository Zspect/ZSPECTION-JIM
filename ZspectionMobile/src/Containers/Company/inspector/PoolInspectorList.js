import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Input, Picker,
} from 'native-base';
import { CheckBox, Avatar, SearchBar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';


const calls = [
    { id: 1, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", Mobile: "8210333218" },
    { id: 2, name: "Jitendra", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", Mobile: "8929822933" },
    { id: 3, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", Mobile: "8210333218" },
    { id: 3, name: "Kristin", status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", Mobile: "8210333218" },
];
export default class PoolInspectorList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: calls,
            refreshing: false
        }
    }

    static navigationOptions = {
        header: null
    }


    searchFilterFunction = text => {
        this.setState({
            value: text
        });

        const newData = calls.filter(item => {
            const itemData = `${item.name.toUpperCase()}${item.status.toUpperCase()}${item.Mobile.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData); 
        });

        this.setState({
            data: newData
        });
    };


    onRefresh() {
        this.setState({ data: [] });
      }

    renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity>
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
                                <Text style={styles.nameTxt}>{item.Mobile}</Text>
                            </View>
                        </View>
                        <View style={styles.content}>
                            <Text style={{ color: 'red' }}>$420</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Icon name="heart" size={15} color="yellow" style={{ marginRight: 5 }} />
                                <Icon name="circle" size={15} color="yellow" />
                            </View>
                        </View>
                    </View>
                    {/* <View style={{ paddingLeft: 10 }}>
                    <Text style={styles.nameTxt}>It is established fact that</Text>
                </View> */}
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return (
            <ScrollView
            refreshControl={
                <RefreshControl
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
                        <Text style={styles.white}>Pool Inspection</Text>
                    </View>
                    <View searchBar rounded>
                        {/* <Item style={styles.searchfilter}>
                            <Input placeholder="Search"
                                value={this.state.value}
                                onChangeText={text => this.searchFilterFunction(text)}
                                style={styles.inputsearch} />
                            <Icon style={styles.icon} name="plus-square" size={30} color="#333" onPress={() => this.props.navigation.navigate('CreateInspector')} />
                        </Item> */}
                        <Item style={styles.searchfilter}>
                        <Input placeholder="Search"
                        value={this.state.value}
                        onChangeText={text => this.searchFilterFunction(text)}
                        style={{ backgroundColor: '#fff', borderWidth:1, borderColor:'#333', borderRadius: 6, height: 35, marginBottom: 5, marginTop: 5, fontSize:13 }} 
                        />
                        <Icon style={styles.icon} name="search" size={18} color="#333" style={{position:'absolute', marginLeft:260}} />
                        <Icon style={styles.icon} name="plus-square" size={30} color="#333" onPress={() => this.props.navigation.navigate('CreateInspector')}/>
                    </Item>
                    </View>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem} />
                </View>
                <View style={styles.center}>
                    <Button style={styles.loginButton} onPress={() => this.props.navigation.navigate('Inspector')}>
                        <Text style={styles.textCenter}>Back</Text>
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
        justifyContent: 'space-between',
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
        marginTop: 20,

    },
    inputsearch: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#333',
        borderRadius: 6,
        height: 34,
        marginBottom: 5,
        marginTop: 5,
        fontSize: 13
    },
    content: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center'
    },
    search: {
        width: 300,
        justifyContent: 'center',
        alignSelf: 'center'
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
    searchfilter: {
        width: 330,
        marginLeft: 10
    },
    icon: {
        marginLeft: 10,
        padding: 5
    },

});    
