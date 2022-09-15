import React, { Component } from 'react';
import { Platform, StyleSheet, View, StatusBar, ScrollView, Image, Text, TouchableOpacity, ImageBackground } from 'react-native';
import styles from '../../assets/styles/style.js';
import { COMPANY_ROLE, INSPECTOR_ROLE, REAL_AGENT_ROLE } from '../utils.js';

export default class Register extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }
    render() {

        return (
            <ImageBackground source={require('../../assets/images/background.png')} style={{ flex: 1 }}>
                <View style={styles.homeLogoWrapper}>
                    <Image source={require('../../assets/images/logo.png')} />
                </View>
                <View style={styles.homeMiddleWrapper}>
                    <View style={styles.homeBlueWrapper}>
                        <Text style={styles.homeAreText}>Select Your Role Below</Text>
                    </View>
                </View>
                <View style={styles.homeBottomWrapper}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login', { role: REAL_AGENT_ROLE })} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source={require('../../assets/images/real_estate.png')} />
                        <Text style={styles.bottomText}>Real Estate Agent</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login', { role: COMPANY_ROLE })} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source={require('../../assets/images/inspection_company.png')} />
                        <Text style={styles.bottomText}>Inspection Company</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Login', { role: INSPECTOR_ROLE })} style={styles.bottomRoleContainer}>
                        <Image style={styles.bottomImage} source={require('../../assets/images/inspector.png')} />
                        <Text style={styles.bottomText}>Inspector</Text>
                    </TouchableOpacity>
                </View>
                <StatusBar backgroundColor="#28558E" barStyle="light-content" />
            </ImageBackground>
        );
    }
}