import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity} from 'react-native';
import styles from '../../../assets/styles/style.js';
import {Root, Container, Toast, Header, Content, Button, Card, CardItem, Right, Left, Switch,
	 Text, Body, Form, Item, Picker } from 'native-base';

import { CheckBox, Avatar, Icon, Input, Slider } from 'react-native-elements';
import Errors from '../../Components/Errors';
import API from '../../Api/Api';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class UpdatePriceMatrix extends Component {
	constructor(props) {
        super(props)
        this.state = {
            foundation: '',
            category: '',
            errors:[],
            matrixRow:1,
            loading: false,
            submit: false,
            priceMatrix: [],
            foundationList: [],
            categoryList: [],
            
        }
        this.common = new Common();
	}
    componentDidMount()
	{
        var request = this.props.navigation.getParam('request');
        this.getFoundation(request);
    }

    async getFoundation(request) {
        this.common.getCompanyFoundation().then(foundation => {
            this.setState({
                foundationList: foundation.result.foundation,
                priceMatrix: foundation.result.company_price_metrix,
                matrixRow: foundation.result.company_price_metrix.length
            })
        }) 
    }

    async getCategory(foundationId) {
        this.setState({foundation:foundationId})
        if(foundationId) {
            this.common.getCompanyCategory(foundationId).then(category => {
                console.log("category: ",category.result.foundationcategory);
                this.setState({categoryList: category.result.foundationcategory, category: ''})
            })    
        }
        else {
            this.setState({categoryList: [], category: ''})
        }
        
    }

    validateItem(item) {
        var res = true;
        for (var key in item) {
            if(item[key]) {
                for (var key2 in item) {
                    if(key2 != "InspectorId")
                        if(!item[key2]) res = false
                }
            }
        }
        return res;
    }
    
	validate = () => {
        var messages = [];
        this.setState({submit:true});
		messages.push(!this.state.foundation  && 'Select Foundation');
        messages.push(!this.state.category  && 'Select Category');
        messages.push(!this.state.priceMatrix.length  && 'Enter Price Matrix');
        var priceMatrixError = '';
        this.state.priceMatrix.map( (item) => {
           if(!this.validateItem(item)) priceMatrixError="Enter all values of Maxtrix row"
        })
        messages.push(priceMatrixError);

        var errorShow = [];
		messages = messages.filter( (msg) => {
			if(msg) {
				return msg;
			}
        })
        
        for(var i=0; i<messages.length; i++) {
			var required = messages[i].indexOf('required');
			if(required > 0) {
				
			}
			else {
				errorShow.push(messages[i]);
			}
        }
        
		this.setState({ errors: errorShow});
		if(messages.length > 0) {
			return false;
		}
		else {
			return true;
		}
    }

    onRegister = async () => {
		if(this.validate()) {
            this.setState({loading: true});
            var authToken = await AsyncStorage.getItem("authToken");
            await this.getRequestData().then( data => {
                console.log("request data: ",data);
                var header = {"authentication":authToken};
                var response = new API('RegisterInspector',data,header).getResponse();
                response.then( result => {
                    console.log("request: ",data,"response: ",result);
                    if(result.statuscode == 200) {
                        // alert(result.message)
                        Toast.show({
                            text: result.message,
                            position: "bottom",
                            type: 'success',
                            duration: 3000
                        })
                        setTimeout( () => {
                            this.props.navigation.navigate('Inspector',{"profile":1});
                        },2000);
                    }
                    else {
						var errors = [];
                        errors.push(result.message);
						this.setState({errors: errors})
				    }
                })
            });
            this.setState({loading: false});
		}
		return false;
    }

    async getRequestData() {
        var request = this.props.navigation.getParam('request');
        var newRequest = {
            "foundationid": this.state.foundation,
            "foundationcategory": this.state.category,
            "pricemetrix": this.state.priceMatrix
        }
        return {...request,...newRequest}        
    }

    addMoreRow() {
        var rows = [];
        for(var i=0;i<this.state.matrixRow;i++) {
            rows.push(this.Row(i))
        }
        return rows;
    }

    updateMatrix = (index,value,field) => {
        var list = this.state.priceMatrix;
        var item = list[index];
        if(!item) {
            item = {"InspectorId":0,"AreaStart":0,"AreaEnd":0,"Price":0};
            list.push(item);
        }
        item = list[index];
        item[field] = value;
        this.forceUpdate();        
    }

    Row = (index) => {
        var item = this.state.priceMatrix[index];
        var AreaStart,AreaEnd,Price;

        if(item) {
            AreaStart = item.AreaStart
            AreaEnd = item.AreaEnd
            Price = item.Price
        }
        return(
            <View style={styles.sectionMatrixRow} key={index}>
                <View style={styles.matrixNumber}>
                    <Input value={AreaStart} onChangeText={(value) => this.updateMatrix(index,value,"AreaStart")} keyboardType="numeric" inputContainerStyle={{borderBottomWidth:0}} inputStyle={styles.matrixInput1} />
                </View>
                <View style={styles.dash}></View>
                <View style={styles.matrixNumber}>
                    <Input value={AreaEnd} onChangeText={(value) => this.updateMatrix(index,value,"AreaEnd")} keyboardType="numeric" inputContainerStyle={{borderBottomWidth:0}} inputStyle={styles.matrixInput1} />
                </View>
                <View style={[styles.sectionColumnMatrix]}>
                    <Input value={Price} onChangeText={(value) => this.updateMatrix(index,value,"Price")} keyboardType="numeric" inputContainerStyle={{borderBottomWidth:0}}  inputStyle={styles.matrixInput2} />
                </View>
            </View>
        )
    }

    render() {
    if(this.state.loading) {
        return <Loader />
    }

   
    return (
        <Root>
    	<ScrollView>
	        <View style={styles.registerFormContainer}>
                <Form>
                    <Errors errors={this.state.errors} />
                    <Item>
                        <Picker
                            mode="dialog"
                            selectedValue={this.state.foundation}
                            onValueChange={ (value) => this.getCategory(value)}
                        >
                            <Picker.Item label="Select Foundation" value="" />
                            {this.state.foundationList.map(foundation =>  <Picker.Item key={foundation.Id} label={foundation.Name} value={foundation.Id} />)}
                        </Picker>
                    </Item>
                    <Item>
                        <Picker
                            mode="dialog"
                            selectedValue={this.state.category}
                            onValueChange={ (value) => this.setState({category:value})}
                        >
                            <Picker.Item label="Select Category" value="" />
                            {this.state.categoryList.map(category =>  <Picker.Item key={category.Id} label={category.Name} value={category.Id} />)}
                        </Picker>
                    </Item>
                    <Item style={[styles.formItem,{marginTop:20, marginBottom:20}]}>
                        <View style={styles.twoRow}>
                            <Text>Set Area (sqr mtr) :-</Text>
                            <Text>Set Price ($) :-</Text>
                        </View>
                    </Item>
                    {this.addMoreRow()}
                    <View style={[{marginTop:20,alignItems:'flex-end'}]}>
                    <Button transparent onPress={() => this.setState({matrixRow:this.state.matrixRow+1})}>
                        <Text style={styles.addMore}>Add more:-</Text>
                    </Button>
                    </View>
                   
                </Form>
	        </View>
	    </ScrollView>
        </Root>
    );
  }
}