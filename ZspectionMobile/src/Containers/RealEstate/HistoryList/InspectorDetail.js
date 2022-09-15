import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../../../assets/styles/style.js';

import { Avatar, Icon, Overlay, Rating, CheckBox, Button } from 'react-native-elements';
import Common from '../../Common';
import Loader from '../../../Components/Loader';
import API from '../../../Api/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class CompanyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            item: [],
            availability: [],
            history: [],
            rating: 0,
            showRateButton: true
        }
        this.common = new Common();
    }

    componentDidMount() {
        var inspector = this.props.navigation.getParam('inspector');
        if(inspector!==undefined){
            this.setState({
                loading: true,
                history: inspector,
                showRateButton: inspector.InsStatus == "Completed" ? true : false
            })
            this.common.getInspectorDetail(inspector.InspectorId).then(ins => {
                this.setState({
                    item: ins.result.inspector,
                    loading: false,
                    availability: ins.result.inspector_availability || []
                })
                console.log("getInspectorDetail: ", ins, inspector);
            })
        }
    }

    
    showAvailability = ({item, index}) => {
        return(
            <View style={[styles.twoRow, styles.lineSpacing]}>
                <Text style={[styles.threeRow, styles.primaryColor, styles.nameTxt2]}>{item.DayName}</Text>
                <Text style={styles.nameTxt2}>{item.StartTime}    -    {item.EndTime}</Text>
            </View>
        )
    }

    async rateInspector() {
        if(!this.state.rating) {
            this.common.showToast('Select rating')
            return null;
        }
        var profile = JSON.parse(await AsyncStorage.getItem("profile"));
		var authToken = await AsyncStorage.getItem("authToken");
        var header = {"authentication":authToken};
        
        var request = {
            "inspectionid":this.state.history.InspectionId,
            "inspectorid":this.state.history.InspectorId,
            "agnetid":profile.AgentId,
            "rating":this.state.rating
        }
        var response = new API('InspectorRating',request,header).getResponse();
        response.then(result => {
            console.log("result: ",result)
            if(result.statuscode == 200) {
                this.common.showToast('Rate this Inspector Successfully')
                this.rating.readonly = true
                this.setState({showRateButton: false})
            }
            else {
                this.common.showToast(result.message)    
            }
        }).catch(error => {
            console.log("error: ",error)
            this.common.showToast('Something went wrong, please try again later')
        })
    }

    render() {
        if(this.state.loading) return <Loader />
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.summarySelectedIspector]}>
                    <View style={[styles.center,{width:80}]}>
                        <Avatar
                            rounded
                            source={{
                                uri: this.state.item.ProfilePic,
                            }}
                            size="large"
                            icon={{ name: 'user', type: 'font-awesome' }}
                            containerStyle={{marginBottom:10}}
                        />
                        <View>
                            <Rating
                                ratingCount={5}
                                imageSize={16}
                                readonly={!this.state.showRateButton}
                                startingValue={this.state.history.InspectorRating ? this.state.history.InspectorRating : 0}
                                onFinishRating={(rating) => this.setState({rating: rating})}
                                ref={(ref) => this.rating = ref}
                            />
                            {this.state.showRateButton && <TouchableOpacity onPress={() => this.rateInspector()}>
                            <Text style={[styles.nameTxt2, {textAlign:'center', marginTop:10}]}>Rate Inspector</Text>
                            </TouchableOpacity>}
                            
                        </View>
                    </View>
                    <View style={styles.flatListItemTextRow}>
                        <Text style={styles.nameTxt2}>{this.state.item.Name}</Text>
                        <Text style={styles.nameTxt2}>{this.state.item.EmailId}</Text>
                        <Text style={styles.nameTxt2}>{this.common.formatPhoneNumber(this.state.item.MobileNo)}</Text>
                        <Text style={styles.nameTxt2}>$ {this.state.history.Price}</Text>
                        
                    </View>
                </View>
                <Text style={[styles.heading2,styles.mtop15]}>Bio</Text>
                <Text style={styles.font15}>{this.state.history.CompanyBio}</Text>
                <Text style={[styles.heading2,styles.mtop15]}>Job Schedule</Text>
                <View>
                    <FlatList
                        data={this.state.availability}
                        renderItem={this.showAvailability}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
            </ScrollView>
        );
    }
}