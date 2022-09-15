import React, { Component } from 'react';
import { Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../assets/styles/style2.js';
import styles2 from '../../assets/styles/style.js';
import {
    Container, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Title, Form, Item, Toast,
} from 'native-base';
import { CheckBox, Avatar, Input, Slider, Icon, Button } from 'react-native-elements';
import Errors from '../Components/Errors';
import Loader from '../Components/Loader';
import Common from '../Containers/Common';
import { MatrixButton } from '../Components/MatrixButtons.js';
import { HomeMatrix } from '../Components/HomeMatrix.js';
import { API } from "../network/API";
var priceMatrixArray = [];
var categorySelectedArray = new Set();
let refinedArray = [];



export default class CompanyInspections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            inspectionData: []
        }
        this.common = new Common();
    }
    componentDidMount() {
        this.getInspectionList()
    }
    getInspectionList = () => {
        this.setState({ loading: true });
        API.fetchInfectionType(this.infectionType, '')
        // var response = new API('InspectionType', {}).getApiResponse();
        //         response.then( result => {
        //             if(result.status == 200) {
        //                 this.setState({loading: false,inspectionData:result.data});
        //             }
        //             else {
        //                 this.setState({ loading: false });
        //                 this.common.showToast(result.message);
        //             }
        //         })
    }

    infectionType = {
        success: (response) => {
            console.log("login_res>>>", response)
            this.setState({ loading: false, inspectionData: response.data });
        },
        error: (error) => {
            console.log("login_res_error>>>", error)
            showToastMsg(error.message);
        }
    }


    sortArray = (a, b) => {
        const orderA = a.orderNo;
        const orderB = b.orderNo;
        let comparison = 0;
        if (orderA > orderB) {
            comparison = 1;
        } else if (orderA < orderB) {
            comparison = -1;
        }
        return comparison;
    }
    navigateTo = () => {
        let categoryData = Array.from(categorySelectedArray).sort(this.sortArray)
        console.log("Original Array : ", categorySelectedArray);
        console.log("Sorted Array : ", categoryData);
        this.props.navigation.navigate("RegisterPriceMatrix", { selectedCategory: categoryData });
    }
    showButton() {
        return (
            <View style={[{ marginTop: 100, justifyContent: "center" }]}>
                <View style={styles2.nextButtonWrappers}>
                    <Button
                        title="Set Price Matrix"
                        buttonStyle={styles2.btnAlone}
                        icon={<Icon name="angle-right" containerStyle={{ position: 'absolute', right: 10 }} type="font-awesome" color="#FFF" />}
                        onPress={() => { [...categorySelectedArray].length === 0 ? this.common.showToast("Please select at least one Inspection.") : this.navigateTo() }}
                    />
                </View>
            </View>
        )
    }
    categoryClick = (isSelected, item) => {
        isSelected === true ? categorySelectedArray.add(item) : categorySelectedArray.delete(item)
        console.log("Now category array : ", categorySelectedArray);
    }
    showCategoryRadioButtons = () => {
        return (
            <FlatList
                data={this.state.inspectionData}
                renderItem={({ item }) => (
                    <MatrixButton onMatrixButtonClick={(isSelected, item) => this.categoryClick(isSelected, item)} matrixItem={item} iconUri={item.pictureURL} />
                )}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        )
    }
    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <ScrollView ref={(ref) => { this.scroll = ref }}>
                <Header style={{ backgroundColor: '#28558e' }}>
                    <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Title style={{ fontSize: 22, fontWeight: "bold" }}>Select Inspections you perform</Title>
                    </Body>
                </Header>
                <StatusBar backgroundColor="#28558e" barStyle="light-content" />
                <Text style={{ textAlign: "center", color: "#67778b", paddingVertical: 15, fontSize: 14 }}>You can select more than one.</Text>
                {this.showCategoryRadioButtons()}
                {this.showButton()}
            </ScrollView>

        );
    }
}
