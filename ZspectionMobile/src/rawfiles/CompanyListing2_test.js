import React, {Component} from 'react';
import {Platform, Dimensions, Text,  StyleSheet, View, ScrollView, Image, FlatList, TouchableOpacity} from 'react-native';
import styles from '../../../../assets/styles/style.js';
import { CheckBox, Avatar, Icon, Input,Rating } from 'react-native-elements';
import Common from '../../Common';
import Loader from '../../../Components/Loader';
import Advertisement from '../../../Components/Advertisement';
import Errors from '../../../Components/Errors';
import Carousel from 'react-native-snap-carousel';

const IS_IOS = Platform.OS === 'ios';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
const viewWidth = viewportWidth;
const itemWidth = viewWidth;
export default class Register extends Component {

    constructor(props) {
        super(props)
        this.state = {
            activeSlide:0,
            inspectionMarked: [],
            cityList: [],
            submit: false,
            errors: [],
            address: [],
            date: '',
            time: '',
            list: [],
            inspectionList: [],
            inspectiontype: [],
            inspectionFound:[],
            favouriteList:[],
            inspectionCompanies: [],
            diableNextButton: true,
        }
        this.common = new Common();
    }
    
    componentDidMount() {
        this.setData();
    }

    setData() {
        var request = this.props.navigation.getParam('request');
        var inspectionCompanies = this.props.navigation.getParam('inspectionCompanies');
        console.log("request: ",request);
        this.setState({
            address:request.address,
            date: request.inspectiondate,
            time: request.time,
            inspectionList: this.props.navigation.getParam('inspectionList'),
            inspectionCompanies: inspectionCompanies,
        })
        
        this.filterList(request.inspectiontype, inspectionCompanies);
    }

    filterList(inspectiontype, inspectionCompanies) {
        var cmp = [];
        inspectiontype.map( inspection => {
            var arr = [];
            inspectionCompanies.map(company => {
                if(inspection.inspectiontypeid == company.InspectionTypeId) {
                    arr.push(company);
                }
            })
            if(arr.length > 0) {
                cmp.push({"inspectiontypeid":inspection.inspectiontypeid, "company":arr});
            }
        })
        console.log("list: ",cmp);
        this.setState({inspectiontype:cmp})
    }

    getName = (id) => {
        var name = '';
        this.state.inspectionList.filter( (item) => {
            if(item.InspectionTypeId == id) {
                name = item.InspectionTypeName;
            }
        })
        return name;
    }

    markAsFavourite = async (inspector, status) => {
       
        var list = this.state.inspectiontype;
        list.map( (arr, index) => {
            arr.company.find((item, index2) => {
                if(item.InspectorId === inspector.InspectorId) {
                    console.log("inside")
                    // console.log("index: ",index, "index2: ",index2)
                    // item.IsLike = !status;
                    console.log("ss: ",this.state.inspectiontype[index].company[index2].IsLike)
                    this.state.inspectiontype[index].company[index2].IsLike = 1;
                    // console.log("inside: ",this.state.inspectiontype[index].company[index2])
                    this.forceUpdate();
                }
            })
        })
        
        // console.log("inspector later: ",this.state.inspectiontype)
        
        // this.setState({loading: true});
        // var authToken = await AsyncStorage.getItem("authToken");
        // var profile = JSON.parse(await AsyncStorage.getItem("profile"));
        // var header = {"authentication":authToken};
        // var data = {"inspectorid":item.InspectorId,"agentid":profile.AgentId};
        // var response = new API('Favorite',data,header).getResponse();
        
        // response.then( result => {
        //     this.setState({loading: false});
        //     if(result.statuscode == 200) {
        //         var list = [...this.state.inspectiontype];
        //         list.find(item => {
        //             if(item.InspectorId === inspectorId) {
        //                 item.IsLike = !item.IsLike;
        //                 this.forceUpdate();
                        
        //             }
        //         })                
        //     }
        //     else {
        //         var errors = [];
        //         errors.push("invalid response");
        //         this.setState({errors: errors})
               
        //     }
        // }).catch(error => {
        //     this.setState({loading: false});
        //     var errors = [];
        //     errors.push("Please try again later");
        //     this.setState({errors: errors})
            
        // })
        
    }

    markAsChecked = (InspectorId, inspectionTypeId, itemChecked) => {
        var item = {"inspectionTypeId": inspectionTypeId, "InspectorId" : InspectorId, "item": itemChecked}
        var list = this.state.inspectionMarked;
        for(var i = 0; i<list.length;i++) {
            if(list[i].inspectionTypeId == inspectionTypeId) {
                list.splice(i,1);
            }
        }
        list.push(item)
        this.setState({errors: []})
        this.forceUpdate();
        // this.goNextPage();
    }

    searchSummary() {
        this.props.navigation.navigate("SearchSummary",{
            request: this.props.navigation.getParam('request'),
            inspectionMarked: this.state.inspectionMarked,
            inspectionList: this.props.navigation.getParam('inspectionList')
        })
    }    

    getInspectionCompany = (item) => {
        return(
            <View style={[styles.summarySelectedIspector]}>
                 <CheckBox
                        textStyle={{margin:0,padding:0}}
                        size={18}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={false}
                        containerStyle={{margin:0,padding:0, }}
                        center
                        onPress={() => this.markAsChecked(item.InspectorId,item.InspectionTypeId, item)}
                    />
                <TouchableOpacity style={[styles.center,{width:80}]} onPress={() => this.props.navigation.navigate('CompanyDetail', {inspector:item, favorite:this.state.favouriteList.includes(item.InspectorId)})}>
                    <Avatar
                        rounded
                        source={{
                            uri: item.ProfilePic,
                        }}
                        size="large"
                    />
                    <Text style={[styles.nameTxt,{textAlign:'center', marginBottom:6, textDecorationLine:'underline'}]}>{item.InspectorName}</Text>
                    <Rating
                        ratingCount={5}
                        imageSize={14}
                        readonly
                        startingValue={1}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.flatListItemTextRow} onPress={() => this.props.navigation.navigate('CompanyDetail', {inspector:item, favorite:this.state.favouriteList.includes(item.InspectorId)})}>
                    <Text style={styles.nameTxt}>{item.CompanyName} SGS Inspection Services </Text>
                    <Text numberOfLines={3} style={styles.nameTxt2}>{item.CompanyBio} SGS Inspection Services SGS Inspection Services SGS Inspection Services SGS Inspection Services SGS Inspection Services SGS Inspection Services SGS Inspection Services SGS Inspection Services </Text>
                </TouchableOpacity>
                <View style={{justifyContent:'space-between'}}>
                    <View style={styles.center}>
                        <Text style={styles.nameTxt}>$ {item.price}</Text>
                    </View>
                    <View style={[styles.center]}>
                        <CheckBox
                            size={16}
                            checkedIcon='heart'
                            checkedColor="#B9183A"
                            uncheckedIcon='heart-o'
                            checked={item.IsLike}
                            onPress={() => this.markAsFavourite(item, item.IsLike)}
                        />
                    </View>
                </View>
            </View>
        )
    }

    renderItem = ({item, index}) => {
        var list = item.company.map(company => {
            return this.getInspectionCompany(company);
        })
        return (
            <View>
                <View style={styles.container}>
                    <Text style={[styles.heading2,styles.capitalize]}>{this.getName(item.inspectiontypeid)} Inspection</Text>
                </View>
                {list}
            </View>
        );
    }

    render() {
        var enabled = 'disabled';
        if(this.state.loading) {
            return <Loader />
        }
        return (
            <View style={{flex:1}}>
                <Advertisement />
                <View style={styles.container}>
                    <Text style={styles.heading2}>Inspection Request</Text>
                    <View style={[styles.row]}>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={styles.font12}>{this.state.address}</Text>
                        </View>
                        <View style={{justifyContent:"space-between",flex:1}}>
                            <Text style={[{textAlign:'right'},styles.font12]}>{this.state.date} | {this.state.time}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.border2}></View>
                <Errors errors={this.state.errors} />
                <ScrollView>
                    <Carousel
                        extraData={this.state}
                        ref={(c) => { this._carousel = c; }}
                        data={this.state.inspectiontype}
                        renderItem={this.renderItem}
                        sliderWidth={viewWidth}
                        itemWidth={itemWidth}
                        firstItem={this.state.activeSlide}
                        
                        // onSnapToItem={(index) => this.setState({ activeSlide: index }) }
                        // onPress={() => { this._carousel.snapToNext(() => {
                        
                        // }) }}
                        // snapToItem={this.nextPage}
                        // onBeforeSnapToItem={(slideIndex) => this.nextPage(slideIndex)}
                        // onSnapToItem={(slideIndex) => console.log("called")}
                    />
                </ScrollView>
            </View>
        );
    }
}
