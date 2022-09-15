import React, { Component, useEffect, useState } from 'react';
import { Container, Tab, Tabs, ScrollableTab, Input, Icon } from 'native-base';
import { FlatList, RefreshControl, SectionList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import colors from '../../../utils/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { API } from '../../../network/API';
import { showToastMsg } from '../../../utils';
import EmptyUI from '../../../Components/EmptyUI';
import Schedule from '../../../Components/Schedule';
import AntDesign from 'react-native-vector-icons/AntDesign'
import Loader from '../../../Components/Loader';


let refinedArray = [];
var authToken = undefined;
let agentID = 0
let companyID = 0
let inspectorID = 0

const HistoryList = (props, { navigation }) => {
  const [searchValue, setSearchValue] = useState('')
  const [loading, setIsLoading] = useState(false)
  const [data, setData] = useState([])
  const [originalData, setOriginalData] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [tab, setTab] = useState(0)

  useEffect(() => {
    setTab(props.tab)
  }, [props])

  useEffect(() => {
    setData([])
    setOriginalData([])
    fetchHistoryData()
  }, [tab])

  useEffect(async () => {
    authToken = await AsyncStorage.getItem('authToken');
    agentID = await AsyncStorage.getItem('reAgentID');
    companyID = await AsyncStorage.getItem('companyId');
    inspectorID = await AsyncStorage.getItem('inspectorID');
    //fetchHistoryData()
  }, [])

  const fetchHistoryData = async () => {
    refinedArray = [];
    ([])
    let data = {};
    data['reAgentID'] = agentID;
    data['inspectorID'] = 0;
    data['companyID'] = 0;
    data['searchString'] = searchValue;

    if (tab == 1) {
      data['fromDate'] = moment()
        .subtract(1, 'years')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      data['toDate'] = moment()
        .subtract(1, 'days')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    } else {
      data['fromDate'] = new Date().toISOString();
      data['toDate'] = moment()
        .add(1, 'years')
        .utc()
        .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    }
    // data['fromDate'] = new Date().toISOString();
    // data['toDate'] = moment()
    //   .add(1, 'years')
    //   .utc()
    //   .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    try {
      setIsLoading(true)
      console.log("search_booking_param::>", data)
      API.searchHistory(searchHistoryRes, data)
    } catch (e) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    console.log("dsadsadbasjb >", searchValue)
    if (searchValue.length == 0) {
      fetchHistoryData()
    }

  }, [searchValue])

  const searchHistoryRes = {
    success: (response) => {
      console.log("login_res>>>", response)
      setIsLoading(false)

      let group = response.data.reduce((r, a) => {
        console.log('RR : ', r);
        console.log('AA : ', a);
        r[
          moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
            'MM/DD/YYYY',
          )
        ] = [
            ...(r[
              moment(a.startDate, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
                'MM/DD/YYYY',
              )
            ] || []),
            a,
          ];
        return r;
      }, []);
      console.log('group', group);
      for (const property in group) {
        let objV = {};
        objV['title'] = property;
        objV['data'] = group[property];
        refinedArray.push(objV);
      }
      refinedArray.sort((a, b) => {
        const firstDate = moment(a.title, 'MM/DD/YYYY').toDate();
        const endDate = moment(b.title, 'MM/DD/YYYY').toDate();
        return new Date(firstDate) - new Date(endDate)
      })
      console.log("mmnmnnnnm >", refinedArray)
      setData(refinedArray)
      setOriginalData(refinedArray)
      setRefreshing(false)
    },
    error: (error) => {
      console.log("login_res_error>>>", error)
      showToastMsg(error.message)
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  const onSearchValue = () => {
    if (searchValue.length > 0) {
      fetchHistoryData()
    }
  }

  const header = () => {
    return (
      <View style={{
        height: 80, flex: 1, flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', alignContent: 'center'
      }}>
        <View style={{
          flex: 1, borderColor: colors.gray, borderWidth: 0.5,
          height: 50, flexDirection: 'row',
          alignContent: 'center', alignItems: 'center', paddingHorizontal: 10
        }}>
          <TextInput
            style={{ fontSize: 13, paddingHorizontal: 5, flex: 1 }}
            placeholder='Search via company, inspector name,address'
            onChangeText={(text) => setSearchValue(text)}
            value={searchValue}
          />
          {searchValue.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchValue('')

              }}
            >
              <AntDesign name='closecircle' color={colors.gray} size={18} />
            </TouchableOpacity>
          )}

        </View>
        <TouchableOpacity style={{
          flex: 0.15, borderColor: colors.gray,
          borderWidth: 0.5, height: 50, marginLeft: 5, justifyContent: 'center',
          alignContent: 'center', alignItems: 'center'
        }}
          onPress={() => onSearchValue()}
        >
          <AntDesign name='search1' color={colors.black} size={21} />
        </TouchableOpacity>
        {/* <Input
          placeholder="Search via company, inspector name,address"
          onChangeText={text => setSearchValue(text)}
          inputStyle={{ fontSize: 13 }}
          containerStyle={{ flex: 1, height: 50, marginLeft: -10, }}
          inputContainerStyle={{
            borderWidth: 0.5,
            borderColor: colors.gray,
            borderRadius: 2,
            paddingHorizontal: 5,
            marginVertical: 2,
          }}
          rightIcon={
            <Icon
              size={20}
              name={searchValue.length > 0 && 'close'}
              color="gray"
              onPress={() => {
                this.manageSearch();
              }}
            />
          }
          value={searchValue}
        />
        <View style={{}}>
          <Icon
            size={15}
            name="search"
            type="font-awesome"
            color="grey"
            containerStyle={{ padding: 14, borderColor: colors.gray, borderWidth: 0.5 }}
            onPress={() => {
              searchValue.length > 0 ? fetchHistoryData() : null;
            }}
          />
        </View> */}
      </View>
    );
  };


  const renderItemCell = ({ item, index }) => {
    return (
      <Schedule
        review={false}
        item={item}
        callBackHandler={() => {
          fetchHistoryData()
        }}
        deleteHnadler={() => {
          // this.handleDelete(item);
        }}
      />
    );
  }

  return (
    <Container style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 10 }}>
        {loading ? <Loader /> :
          data.length > 0 ?
            <SectionList
              sections={data}
              data={data}
              keyExtractor={(item, index) => `${index}`}
              renderItem={renderItemCell}
              ListHeaderComponent={header()}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true)
                    fetchHistoryData()
                  }}
                />
              }
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
              renderSectionHeader={({ section: { title } }) => (
                <Text style={{ backgroundColor: '#C0C0C0', paddingLeft: 5 }}>
                  {title}
                </Text>
              )}
            /> : <EmptyUI mainContainer={{ flex: 1, alignSelf: 'center' }} />

        }


      </View>

    </Container>
  )
}
export default HistoryList