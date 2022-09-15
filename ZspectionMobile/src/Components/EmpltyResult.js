import React, {Component} from 'react';
import {Text, View} from 'react-native';
import style from '../../assets/styles/style.js';


export default class Loader extends Component {
	constructor(props) {
	   super(props);
	}

  	render() {
    	return(
    		<View style={style.noDataFound}>
    			<Text style={{color:'#FFF'}}>No Data Found</Text>
    		</View>
    	)
  	}
}

