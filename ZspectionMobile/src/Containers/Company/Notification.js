import React, { Component } from 'react';
import { Platform, StyleSheet, View, RefreshControl, LayoutAnimation, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
//import styles from '../../../assets/styles/styles.js';

import { SearchBar, ListItem } from 'react-native-elements';

const list = [
    { id: 1, message: "This is notification", created_on: '2019-11-06 14:54:45', status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 2, message: "This is notification", created_on: '2019-11-01 14:54:45', status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 3, message: "This is notification", created_on: '2019-11-01 14:54:45', status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
    { id: 4, message: "This is notification", created_on: '2019-11-01 14:54:45', status: "Bobs Home Inspection", image: "https://bootdey.com/img/Content/avatar/avatar7.png", mobile: "8929822933", favorite: "" },
];
export default class Notification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            data: [],
        }
    }

    componentDidMount() {
        this.setState({ data: list });
    }

    keyExtractor = (item, index) => index.toString()

    renderItem = ({ item }) => (
        <ListItem
            title={item.message}
            subtitle={item.status}
            bottomDivider
            chevron
        />
    )

    render() {
        return (
            <FlatList
                keyExtractor={this.keyExtractor}
                data={this.state.data}
                renderItem={this.renderItem}
            />
        )
    }


};    
