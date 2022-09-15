import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../../assets/styles/style.js';
import {Container} from 'native-base';
import FavoritesSchedule from '../../Components/FavoritesSchedule';
export default class Schedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [
                { id: 1, name: "Vaun Nicolus", title: "FFR Inspection", description: "FFR Inspection is an independent 3rd Party conformity Assesment Service Company, Working on behalf of our valued clients.. " },
                { id: 2, name: "Ziasi Komebi", title: "SMR Inspection", description: "Inspection services from SMR help you to reduce risk and ensure quality and accuracy as well as meeting regulatory requirements." },
                { id: 3, name: "Piter De Linza", title: "TIC Inspection", description: "The Inspection Company Ltd has been founded in 2007 with the aim to avoid buyers risk on purchasing goods from Asia and improve qualities.." },
            ]
        }
    }

    renderItem = ({ item, index }) => {
        return <FavoritesSchedule item={item} />
    }

    render() {

        return (
            <Container style={{ backgroundColor: '#e0e0d1' }}>
                <FlatList
                   data={this.state.data}
                   keyExtractor={(item, index) => `${index}`}
                   renderItem={this.renderItem}
                />
            </Container>
        )
    }
}
