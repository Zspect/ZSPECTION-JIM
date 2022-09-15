import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar} from 'react-native';
import { connect, useSelector } from 'react-redux';

class Test extends Component {
	constructor(props) {
	   super(props);
	   this.state = {
		   counter: 0
	   }
	}

	componentDidMount() {
		this.setData()
	}

	setData() {
		// const counter = useSelector(state => this.state.counter)
		// console.log("counter redux: ",counter)
	}
	
  	render() {
		console.log("counter: ",this.state.counter)
    	return(
    		<View>
    			<Text>Kausar</Text>
    		</View>
    	)
  	}
}

// function mapStateToProps(state) {
// 	return {
// 		counter: state.counter
// 	}
// }

export default Test;