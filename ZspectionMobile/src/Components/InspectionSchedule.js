import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View,Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../assets/styles/style.js';

import { withNavigation } from 'react-navigation';
import { CheckBox, Avatar, SearchBar, Input, Icon } from 'react-native-elements';
import Rating from './Rating';
class InspectionSchedule extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: [],
        }
    }

    render() {
        return(
            <TouchableOpacity onPress={() => this.props.navigation.navigate('InspectionDetail',{'Inspection':this.props.item})} >
                <View style={{ marginVertical: 10, marginLeft:7}}>
                    <Text style={[style.capitalize,{ fontSize: 13, color: '#28558E', fontWeight:'bold' }]}>{this.props.item.InspectionTypeName} Inspection</Text>
                </View>
                <View style={[style.scheduleInspectorWrappers]}>                        
                        <View style={[style.center,{width:100}]}>
                        <Avatar
                            overlayContainerStyle={{backgroundColor:'#ebebe0'}} 
                            rounded icon={{name: 'person', color: '#C39666', size:35}}
                            size={65}
                            containerStyle={{ borderColor:'#C39666',borderWidth:1,}}
                            source={{
                                uri: this.props.item.InspectorProfilePic,
                            }}
                        />
                        <Text style={[styles.nameTxt,{textAlign:'center', marginTop:5, textDecorationLine:'underline'}]}>{this.props.item.InspectorName}</Text>
                        <Rating rating={this.props.item.InspectorRating ? parseInt(this.props.item.InspectorRating) : 0} />
                    </View>
                    <View style={style.flatListItemTextRow}>
                        <Text style={[style.nameTxt, {color: '#525152'}]}>{this.props.item.CompanyName}</Text>
                        <Text numberOfLines={4} style={[style.nameTxt2, {color: '#525152'}]}>{this.props.item.CompanyBio}</Text>
                    </View>
                    <View style={{width:110,alignItems:'flex-end'}}>
                        <Text style={style.nameTxt}>$ {this.props.item.Price ? this.props.item.Price : 0}</Text>
                        <Text style={[style.nameTxt2,{textAlign:'right', color:'#525152',}]}>{this.props.item.Address} {this.props.item.ZipCode}</Text>
                        <View style={[style.row]}>
                            <Text style={[styles.nameTxt, {marginTop:4}]}>NHD</Text>
                            {this.props.item.IsNHD ? <Icon size={14} name="check-circle" type='font-awesome' color="green" containerStyle={{marginTop:5, marginLeft:5}}
                            /> : <Icon size={14} name="times-circle" type='font-awesome' color="red" containerStyle={{marginTop:5, marginLeft:5}}
                            />}
                        </View>
                        <View style={{flex:1}}>
                            <Text style={[styles.datelist, {marginTop:4}]}>{this.props.item.ScheduleDate} | {this.props.item.ScheduleTime}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    rows: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        
    },
    content: {
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center'
    },
    searchfilter: {
        width: 330,
        marginLeft: 10
    },
    pic: {
        borderRadius: 25,
        width: 60,
        height: 60,
    },
    icon: {
        marginLeft: 10,
        padding: 5
    },
    summarySelectedIspector: {
        borderBottomWidth:1,
        borderColor:'#ccc',
        flexDirection:'row',
        justifyContent:'center',
        paddingVertical:15,
        paddingHorizontal:10,
      },
    nameContainers: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        //width: 200,
        //paddingLeft:20,
    },
    nameContainerss: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        //width: 200,
        //paddingRight:20,
    },
    name: {
        //flexDirection: 'row',
        justifyContent: 'flex-start',
        width: 100,
    },
    nameTxt: {
        fontWeight: '600',
        color: '#222',
        fontSize: 11,
        color: '#808080',

    },
    nameTxtname:{
        fontWeight: 'bold',
        color: '#222',
        fontSize: 12,
        color: '#808080',
    },
    nameTxtprice:{
        fontWeight: 'bold',
        color: '#222',
        fontSize: 12,
        color: '#808080',
    },
    datelist: {
        fontWeight: '500',
        color: '#808080',
        fontSize: 10
    },
    homeContainer: {
        flex: 1,
        paddingRight:12,
        paddingLeft:10
    },
    advertisementSpace: {
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
    },
    white: {
        color: '#fff'
    },
    inspectionRequestFormContainer: {
        paddingLeft: 10,
        paddingRight: 30,
        overflow: 'hidden',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    // nameTxt: {
    //     fontWeight: '600',
    //     color: '#222',
    //     fontSize: 15,

    // },
    advertisementSpaces: {
        height: 35,
        marginTop: 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#28558E',
    },
    center: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    loginButton: {
        backgroundColor: '#28558E',
        borderRadius: 10,
        paddingHorizontal: 30,
        marginVertical: 20,
        height: 35,
    },

});    
export default withNavigation(InspectionSchedule);