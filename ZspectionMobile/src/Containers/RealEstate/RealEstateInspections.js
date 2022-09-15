import React, { Component } from 'react';
import { Platform, StyleSheet, View, Text, StatusBar, ScrollView, BackHandler, TouchableOpacity, FlatList } from 'react-native';
import styles from '../../../assets/styles/style2.js';
import styles2 from '../../../assets/styles/style.js';

import { CheckBox, Avatar, Input, Slider, Icon, Button } from 'react-native-elements';
import Errors from '../../Components/Errors';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import { MatrixButton } from '../../Components/MatrixButtons.js';
import { API } from "../../network/API";
import { showToastMsg } from '../../utils.js';
import { INSPECTION_TYPE } from '../../utils/utils.js';


var priceMatrixArray = [];
var categorySelectedArray = new Set();
export default class RealEstateInspections extends Component {
    constructor(props) {
        super(props)
        this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
        this.state = {
            loading: false,
            inspectionData: []
        }
        this.common = new Common();
    }

    componentDidMount() {

        this.focusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
                console.log("focus>>>> ")
                categorySelectedArray.clear();
                this.getInspectionList()
            }
        );
        this.unfocusSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
            }
        );
    }

    handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    getInspectionList = () => {
        this.setState({ loading: true });
        API.fetchInfectionType(this.infectionType, '')
        // var response = new API('InspectionType', {}).getApiResponse();
        // response.then(result => {
        //     console.log("Result is : ", result)
        //     if (result.status == 200) {
        //         this.setState({ loading: false, inspectionData: result.data });
        //     }
        //     else {
        //         this.setState({ loading: false });
        //         this.common.showToast(result.message);
        //     }
        // })
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
        let arrayDemo = Array.from(categorySelectedArray).sort(this.sortArray)
        let isFindHome = arrayDemo.findIndex((data) => data.id == INSPECTION_TYPE[0].id)
        let isFindPest = arrayDemo.findIndex((data) => data.id == INSPECTION_TYPE[1].id)
        if (isFindPest != -1) {
            if (isFindHome != -1) {
                arrayDemo.splice(isFindPest, 1)
            }
        }
        // this.props.navigation.navigate('Search',
        //     { selectedCategory: arrayNew });
        // this.props.navigation.navigate('Search',
        //     { selectedCategory: Array.from(categorySelectedArray).sort(this.sortArray) });
        this.props.navigation.navigate('Search',
            {
                selectedCategory: arrayDemo,
                mainCategoryArray: Array.from(categorySelectedArray).sort(this.sortArray)
            });

        // this.props.navigation.navigate('Area',{selectedCategory:categorySelectedArray})
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.focusSubscription.remove();
    }

    showButton() {
        if (this.state.inspectionData.length > 0) {
            return (
                <View style={[{ marginTop: 100, justifyContent: "center" }]}>
                    <View style={styles2.nextButtonWrappers}>
                        <Button
                            title="Proceed"
                            buttonStyle={styles2.btnAlone}
                            icon={<Icon name="angle-right" containerStyle={{ position: 'absolute', right: 10 }} type="font-awesome" color="#FFF" />}
                            onPress={() => {
                                [...categorySelectedArray].length === 0 ?
                                    this.common.showToast("Please select at least one Inspection.") :
                                    this.navigateTo()
                            }}
                        />
                    </View>
                </View>
            )
        }

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
                    <MatrixButton onMatrixButtonClick={(isSelected, item) =>
                        this.categoryClick(isSelected, item)}
                        matrixItem={item} iconUri={item.pictureUrl} />
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
                <StatusBar backgroundColor="#28558e" barStyle="light-content" />
                <Text style={{ textAlign: "center", color: "#67778b", paddingVertical: 15, fontSize: 14 }}>You can select more than one</Text>
                {this.showCategoryRadioButtons()}

                {this.showButton()}
            </ScrollView>

        );
    }
}
