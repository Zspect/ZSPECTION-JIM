import React, { Component } from 'react';
import { RefreshControl, View, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import style from '../../../../assets/styles/style.js';
import { Text } from 'native-base';
import { Input, Icon } from 'react-native-elements';
import InspectionSchedule from '../../../Components/InspectionSchedule';
import Loader from '../../../Components/Loader';
import CalendarPicker from 'react-native-calendar-picker';
import TestJson from '../../../Components/testjson.json';

const DataList = [
    { id: 1, InspectionTypeName: "Pool", InspectorName: "George Victor", CompanyName: "Green Light Inspection", CompanyBio: 'Green Light Inspection is an independent 3rd Party Conformity Assesment Service..', Price: '$450', Address: '102B Serrano Ave, Los Angeles, ', ZipCode: '90029', IsNHD: '', ScheduleDate: '12/27/19', ScheduleTime: '09:30 AM' },
    { id: 2, InspectionTypeName: "Home", InspectorName: "Frenando Lee", CompanyName: "Green Light Inspection", CompanyBio: 'Green Light Inspection is an independent 3rd Party Conformity Assesment Service..', Price: '$450', Address: '102B Serrano Ave, Los Angeles, ', ZipCode: '90029', IsNHD: '', ScheduleDate: '12/27/19', ScheduleTime: '09:30 AM' },
]

export default class Inspections extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            error: null,
            refreshing: false,
            Data: DataList,
            FreshDataList: DataList,
            customDates: [],
            show: true,
            currentDate: '',
            date: null,
        }
    }


    componentDidMount() {
        this.getDate()
        this.getData()
    }

    getDate() {
        var that = this;
        var date = new Date().getDate();
        var monthNumber = (new Date().getMonth() + 1);
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var month = month[monthNumber];
        var year = new Date().getFullYear();
        that.setState({ currentDate: month + ' ' + date + ', ' + year, });
    }

    onRefresh() {
        this.getData();
    }

    getData() {
        this.setState({ data: TestJson })
        var blackCircle = [
            { 'date': '2020-01-04' },
            { 'date': '2020-01-06' },
        ];
        var greenCircle = [
            { 'date': '2020-01-01' },
            { 'date': '2020-01-03' },
        ];
        var redCircle = [
            { 'date': '2020-01-15' },
            { 'date': '2020-01-18' },
        ];
        var customDates = [];
        blackCircle.map(item => {
            customDates.push({
                date: item.date,
                textStyle: { color: '#FFF' },
                containerStyle: { backgroundColor: '#000' },
            })
        })

        redCircle.map(item => {
            customDates.push({
                date: item.date,
                textStyle: { color: '#FFF' },
                containerStyle: { backgroundColor: 'red' },
            })
        })

        greenCircle.map(item => {
            customDates.push({
                date: item.date,
                textStyle: { color: '#FFF' },
                containerStyle: { backgroundColor: 'green' },
            })
        })

        console.log("customDates: ", customDates);
        this.setState({
            customDates: customDates
        });
    }

    ShowHideComponent = () => {
        if (this.state.show == true) {
            this.setState({ show: false });
        } else {
            this.setState({ show: true });
        }

    };

    renderItem = ({ item, index }) => {
        return <InspectionSchedule item={item} />
    }
    searchFilterFunction = (term) => {
        let FreshDataList = [...this.state.FreshDataList]
        console.log("FreshDataList: ", FreshDataList)
        if (term === '') {
            this.setState({ Data: FreshDataList })
        } else {
            var term = term.toUpperCase()
            var filterList = FreshDataList.filter(item => {
                return item.InspectionTypeName.toUpperCase().includes(term);
            })
            this.setState({ Data: filterList })
        }

    };




    header = () => {
        return (
            <View style={[style.row, { marginTop: 20 }]}>
                <Input placeholder='Search via company, inspector name, address'
                    onChangeText={text => this.searchFilterFunction(text)}
                    inputStyle={{ fontSize: 13 }}
                    containerStyle={{ width: '84%', paddingLeft: 7 }}
                    inputContainerStyle={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 2, paddingHorizontal: 6, marginVertical: 2 }}
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
        if (this.state.refreshing || this.state.loading) return <Loader />

        return (
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.onRefresh.bind(this)}
                    />
                }>
                <View>
                    <TouchableOpacity activeOpacity={0.9} style={style.showHide} onPress={this.ShowHideComponent}>
                        <View style={style.Top}>
                            <Text style={{ color: 'white' }}>{this.state.currentDate}</Text>
                        </View>
                        {this.state.show ? (
                            <View style={style.TopIcon}>
                                <Icon size={14} name='chevron-up' type='font-awesome' color="white" containerStyle={{ marginTop: 5, marginLeft: 5 }} />
                            </View>
                        ) :
                            <View style={{ position: 'absolute', alignSelf: 'flex-end', paddingRight: 15, paddingTop: 7 }}>
                                <Icon size={14} name='chevron-down' type='font-awesome' color="white" containerStyle={{ marginTop: 5, marginLeft: 5 }} />
                            </View>}

                    </TouchableOpacity>
                    {this.state.show ? (
                        <CalendarPicker
                            onDateChange={(date) => this.setState({ date: date })}
                            customDatesStyles={this.state.customDates}
                        />
                    ) : null}
                    <View style={style.containers}>
                        <FlatList
                            data={this.state.Data}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={this.renderItem}
                            ListHeaderComponent={this.header}
                        />
                    </View>
                </View>
            </ScrollView>
        )
    }
}