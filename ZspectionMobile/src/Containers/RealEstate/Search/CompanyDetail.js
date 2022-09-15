import React, { Component } from 'react';
import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, FlatList, Text} from 'react-native';
import styles from '../../../../assets/styles/style.js';

import { Avatar, Icon, Overlay, Rating, CheckBox, Button } from 'react-native-elements';
import Common from '../../Common';

export default class CompanyDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedStartDate: null,
            item: [],
            favorite: false,
            availability: [],
            refreshing: false,
        }
        this.onDateChange = this.onDateChange.bind(this);
        this.common = new Common();
    }

    componentDidMount() {
        var inspector = this.props.navigation.getParam('inspector');
        var favoriteIndex = this.props.navigation.getParam('favorite');
        var favorite = inspector.IsLike || favoriteIndex >=0 ? true : false
        console.log("inspector: ",inspector)
        this.setState({
            item: inspector,
            favorite: favorite
        })
        this.getInspector()
    }

    getInspector = () => {
        var inspector = this.props.navigation.getParam('inspector');
        this.common.getInspectorDetail(inspector.InspectorId).then(ins => {
            this.setState({availability: ins.result.inspector_availability})
        })
    }

    onDateChange(date) {
        this.setState({
          selectedStartDate: date,
        });
    }
    
    showAvailability = ({item, index}) => {
        return(
            <View style={[styles.twoRow, styles.lineSpacing]}>
                <Text style={[styles.threeRow, styles.primaryColor, styles.nameTxt2]}>{item.DayName}</Text>
                <Text style={styles.nameTxt2}>{item.StartTime}    -    {item.EndTime}</Text>
            </View>
        )
    }

    searchSummary() {
        // var send = this.props.navigation.getParam('send');
        // var item = this.props.navigation.getParam('inspector');
        // var record = {"InspectionTypeId": item.InspectionTypeId, "InspectorPriceMetrixId": item.InspectorPriceMetrixId, "InspectorId" : item.InspectorId, "item": item}
        // var list = [];
        // list.push(record)
        // this.props.navigation.navigate("SearchSummary",{
        //     request: send.request,
        //     inspectionMarked: list,
        //     inspectionList: send.inspectionList
        // })

        var inspector = this.props.navigation.getParam('inspector');
        this.props.navigation.state.params.updateData(inspector);
        this.props.navigation.goBack()
    }


    render() {
        const { selectedStartDate } = this.state;
        const startDate = selectedStartDate ? selectedStartDate.toString() : '';
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
                        <Rating
                            ratingCount={5}
                            imageSize={14}
                            readonly
                            startingValue={parseInt(this.state.item.Rating)}
                            
                        />
                    </View>
                    <View style={styles.flatListItemTextRow}>
                        <Text style={styles.nameTxt2}>{this.state.item.InspectorName}</Text>
                        <Text style={styles.nameTxt2}>{this.state.item.InspectorEmail}</Text>
                        <Text style={styles.nameTxt2}>{this.common.formatPhoneNumber(this.state.item.InspectorMobileNo)}</Text>
                        <Text style={styles.nameTxt2}>$ {this.state.item.Price}</Text>
                    </View>
                    <View style={{justifyContent:'space-between'}}>
                        <CheckBox
                            size={16}
                            right
                            checkedIcon='heart'
                            uncheckedIcon='heart-o'
                            checkedColor="#B9183A"
                            checked={this.state.favorite}
                            containerStyle={{margin:0,padding:0}}
                        />
                        <Button
                            title="Select"
                            buttonStyle={{backgroundColor:"#28558E", paddingHorizontal:20}}
                            onPress={() => this.searchSummary()}
                        />
                    </View>
                </View>
                <Text style={[styles.heading2,styles.mtop15]}>Bio</Text>
                <Text style={styles.font15}>{this.state.item.CompanyBio}</Text>
                <Text style={[styles.heading2,styles.mtop15]}>Job Schedule</Text>
                <View>
                    <FlatList
                        data={this.state.availability}
                        renderItem={this.showAvailability}
                        keyExtractor={(item, index) => `${index}`}
                        refreshing={this.state.refreshing}
                        onRefresh={() => this.getInspector()}
                    />
                </View>
            </ScrollView>
        );
    }
}