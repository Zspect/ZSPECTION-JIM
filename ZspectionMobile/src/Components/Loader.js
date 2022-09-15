import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator} from 'react-native';


export default class Loader extends Component {
	constructor(props) {
	   super(props);
	}

  	render() {
    	return(
    		<View style={{flex:1,justifyContent:"center",alignItems:'center'}}>
    			<ActivityIndicator size="large" animating />
				<Text style={{color:'#28558E'}}>Please wait...</Text>
    		</View>
    	)
  	}
}

