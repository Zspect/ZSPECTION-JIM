import React, { Component } from 'react';
import {
    Platform, StyleSheet, View, StatusBar, ScrollView, Image, TouchableOpacity,
    FlatList, Dimensions, BackHandler, TextInput
} from 'react-native';
import {
    Container, Header, Content, Card, CardItem, Right, Left, Switch,
    Text, Body, Title, Form, Item, Toast, Picker
} from 'native-base';

// import {Picker} from '@react-native-picker/picker';
// import {Picker} from '@react-native-community/picker';
import Loader from '../../Components/Loader';
import Common from '../../Containers/Common';
import { API } from "../../network/API";
import { color } from 'react-native-reanimated';
import colors from '../../utils/colors';
import { showToastMsg } from '../../utils';
import { INSPECTION_TYPE, range } from '../../utils/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import strings from '../../utils/strings';

let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;
let squareFootateResponse;
let numberOfUnitResponse;
let itemMain = undefined;
let agentID = 0
let roleID = 0
export default class InspectionArea extends Component {
    constructor(props) {
        super(props)
        let newArray = Array.from(this.props.navigation.state.params.selectedCategory);
        let data = [];
        let isPushed = false;

        newArray.map((item) => {
            data.push(item)
            // if ((item.id == 9 && isPushed == false)) {
            //     console.log("ispushed : ", isPushed)
            //     console.log("Adding item  in if : ", item.name)
            //     isPushed = true;
            //     item = {};
            //     item['id'] = item.id;
            //     item['name'] = item.name;
            //     item['orderNo'] = item.orderNo;
            //     item['pictureURL'] = item.pictureURL;
            //     item['modifiedOn'] = item.modifiedOn;
            //     item['foundationTypeRequired'] = true;
            //     item['isActive'] = item.isActive;
            //     data.push(item)
            // } else if ((item.id == 10 && isPushed == false)) {
            //     console.log("ispushed : ", isPushed)
            //     console.log("Adding item  in if : ", item.name)
            //     isPushed = true;
            //     item = {};
            //     item['id'] = item.id;
            //     item['name'] = item.name;
            //     item['orderNo'] = item.orderNo;
            //     item['pictureURL'] = item.pictureURL;
            //     item['modifiedOn'] = item.modifiedOn;
            //     item['foundationTypeRequired'] = true;
            //     item['isActive'] = item.isActive;
            //     data.push(item)
            // }
            //  else if (item.id !== 9 && item.id !== 10) {
            //     console.log("Adding item in else : ", item.name)
            //     data.push(item)
            // }
        })
        console.log("dsadsadajda >", data)

        this.state = {
            loading: false,
            categoryArray: data,
            homeAreaVal: '',
            homeAreaError: null,
            pestAreaVal: '',
            pestAreaError: null,
            homePropertyVal: '',
            homePropertyError: null,
            pestPropertyVal: '',
            pestPropertyError: null,
            homeFoundationVal: '',
            homeFoundationError: null,
            pestFoundationVal: '',
            pestFoundationError: null,
            roofCountVal: '',
            roofCountError: null,
            poolCountVal: '',
            poolCountError: null,
            chimneyCountVal: '',
            chimneyCountError: null,
            index: 0,
            buttonText: "Continue for ",
            btnImage: '',
            currentItem: {},
            errors: [],
            foundationList: [],
            propertyList: [],
            foundationList: [],
            areaList: [],
            unitList: [],
            noOfPrice: '',
            noOfStrories: '',
            noOfPool: '',
            noOfChim: '',
            chimenyTypeList: [],
            slectChimney: '',
            selectPoolVal: '',
            selectRofVal: '',
            poolNoList: range(1, 2),
            roofPropertyVal: '',
            noOfChimneyList: range(1, 2),

        }
        this.common = new Common();

    }

    handleBack = () => {
        let totalCount = this.state.categoryArray.length;
        if (this.state.index !== 0) {
            console.log("Index : ", this.state.index)
            this.setState({ index: this.state.index - 1 }, () => {
                console.log("Current item", this.getCurrentItem(this.state.index))
                this.manageButtonText();
            })
        } else {
            this.props.navigation.pop();
        }
        return true;
    }
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerLeft: (<TouchableOpacity onPress={() => params.backHandle()}>
                <Image source={require('../../../assets/images/back_white.png')} style={styles.backButton} />
            </TouchableOpacity>)
        }
    }
    manageButtonText = () => {
        let totalCount = this.state.categoryArray.length;
        if (this.state.index !== totalCount - 1) {
            let name = this.state.categoryArray[this.state.index + 1].name
            let iMageName = ''
            switch (name) {
                case "Home":
                    // iMageName=require("../../../assets/images/Home.png")
                    break;
                case "Pest":
                    // iMageName=require("../../../assets/images/Pest.png")
                    break;
                case "Pool":
                    iMageName = require("../../../assets/images/pool_white.png")
                    break;
                case "Roof":
                    iMageName = require("../../../assets/images/roor_white.png")
                    break;
                case "Chimney":
                    iMageName = require("../../../assets/images/chimney_white.png")
                    break;
            }
            this.setState({ buttonText: "Continue for " + name, btnImage: iMageName })
        } else {
            this.setState({ buttonText: "Search Inspector", btnImage: '' })
        }
    }


    priceMatrixRes = {
        success: (response) => {
            console.log("price_matrix_data", response)

            if ((itemMain.id == 9 || itemMain.id == 10)) {
                this.setState({
                    areaList: response.data
                })
            } else if ((itemMain.id == 11 || itemMain.id == 12 || itemMain.id == 14)) {
                console.log("adskjdkjadksada >>", itemMain, response.data)
                this.setState({
                    unitList: response.data,
                    loading: false
                })
            }
        },
        error: (error) => {
            console.log("price_matrix_data_error>>>", error)
        }
    }

    getData = async (item) => {
        itemMain = item
        // this.setState({ loading: true })

        //API.fetchPriceMatrixInfectionType(this.priceMatrixRes, item.id)

        if ((item.id == 9 || item.id == 10)) {
            // let propertyTypeResponse = await new API('PropertyTypeForAgent', {}).
            //     getApiResponse('/' + item.foundationTypeRequired);
            // let foundationTypeResponse = await new API('FoundationType', {}).getApiResponse('/' + item.foundationTypeRequired);
            // let squareFootateResponse = await new API('PriceMatrix', {}).getApiResponse('/' + 10);
            API.fetchAreaRange(this.priceMatrix, '')
            API.fetchPropertyTypeTax(this.propertyTypeTax, '')

            API.fetchFoundationType(this.founddationType, '')
            // if (foundationTypeResponse.status == 200 && squareFootateResponse.status == 200 && propertyTypeResponse.status == 200) {
            //     this.setState({
            //         propertyList: propertyTypeResponse.data,
            //         foundationList: foundationTypeResponse.data,
            //       //  areaList: squareFootateResponse !== undefined ? squareFootateResponse.data[0].priceMatrix : [],
            //         loading: false
            //     })
            // }
        }
        else if ((item.id == 11 || item.id == 12)) {

            API.fetchAreaRange(this.priceMatrix, '')
            API.fetchPropertyTypeTax(this.propertyTypeTax, '')

            // numberOfUnitResponse = await new API('PriceMatrix', {}).getApiResponse('/' + 14);
            // if (numberOfUnitResponse.status == 200) {
            //     this.setState({
            //         unitList: numberOfUnitResponse !== undefined ? numberOfUnitResponse.data[0].priceMatrix : [],
            //         loading: false
            //     })
            // }
        }
        else if (item.id == 14) {
            API.fetchChimneyType(this.chimneyTypeRes, '')
        }
        else {
            var errors = [];
            this.setState({ errors: errors, loading: false })
        }
        console.log("Property response : ", this.state.propertyList)
        console.log("Foundation response : ", this.state.foundationList)
        console.log("Area response : ", this.state.areaList)
        console.log("Unit response : ", this.state.unitList)
    }

    chimneyTypeRes = {
        success: (response) => {
            console.log("CH_inspector >>>", response)
            this.setState({
                chimenyTypeList: response.data
            })

        },
        error: (error) => {
            console.log("company_inspector_error>>>", error)
            this.setState({
                chimenyTypeList: []
            })
        }
    }

    propertyTypeTax = {
        success: (response) => {
            console.log("property_type_tax", response)
            this.setState({
                propertyList: response.data
            })
        },
        error: (error) => {
            console.log("property_type_tax_error>>>", error)
        }
    }

    founddationType = {
        success: (response) => {
            console.log("price_matrix", response)
            this.setState({
                foundationList: response.data
            })
        },
        error: (error) => {
            console.log("price_matrix_error>>>", error)
            this.setState({
                foundationList: []
            })
        }
    }


    priceMatrix = {
        success: (response) => {
            console.log("price_matrix", response)
            this.setState({
                areaList: response.data
            })
        },
        error: (error) => {
            console.log("price_matrix_error>>>", error)
            this.setState({
                areaList: []
            })
        }
    }


    componentDidMount() {
        let arrayCategory = this.state.categoryArray;
        let item = this.getCurrentItem(this.state.index);
        console.log("CAtegory array : ", arrayCategory);
        AsyncStorage.getItem('reAgentID').then((value) => {
            agentID = value
        });

        AsyncStorage.getItem('role').then((value) => {
            roleID = value
        });

        BackHandler.addEventListener('hardwareBackPress', this.handleBack);
        this.props.navigation.setParams({ backHandle: this.handleBack });
        this.manageButtonText();
        this.getData(item);
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
    }
    getCurrentItem = (index) => {
        let inspectionArray = this.state.categoryArray;
        return inspectionArray[index]
    }
    manageIndex = () => {
        if (this.validationFails()) {
            return;
        }
        else if (this.state.buttonText.includes('Continue for')) {
            let totalCount = this.state.categoryArray.length;
            if (this.state.index < totalCount - 1) {
                this.setState({ index: this.state.index + 1 }, () => {
                    let item = this.getCurrentItem(this.state.index);
                    this.getData(item);
                    this.manageButtonText();
                })
            }
        } else {
            let item = this.getCurrentItem(this.state.index);
            console.log("okook ", this.props.navigation.state.params.selectedCategory,
                this.props.navigation.state.params.data,
                this.state.homeAreaVal,
                this.state.slectChimney,
                this.state.noOfPrice,
                this.state.pestAreaVal,
                this.state.homeFoundationVal,
                this.state.homePropertyVal,
                itemMain
            )

            let homeObj = {
                sq_foot: this.state.homeAreaVal.areaRangeId,
                ptypeId: this.state.homePropertyVal,
                fTypeid: this.state.homeFoundationVal
            }

            let pestObj = {
                sq_foot: this.state.homeAreaVal.areaRangeId,
                ptypeId: this.state.homePropertyVal,
                fTypeid: this.state.homeFoundationVal
            }

            // let pestObj = {
            //     sq_foot: this.state.pestAreaVal,
            //     ptypeId: this.state.pestPropertyVal,
            //     fTypeid: this.state.pestFoundationVal
            // }

            let poolObj = {
                noOfPool: this.state.noOfPool,
            }

            let roofObj = {
                sq_foot: this.state.roofCountVal.areaRangeId,
                ptypeId: this.state.roofPropertyVal,
                noOfStory: this.state.noOfStrories
            }
            let chimneyObj = {
                chimney: this.state.chimneyCountVal.chimneyTypeId,
                noOfChimney: this.state.noOfChim
            }

            console.log("home >> ", homeObj)
            console.log("pest >> ", pestObj)
            console.log("pool >> ", poolObj)
            console.log("roof >> ", roofObj)
            console.log("chimney >> ", chimneyObj)
            console.log("categoryArray >> ", this.props.navigation.state.params.selectedCategory)
            console.log("data >> ", this.props.navigation.state.params.data)

            this.props.navigation.navigate('CompanyListing', {
                categoryArray: this.props.navigation.state.params.selectedCategory,
                //categoryArray: this.props.navigation.state.params.selectedCategory,
                locationObj: this.props.navigation.state.params.data,
                homeCatObj: homeObj,
                pestCatObj: homeObj,
                poolCatObj: poolObj,
                roofCatObj: roofObj,
                chimneyCatObj: chimneyObj,
                companyID: 0,
                roleID: roleID,
                agentID: agentID
            });

            /* this.props.navigation.navigate('CompanyListing', {
                 categoryArray: this.props.navigation.state.params.selectedCategory,
                 data: this.props.navigation.state.params.data,
                 homeAreaVal: this.state.homeAreaVal,
                 chimneyCount: this.state.slectChimney,
                 roof: this.state.selectRofVal,
                 poolCountVal: this.state.noOfPool,
                 noOfChim: this.state.noOfChim,
                 noOfPool: this.state.noOfPool,
                 noOfStories: this.state.noOfStrories,
                 pestAreaVal: this.state.pestAreaVal,
                 homeFoundationVal: this.state.homeFoundationVal,
                 homePropertyVal: this.state.homePropertyVal,
                 infectionMainId: itemMain,
             });*/



            // let roofObj = {
            //     sq_foot: this.state.roofCountVal,
            //     ptypeId: this.state.roofPropertyVal,
            //     noOfStory: this.state.noOfStrories
            // }

            // this.props.navigation.navigate('CompanyListing', {
            //     categoryArray: this.props.navigation.state.params.selectedCategory,
            //     data: this.props.navigation.state.params.data,
            //     homeAreaVal: this.state.homeAreaVal,
            //     chimneyCount: this.state.slectChimney,
            //     roof: this.state.selectRofVal,
            //     poolCountVal: this.state.noOfPool,
            //     noOfChim: this.state.noOfChim,
            //     noOfPool: this.state.noOfPool,
            //     noOfStories: this.state.noOfStrories,
            //     pestAreaVal: this.state.pestAreaVal,
            //     homeFoundationVal: this.state.homeFoundationVal,
            //     homePropertyVal: this.state.homePropertyVal,
            //     infectionMainId: itemMain,

            // });
        }
    }

    validationFails = () => {
        let isError = false;
        let item = this.getCurrentItem(this.state.index);
        if (item.name == 'Home') {
            if (this.state.homeAreaVal == '') {
                showToastMsg(strings.pls_select_sq_foot)
                isError = true;
            } else if (this.state.homePropertyVal == '') {
                showToastMsg(strings.pls_select_properties_home)
                isError = true;
            }
            else if (this.state.homeFoundationVal == '') {
                showToastMsg(strings.pls_select_foundation_home)
                isError = true;
            } else {
                isError = false;
            }
        }

        else if (item.name == 'Pest') {
            if (this.state.homeAreaVal == '') {
                showToastMsg(strings.pls_select_sq_foot)
                isError = true;
            } else if (this.state.homePropertyVal == '') {
                showToastMsg(strings.pls_select_properties_home)
                isError = true;
            }
            else if (this.state.homeFoundationVal == '') {
                showToastMsg(strings.pls_select_foundation_home)
                isError = true;
            } else {
                isError = false;
            }
        }

        // if (item.name == 'Home | Pest' && this.state.homeAreaVal == '') {
        //     this.setState({ homeAreaError: "Please select area for home.", homeAreaVal: '' })
        //     isError = true;
        // }
        // if (item.name == 'Home | Pest' && this.state.homePropertyVal == '') {
        //     this.setState({ homePropertyError: "Please select property for home.", homePropertyVal: '' })
        //     isError = true;
        // }
        // if (item.name == 'Home | Pest' && this.state.homeFoundationVal == '') {
        //     this.setState({ homeFoundationError: "Please select foundation for home.", homeFoundationVal: '' })
        //     isError = true;
        // }

        if (item.name == 'Pool') {
            if (this.state.noOfPool == '') {
                showToastMsg(strings.pls_select_no_pool)
                isError = true;
            } else {
                isError = false
            }
        }

        if (item.name == 'Roof') {
            console.log("dsadadbj >", this.state.selectRofVal)
            if (this.state.roofCountVal == '') {
                showToastMsg(strings.pls_select_sq_foot)
                isError = true;
            }
            else if (this.state.roofPropertyVal == '') {
                showToastMsg(strings.pls_select_properties_roof)
                isError = true;
            }
            else if (this.state.noOfStrories == '') {
                showToastMsg(strings.pls_Select_no_stories)
                isError = true;
            } else {
                isError = false
            }
        }
        if (item.name == 'Chimney') {
            if (this.state.chimneyCountVal == '') {
                showToastMsg("Please select Chimney Type")
                isError = true;
            } else if (this.state.noOfChim == '') {
                showToastMsg(strings.pls_select_no_chimney)
                isError = true;
            } else {
                isError = false;
            }
            //this.setState({ chimneyCountError: "Please select count for chimney.", chimneyCountVal: '' })
        }
        return isError;
    }
    setHomeArea = (value) => {
        console.log("Home Area value : ", value)
        this.setState({ homeAreaVal: value, homeAreaError: null })
    }

    setPestArea = (value) => {
        console.log("Home Area value : ", value)
        this.setState({ homeAreaVal: value, homeAreaError: null })
    }

    setChimeny = (value) => {
        this.setState({ slectChimney: value, homeAreaError: null })
    }



    setPool = (value) => {
        console.log("Selected pool : ", value)
        this.setState({ poolCountVal: value, poolCountError: null })
    }

    setRoof = (value) => {
        console.log("Selected Roof: ", value)
        this.setState({ roofCountVal: value, roofCountError: null })
    }

    setChimney = (value) => {
        console.log("Selected Chimeny : ", value)
        this.setState({ chimneyCountVal: value, chimneyCountError: null })
    }

    renderPicker = (item) => {
        if (item.id == INSPECTION_TYPE[0].id) {
            console.log("home_area_val >>>>>>", this.state.homeAreaVal)
            console.log("homeareaRnage>>>>>>", this.state.homeAreaVal)
            return (
                <View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            pickerStyleType="Android"
                            selectedValue={this.state.homeAreaVal}
                            onValueChange={(value, key) => {
                                console.log("value", value)
                                if (key != 0) {
                                    this.setState({ homeAreaVal: value, homeAreaError: null })
                                }
                            }}
                        >
                            <Picker.Item
                                style={{ color: 'gray', fontSize: 16, fontWeight: '900' }}
                                label="Square/Foot" value="Square/Foot"
                            />

                            {this.state.areaList.map(area => <Picker.Item label={area.areaRange}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                                value={area} key={area.areaRangeId} />)}
                        </Picker>
                        {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.homePropertyVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ homePropertyVal: value, homePropertyError: null })
                                }
                            }}
                        >
                            <Picker.Item style={{ color: 'gray', fontSize: 16, fontWeight: '900' }}
                                label="Property" value=""
                            />
                            {this.state.propertyList.map(property => <Picker.Item label={property.name}
                                value={property.id} key={property.id}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homePropertyError && <Text style={styles.error}>{this.state.homePropertyError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            pickerStyleType="Android"
                            mode="dialog"
                            selectedValue={this.state.homeFoundationVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ homeFoundationVal: value, homeFoundationError: null })
                                }
                            }}
                        >
                            <Picker.Item label="Foundation" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.foundationList.map(foundation => <Picker.Item label={foundation.name}
                                value={foundation.id} key={foundation.id}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homeFoundationError && <Text style={styles.error}>{this.state.homeFoundationError}</Text>}
                    </View>
                </View>
            )
        }
        else if (item.id == INSPECTION_TYPE[1].id) {
            console.log("area list", this.state.areaList);
            return (
                <View >
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.homeAreaVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setHomeArea(value)
                                }
                            }}
                            itemStyle={{ height: 50, transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
                        >
                            <Picker.Item
                                style={{ color: 'gray', fontSize: 16, fontWeight: '900' }}
                                label="Square/Foot" value="Square/Foot"
                            />

                            {this.state.areaList.map(area => <Picker.Item label={area.areaRange}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                                value={area} key={area.areaRangeId} />)}
                        </Picker>
                        {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.homePropertyVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ homePropertyVal: value, homePropertyError: null })
                                }
                            }}
                        >
                            <Picker.Item style={{ color: 'gray', fontSize: 16, fontWeight: '900' }}
                                label="Property" value=""
                            />
                            {this.state.propertyList.map(property => <Picker.Item label={property.name}
                                value={property.id} key={property.id}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homePropertyError && <Text style={styles.error}>{this.state.homePropertyError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            pickerStyleType="Android"
                            mode="dialog"
                            selectedValue={this.state.homeFoundationVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ homeFoundationVal: value, homeFoundationError: null })
                                }

                            }}
                        >
                            <Picker.Item label="Foundation" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.foundationList.map(foundation => <Picker.Item label={foundation.name}
                                value={foundation.id} key={foundation.id}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homeFoundationError && <Text style={styles.error}>{this.state.homeFoundationError}</Text>}
                    </View>
                </View>
                // <View>
                //     <View style={styles.pickerContainer}>
                //         <Picker
                //             mode="dialog"
                //             pickerStyleType="Android"
                //             selectedValue={this.state.homeAreaVal}
                //             onValueChange={(value) => this.setPestArea(value)}
                //         >
                //             <Picker.Item label="Square/Foot" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                //             {this.state.areaList.map(area => <Picker.Item label={area.areaRange}
                //                 value={area} key={area.areaRangeId}
                //                 style={{ color: 'black', fontSize: 14, fontWeight: '900' }}

                //             />)}
                //         </Picker>
                //         {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                //     </View>
                //     <View style={styles.pickerContainer}>
                //         <Picker
                //             mode="dialog"
                //             pickerStyleType="Android"
                //             selectedValue={this.state.homePropertyVal}
                //             onValueChange={(value) => this.setState({ pestPropertyVal: value, homePropertyError: null })}
                //         >
                //             <Picker.Item label="Property" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                //             {this.state.propertyList.map(property => <Picker.Item label={property.name} value={property.id} key={property.id}
                //                 style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                //             />)}
                //         </Picker>
                //         {/* {this.state.pestFoundationError && <Text style={styles.error}>{this.state.homePropertyError}</Text>} */}
                //     </View>
                //     <View style={styles.pickerContainer}>
                //         <Picker
                //             pickerStyleType="Android"
                //             mode="dialog"
                //             selectedValue={this.state.pestFoundationVal}
                //             onValueChange={(value) => this.setState({ pestFoundationVal: value, homeFoundationError: null })}
                //         >
                //             <Picker.Item label="Foundation" value=""
                //                 style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                //             {this.state.foundationList.map(foundation => <Picker.Item label={foundation.name}
                //                 value={foundation.id} key={foundation.id}
                //                 style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                //             />)}
                //         </Picker>
                //         {/* {this.state.homeFoundationError && <Text style={styles.error}>{this.state.homeFoundationError}</Text>} */}
                //     </View>
                // </View>
            )
        }
        else if (item.id == INSPECTION_TYPE[2].id) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.noOfPool}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({
                                        noOfPool: value
                                    })
                                }
                            }
                            }
                        >
                            <Picker.Item label="No. of Pool" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.poolNoList.map(area => <Picker.Item label={area.toString()}
                                value={area} key={area}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                    </View>
                    {/* <View style={styles.pickerContainer}>
                        <TextInput
                            style={{
                                flex: 1, height: 50, color: colors.black, fontSize: 14,
                                paddingHorizontal: 10
                            }}
                            placeholder="Enter No of pool"
                            value={this.state.noOfPool}
                            keyboardType='numeric'
                            onChangeText={(val) => {
                                this.setState({
                                    noOfPool: val.replace(/[^0-9]/g, '')
                                })
                            }}
                        />
                    </View> */}
                </View>
            )
        }
        else if (item.id == INSPECTION_TYPE[3].id) {
            return (
                <View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.roofCountVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({
                                        roofCountVal: value
                                    })
                                }
                            }}
                        >
                            <Picker.Item label="Square/Foot" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.areaList.map(area => <Picker.Item label={area.areaRange}
                                value={area} key={area.areaRangeId}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.roofPropertyVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ roofPropertyVal: value, homePropertyError: null })
                                }
                            }}
                        >
                            <Picker.Item label="Property" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.propertyList.map(property => <Picker.Item label={property.name}
                                value={property.id} key={property.id} style={{ color: 'black', fontSize: 14, fontWeight: '900' }} />)}
                        </Picker>
                        {this.state.homePropertyError && <Text style={styles.error}>{this.state.homePropertyError}</Text>}
                    </View>
                    <View style={styles.pickerContainer}>
                        <TextInput
                            style={{
                                flex: 1, height: 50, color: colors.black, fontSize: 14,
                                paddingHorizontal: 10
                            }}
                            placeholder="Enter No. of Stories"
                            value={this.state.noOfStrories}
                            keyboardType='numeric'
                            onChangeText={(val) => {
                                this.setState({
                                    noOfStrories: val.replace(/[^0-9]/g, '')
                                })
                            }}
                        />
                    </View>
                </View>
            )
        }

        else if (item.id == INSPECTION_TYPE[4].id) {
            return (
                <View style={{ flex: 1 }}>
                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.chimneyCountVal}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    console.log("daskdbsadj > ", value)
                                    this.setState({ chimneyCountVal: value })
                                }
                            }}
                        >
                            <Picker.Item label="Chimney Type" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.chimenyTypeList.map(area => <Picker.Item label={area.chimneyTypeName}
                                value={area} key={area.chimneyTypeId}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>
                        {this.state.homeAreaError && <Text style={styles.error}>{this.state.homeAreaError}</Text>}
                    </View>

                    <View style={styles.pickerContainer}>
                        <Picker
                            mode="dialog"
                            pickerStyleType="Android"
                            selectedValue={this.state.noOfChim}
                            onValueChange={(value, key) => {
                                if (key != 0) {
                                    this.setState({ noOfChim: value })
                                }
                            }}
                        >
                            <Picker.Item label="No. of Chimney" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
                            {this.state.noOfChimneyList.map(area => <Picker.Item label={area.toString()}
                                value={area} key={area}
                                style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
                            />)}
                        </Picker>

                        {/* <TextInput
                            style={{
                                flex: 1, height: 50, color: colors.black, fontSize: 14,
                                paddingHorizontal: 10
                            }}
                            placeholder="Enter No of Chimeny"
                            value={this.state.noOfChim}
                            keyboardType='numeric'
                            onChangeText={(val) => {
                                this.setState({
                                    noOfChim: val.replace(/[^0-9]/g, '')
                                })
                            }}
                        /> */}
                    </View>
                </View>
            )
        }

        // else {
        //     return (
        //         <View>
        //             <View style={styles.pickerContainer}>
        //                 <Picker
        //                     pickerStyleType="Android"
        //                     mode="dialog"
        //                     selectedValue={item.name == 'Chimney' ? this.state.chimneyCountVal : item.name == 'Roof' ? this.state.roofCountVal : this.state.poolCountVal}
        //                     onValueChange={(value) => item.name == 'Chimney' ? this.setChimney(value) : item.name == "Roof" ? this.setRoof(value) : this.setPool(value)}
        //                 >
        //                     <Picker.Item label="Count" value="" style={{ color: 'gray', fontSize: 16, fontWeight: '900' }} />
        //                     {this.state.unitList.map(unit => <Picker.Item label={unit.fromArea + ' ' + unit.toArea} value={unit} key={unit.fromArea + ' ' + unit.toArea}
        //                         style={{ color: 'black', fontSize: 14, fontWeight: '900' }}
        //                     />)}
        //                 </Picker>
        //                 {this.state.roofCountError && <Text style={styles.error}>{this.state.roofCountError}</Text>}
        //                 {this.state.poolCountError && <Text style={styles.error}>{this.state.poolCountError}</Text>}
        //                 {this.state.chimneyCountError && <Text style={styles.error}>{this.state.chimneyCountError}</Text>}
        //             </View>
        //         </View>
        //     )
        // }
    }

    renderInspections = () => {
        let item = this.getCurrentItem(this.state.index);
        return (
            <View style={styles.container}>
                <View style={styles.box}>
                    <View style={[styles.heading, { flexDirection: 'row' }]}>
                        <Image style={{ width: 20, height: 20 }}
                            source={{ uri: item.pictureUrl }}
                        />
                        <Text style={{ fontSize: 14, marginLeft: 10 }}>{item.name}</Text>
                    </View>

                    <View style={styles.line}></View>
                    {this.renderPicker(item)}
                </View>
                <TouchableOpacity style={[styles.button, { paddingHorizontal: 10, width: 220 }]} onPress={() => { this.manageIndex() }}>
                    {this.state.btnImage !== '' ? <Image source={this.state.btnImage} style={styles.btnIcon} /> : null}
                    <Text style={styles.btnText}>{this.state.buttonText}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {
        if (this.state.loading) {
            return <Loader />
        }
        return (
            <ScrollView ref={(ref) => { this.scroll = ref }}>
                <StatusBar backgroundColor="#28558e" barStyle="light-content" />

                {this.renderInspections()}
            </ScrollView>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    box: {
        borderRadius: 5,
        borderWidth: SH * .001,
        borderColor: '#838b95',
        flex: 1,
        // alignItems:'center',
        margin: SH * .01
    },
    button: {
        marginTop: SH * .14,
        backgroundColor: '#28558e',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
        width: SW * .45,
        alignSelf: "center",
        paddingVertical: SH * .014,
        borderRadius: SW * .01,
    },
    btnIcon: {
        width: SW * .06,
        height: SW * .06,
    },
    backButton: {
        width: SW * .028,
        height: SW * .053,
        marginLeft: SW * .03,
    },
    btnText: {
        color: "#fff",
        fontSize: SH * .021,
    },
    heading: {
        paddingVertical: SH * .018,
        alignSelf: 'center',
    },
    line: {
        height: SH * .0007,
        flex: 1,
        width: SW * .96,
        backgroundColor: '#838b95',
    },
    pickerContainer: {
        borderColor: '#838b95',
        borderBottomWidth: SH * .001,
    },
    error: {
        color: 'red',
        fontSize: SH * .021,
    }
})

