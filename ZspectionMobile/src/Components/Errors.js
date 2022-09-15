import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar} from 'react-native';
import styles from '../../assets/styles/style.js';

export default class Errors extends Component {
	constructor(props) {
	   super(props);
	   this.state = {
		   errors: []
	   }
	}
	componentDidMount() {
	//    this.setState({errors: this.props.errors});
	}

	printErrors() {
		if(this.props.errors.length > 0) {
			return this.props.errors.map ( (error, index) => {
				return (
					<Text style={styles.error} key={index}>{error}</Text>
				)
			})
		}
		else {
			return null;
		}
	}
  	render() {
    	return(
    		<View style={styles.errorContainer}>
    			{this.printErrors()}
    		</View>
    	)
  	}
}

