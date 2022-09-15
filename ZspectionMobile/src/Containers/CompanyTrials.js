import React, {Component} from 'react';
import {Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity, FlatList} from 'react-native';

import { Container, Header, Content,  Card, CardItem, Right, Left, Switch,
	 Text, Body, Title, Form, Item, Toast,  } from 'native-base';

import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import {Dimensions } from "react-native";
const screenWidth = Math.round(Dimensions.get('window').width);
const screenHeight = Math.round(Dimensions.get('window').height);
import moment from "moment";
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class CompanyTrials extends Component {
	    constructor(props) {
        super(props)
        this.state={
            loading:false,
            trialDays:"",
            trialExpiryDate:"",
        }
        this.common = new Common();
    }
    async componentDidMount(){
      let trialDay = await AsyncStorage.getItem("trialDays")
      let expiryDate = await AsyncStorage.getItem("trialExpiryDate")
      this.setState({trialDays:trialDay,trialExpiryDate:moment(expiryDate,'YYYY-MM-DD').format("MM/DD/YYYY")})
    }
    render() {
        if (this.state.loading) {
            return <Loader />
        }
     return (
        <ScrollView contentContainerStyle = {trialStyle.container} ref={(ref) => {this.scroll = ref}}>
            <Header style={{backgroundColor:'#28558e'}}>
            <Body style={{justifyContent:'center', alignItems:'center'}}>
                <Title style={{fontSize:screenHeight*2.8/100,fontWeight:"bold"}}>Trial Version</Title>
            </Body>
            </Header>
            <StatusBar backgroundColor="#28558e" barStyle="light-content" />
               <Text style={trialStyle.thankYouText}>Thank You for signing up with ZSPECTION.</Text>
               <Text style={trialStyle.verifyText}>Please verify your email address.</Text>
               <View style={trialStyle.centerBoxContainer}>
                 <View style={trialStyle.dayContainer}>
                    <Text style={trialStyle.dayText}>{this.state.trialDays}</Text>
                 </View>
                 <Text style={trialStyle.remainingText}>Days remaining</Text>
                 <Text style={trialStyle.verifyText}>Your{" "+this.state.trialDays+" "} days trial ends on {" "+this.state.trialExpiryDate}.</Text>
                 <Text style={trialStyle.remainingText}>We look forward to providing you with a simple way for generating new business.</Text>
                 <TouchableOpacity style = {trialStyle.buttonStyle} onPress={()=>{this.props.navigation.navigate("CreateInspector")}}>
                   <Text style={trialStyle.buttonText}>Setup Inspectors</Text>
                 </TouchableOpacity>
               </View>
	    </ScrollView>
        
     );
  }
}

const trialStyle = StyleSheet.create({
    container:{
        flex:1,
    },

    thankYouText: {
        fontSize: screenHeight*2.7/100,
        color:"#28558e",
        marginTop:screenHeight*6/100, 
        textAlign:"center",
        fontWeight:'bold'
    },
    verifyText: {
        fontSize: screenHeight*1.9/100,
        color:"#67778b",
        marginTop:screenHeight*6/100, 
        textAlign:"center",
    },
    remainingText: {
        fontSize: screenHeight*1.9/100,
        color:"#67778b",
        textAlign:"center",
        marginTop:10,
    },
    centerBoxContainer:{
        //  position: 'absolute', 
        //  top: 0, left: 0, 
        //  right: 0, bottom: 0, 
         marginTop:screenHeight*12/100, 
         justifyContent: 'center', 
         alignItems: 'center',
    },
    dayContainer:{
        backgroundColor:"#f3f3f3",
        width:screenHeight*16/100,
        height:screenHeight*15/100,
        alignSelf:"center",
        justifyContent:"center",
    },
    dayText:{
        alignSelf:'center',
        color:"#838b95",
        fontSize:screenHeight*6/100, 
        fontWeight:'bold'
    },
    buttonStyle:{
        backgroundColor:"#28558e",
        borderRadius:5,
        marginTop: screenHeight*6/100, 

    },
    buttonText:{
        fontSize: screenHeight*2.3/100,
        color:"#fff",
        textAlign:"center",
        fontWeight:'bold',
        paddingLeft:screenWidth*13/100,
        paddingRight:screenWidth*13/100,
        paddingTop:screenHeight*1.5/100,
        paddingBottom:screenHeight*1.5/100,
    }
});  