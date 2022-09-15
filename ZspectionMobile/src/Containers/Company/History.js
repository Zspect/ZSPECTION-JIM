import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import styles from '../../../assets/styles/style.js';
import {
    Container, Header, Content, Button, Card, CardItem,
    Text, Body, Form, Item, Input, Picker
} from 'native-base';

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return null;
        return (
            <ScrollView>
                <View style={styles.homeContainer}>
                    <Text>Home screen</Text>
                    <Button onPress={() => this.props.navigation.navigate('Logout')}>
                        <Text>Logout</Text>
                    </Button>
                </View>
            </ScrollView>
        );
    }
}