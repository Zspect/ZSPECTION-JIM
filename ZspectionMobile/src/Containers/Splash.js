import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import styles from '../../assets/styles/style.js';
import DeviceInfo from 'react-native-device-info';


export default class Splash extends Component {
	constructor(props) {
	   super(props);
	   this.state={
		   version:"123"
	   }
	}
	componentDidMount(){
		
		console.log("componentDidMount")

		//DeviceInfo.getVersion().then((val)=>{this.setState({version:val})})
	}
  	render() {
    	return (
        <View style={styles.splash}>
        	<Image style={styles.imageThumbnail} resizeMode="contain" source = {require('../../assets/images/splash_2.jpg')} />
			<Text style={{color:'#fff', position:'absolute', bottom:0,  alignSelf:'center', justifyContent:'center'}}>{this.state.version}</Text>
			<StatusBar backgroundColor="#28558E" barStyle="light-content" />
	    </View>
    	);
  	}
  getAuth() {
	this.props.navigation.navigate('AuthStack');
  }
}