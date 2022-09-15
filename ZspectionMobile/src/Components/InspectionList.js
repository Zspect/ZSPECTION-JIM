import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import styles from '../../assets/styles/style.js';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';

export default class InspectionList extends Component {
	constructor(props) {
	   super(props);
	   this.state = {
		   errors: []
	   }
	}
	componentDidMount() {
	
	}
	
  	render() {
        return(
            <View key={this.props.item.inspectionTypeId} style={styles.summarySelectedIspector}>
                <View style={{width:'60%'}}>
                    <Text>11/20/2019</Text>
                    <Text>15:23</Text>
                    <Text>Woodland Hills CA - 91367 Woodland Hills CA - 91367</Text>
                    <Text>$100</Text>
                </View>
                <View style={[styles.center,{width:'40%'}]}>
                    <Avatar
                        rounded
                        source={{
                            uri: this.props.item.ProfilePic,
                        }}
                        size="medium"
                    />
                    <Text style={styles.nameTxt}>Real Estate Agent</Text>
                    <Text style={styles.nameTxt}>Agency name</Text>
                    <Text style={styles.nameTxt}>Inspector name</Text>
                </View>
            </View>
        )
    }
}