import React, { Component } from 'react';
import { Platform, ActivityIndicator, RefreshControl, StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import style from '../../assets/styles/style.js';
import { CheckBox, Avatar, SearchBar, Input, Icon, Rating } from 'react-native-elements';
//import Loader from '../../Components/Loader';
//import Errors from '../../Components/Errors';
//import API from '../../Api/Api';
import Common from '../Containers/Common';
const calls = [
    { id: 1, typename:"Pool Inspection", Name: "SQWT Services", city: "SQWT Inspection is an independant 3rd party confirmity assesment..", state: "Chicago,IL,60604", price: "$456", nhd: "NHD", date: "11/20/2019 | 16:40", iconname:'check-circle', iconcolor:'green'},
    { id: 2, typename:"Pool Inspection", Name: "MQWT Services", city: "SQWT Inspection is an independant 3rd party confirmity assesment..", state: "Chicago,IL,60604", price: "$456", nhd: "NHD", date: "11/20/2019 | 16:40", iconname:'times-circle', iconcolor:'#b3003b'},
    { id: 3, typename:"Pool Inspection", Name: "SQWT Services", city: "SQWT Inspection is an independant 3rd party confirmity assesment..", state: "53, W Blvd #350, Chicago,IL,60604", price: "$456", nhd: "NHD", date: "11/20/2019 | 16:40", iconname:'check-circle', iconcolor:'green'},
    { id: 4, typename:"Pool Inspection", Name: "SQWT Services", city: "SQWT Inspection is an independant 3rd party confirmity assesment..", state: "53, W Blvd #350, Chicago,IL,60604", price: "$456", nhd: "NHD", date: "11/20/2019 | 16:40", iconname:'times-circle', iconcolor:'#b3003b'},

];
export default class Scheduled extends Component {
    constructor(props) {

        super(props)
        this.state = {
            loading: false,
            error: null,
            value: '',
            data: calls,
            scheduled: []
        }
        this.common = new Common();
    }

    // componentDidMount(){
    //     this.scheduled();
    // }

    // async Scheduled() {
    //     this.setState({ loading: true });
    //     await this.getRequestData().then(data => {
    //         console.log("request: ",data, JSON.stringify(data));
    //         var response = new API('Scheduled',data).getResponse();
    //         response.then( result => {
    //             console.log("result: ",result);
    //             if(result.statuscode == 200) {
    //                 //console.log('nsjkfnsjkn')
    //             }
    //             else {
    //                 this.setState({ loading: false });
    //                 this.common.showToast("Error: "+result.message);
    //             }
    //         })
    //     });
    // }

    // getRequestData = async () => {
    //     var profile = JSON.parse(await AsyncStorage.getItem("profile"));
    //     console.log("profile: ",profile);
    //     return {
    //         "userid": profile.userid,
    //         "inspection_id": 0,
    //     }
    // }



    searchFilterFunction = text => {
        this.setState({
            value: text
        });

        const newData = calls.filter(item => {
            const itemData = `${item.Name.toUpperCase()}${item.city.toUpperCase()}${item.state.toUpperCase()}`;
            const textData = text.toUpperCase();
            return itemData.includes(textData); // this will return true if our itemData contains the textData
        });

        this.setState({
            data: newData
        });
    };

    onRefresh() {
        //Clear old data of the list
        this.setState({ data: [] });
        //Call the Service to get the latest data
        //this.Inspectorlist();
    }


    renderItem = ({ item, index }) => {
        const { rating } = this.props;
        return (
            <View style={style.summarySelectedIspector}>
                <View style={{width:'30%'}}>
                    <Text style={{ fontSize: 13, marginBottom: 5, color: '#28558E', fontWeight:'bold' }}>{item.typename}</Text>
                    <Avatar
                        size={70} 
						overlayContainerStyle={{backgroundColor:'#ebebe0'}} 
						rounded icon={{name: 'person', color: '#C39666', size:40}}
                        //size="large"
                        containerStyle={{ borderColor:'#C39666',borderWidth:2, alignSelf:'flex-start' }}
                    />
                    <Text style={{ fontSize: 13, marginTop: 5, color:'#808080', borderBottomColor:'gray', borderBottomWidth:1}}>Andrews Stras</Text>
                    <Rating
                        style={{marginTop:4}}
                        ratingCount={5}
                        imageSize={15}
                        startingValue={rating}
                    />
                </View>
                <View style={{flexDirection:'row', marginTop:20, width:'70%'}}>
                <View style={{width:120}}>
                    <View style={styles.nameContainers}>
                        <Text style={styles.nameTxtname}>{item.Name}</Text>
                    </View>
                    <View style={styles.nameContainers}>
                        <Text style={[styles.nameTxt, {marginTop:4}]}>{item.city}</Text>
                    </View>
                </View>
                <View style={{width:100}}>
                    <View style={styles.nameContainerss}>
                        <Text style={[styles.nameTxtprice, {marginTop:4}]}>{item.price}</Text>
                    </View>
                    <View style={styles.nameContainerss}>
                        <Text style={[styles.nameTxt, {marginTop:4, marginLeft:13}]}>{item.state}</Text>
                    </View>
                    <View style={styles.nameContainerss}>
                        <Text style={[styles.nameTxt, {marginTop:4}]}>{item.nhd}</Text>
                        <Icon size={13} name={item.iconname} type='font-awesome' color={item.iconcolor} containerStyle={{marginTop:5, marginLeft:5}}
                        />
                    </View>
                    <View style={styles.nameContainerss}>
                        <Text style={[styles.datelist, {marginTop:4}]}>{item.date}</Text>
                    </View>
                </View>
                </View>
            </View>

        );
    }

    header = () => {
        return (
            <View style={[style.row,{marginTop:20}]}>
              <Input placeholder='Search via company, inspector name, address'
                  value={this.state.value}
                  onChangeText={text => this.searchFilterFunction(text)}
                  inputStyle={{fontSize:14}}
                  containerStyle={{width:'84%',paddingLeft:7}}
                  inputContainerStyle={{borderWidth:1,borderColor:'#ccc',borderRadius:2,paddingHorizontal:6,marginVertical:2}}
                  rightIcon={
                      <Icon
                          size={20}
                          name="search"
                          color="gray"
                      />
                  }
              />
              <View>
                  <Icon
                      size={26}
                      name="sliders"
                      type="font-awesome"
                      color="gray"
                      containerStyle={[style.borderIcon]}
                      
                  />
              </View>
          </View>
        )
    }

    render() {
        if (this.state.refreshing) {
            return (
                //loading view while data is loading
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        //refresh control used for the Pull to Refresh
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                <View style={style.container}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.data}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={this.renderItem}
                        ListHeaderComponent={this.header}
                    />
                </View>
                

            </ScrollView>
        );
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
        fontSize: 11

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
