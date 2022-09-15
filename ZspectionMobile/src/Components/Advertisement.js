import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';
import styles from '../../assets/styles/style.js';


export default class Advertisement extends Component {
	constructor(props) {
	   super(props);
	}

  	render() {
    	return(
    		<View style={styles.advertisementSpace}>
				<Text style={styles.white}>Advertisement Space</Text>
			</View>
    	)
  	}
}

