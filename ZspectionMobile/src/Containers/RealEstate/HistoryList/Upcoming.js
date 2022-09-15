import React, { Component } from 'react';
import {
  Platform,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  View,
  ScrollView,
  SectionList,
  Image,
  TouchableOpacity,
  Alert,
  Text,
  Keyboard
} from 'react-native';
import style from '../../../../assets/styles/style.js';
import { Modal } from 'react-native';

import { CheckBox, Avatar, SearchBar, Input, Icon, } from 'react-native-elements';
import Loader from '../../../Components/Loader';
import Schedule from '../../../Components/Schedule';
import Common from '../../../Containers/Common';
import EmptyUI from "../../../Components/EmptyUI";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { exampleArray } from './demoArray.js';
import moment from 'moment';
import { API } from "../../../network/API";
import { showToastMsg } from '../../../utils.js';
import colors from '../../../utils/colors.js';

let refinedArray = [];
export default class Upcoming extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: null,
      value: ' ',
      data: [],
      originalData: [],
      searchValue: '',
      searchTerm: '',
      searchAttribute: '',
      ignoreCase: true,
      showSearchField: false,
      modalVisible: false,
      deleteModalVisible: false,
      initial_rating: 0,
      selectedInspector: {},
    };
    this.common = new Common();
  }

  async componentDidMount() {
    this.getData();
  }

  async getData() {
    refinedArray = [];
    this.setState({ data: [], originalData: [] });
    var authToken = await AsyncStorage.getItem('authToken');
    let agentID = await AsyncStorage.getItem('reAgentID');
    let companyID = await AsyncStorage.getItem('companyId');
    let inspectorID = await AsyncStorage.getItem('inspectorID');
    let data = {};
    data['reAgentID'] = agentID;
    data['inspectorID'] = 0;
    data['companyID'] = 0;
    data['searchString'] = this.state.searchValue;
    data['fromDate'] = moment()
      .subtract(1, 'years')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    data['toDate'] = moment()
      .subtract(1, 'days')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    data['reAgentID'] = agentID;
    data['inspectorID'] = 0;
    data['companyID'] = 0;
    data['searchString'] = this.state.searchValue;
    data['fromDate'] = new Date().toISOString();
    data['toDate'] = moment()
      .add(1, 'years')
      .utc()
      .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    try {
      this.setState({ loading: true });
      // let upcomingBookingResponse = await new API(
      //   'SearchBooking',
      //   data,
      // ).getResponse();

      console.log("search_booking_param::>", data)
      API.searchHistory(this.searchHistoryRes, data)


      // console.log('Upcoming booking response : ', upcomingBookingResponse);
      // this.setState({ loading: false });
      // let values = upcomingBookingResponse.values;
      // if (values && values.length > 0) {

      // } else {
      //   // this.common.showToast("Invalid Response")
      // }
    } catch (e) {
      this.common.showToast('Invalid Response');
    }
  }


  searchHistoryRes = {
    success: (response) => {
      console.log("login_res>>>", response)
      this.setState({ loading: false });

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
      this.setState({ data: refinedArray, originalData: refinedArray });
    },
    error: (error) => {
      console.log("login_res_error>>>", error)
      showToastMsg(error.message)
      this.setState({ loading: false });
    }
  }

  onRefresh() {
    this.getData();
  }

  cancelBooking = async (item) => {
    this.hideDeletePopUp();
    let role = await AsyncStorage.getItem("role");
    let userId = await AsyncStorage.getItem("userid");
    this.setState({ loading: true })
    try {
      let cancelResponse = await new API('cancelBooking', {}).getApiResponse("/" + item.bookingDetailID + "/" + role + "/" + userId);
      console.log("cancelBooking response : ", cancelResponse);
      this.setState({ loading: false }, () => {
        this.common.showToast(cancelResponse.data.message);
        this.onRefresh();
      })
    } catch (error) {
      console.log("cancelBooking error : ", error);
      this.setState({ loading: false })
    }
  }

  manageSearch = () => {
    if (this.state.searchValue.length > 0) {
      this.setState({ searchValue: '' });
      this.getData();
    }
  };
  setdDeleteModalVisible = val => {
    this.setState({ deleteModalVisible: val });
  };
  hideDeletePopUp = () => {
    this.setdDeleteModalVisible(false);
  };
  handleDelete = item => {
    console.log('Review handled', item);
    this.setState({ selectedInspector: item });
    this.setdDeleteModalVisible(true);
  };

  /**
    * inspection details switch
    */
  onSwitchToInspectionDetails = (item) => {
    this.props.props.navigation.navigate('REAInspectorDetailsMain', {
      inspectorData: item
    })
  }

  renderItem = ({ item, index }) => {
    return (
      <Schedule
        review={false}
        item={item}
        onPressClick={() => this.onSwitchToInspectionDetails(item)}
        //onClickHistory={() => console.log("on_clickkkkk")}
        callBackHandler={() => {
          this.getData();
        }}
        deleteHnadler={() => {
          this.handleDelete(item);
        }}
      />
    );
  };

  header = () => {
    return (
      <View style={{ height: 80, flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', alignContent: 'center' }}>
        <Input
          placeholder="Search via company, inspector name,address"
          onChangeText={text => this.setState({ searchValue: text })}
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
              name={this.state.searchValue.length > 0 && 'close'}
              color="gray"
              onPress={() => {
                this.manageSearch();
              }}
            />
          }
          value={this.state.searchValue}
        />
        <View style={{}}>
          <Icon
            size={15}
            name="search"
            type="font-awesome"
            color="grey"
            containerStyle={{ padding: 14, borderColor: colors.gray, borderWidth: 0.5 }}
            onPress={() => {
              Keyboard.dismiss()
              this.state.searchValue.length > 0 ? this.getData() : null;
            }}
          />
        </View>
      </View>
    );
  };

  render() {
    if (this.state.refreshing || this.state.loading) return <Loader />;
    return (
      <View
        style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: colors.white, paddingHorizontal: 10 }}>
          <SectionList
            sections={this.state.data}
            data={this.state.data}
            keyExtractor={(item, index) => `${index}`}
            renderItem={this.renderItem}
            ListHeaderComponent={this.header}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh.bind(this)}
              />
            }
            extraData={this.state}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
              return <EmptyUI mainContainer={{ flex: 1, alignSelf: 'center' }} />
            }}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={{ backgroundColor: '#C0C0C0', paddingLeft: 5 }}>
                {title}
              </Text>
            )}
          />
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.deleteModalVisible}>
          <View style={styles.centeredView}>
            <View
              style={{
                backgroundColor: '#fff',
                borderRadius: 10,
                borderColor: '#C0C0C0',
                borderWidth: 1,
              }}>
              <View style={{ width: 300, height: 250 }}>
                <View style={{ marginTop: 20, padding: 10 }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    Do you want to cancel ?
                  </Text>
                </View>

                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 10,
                    marginTop: 15,
                  }}>
                  <Text style={{ fontWeight: 'bold' }}>
                    {this.state.selectedInspector.inspectorName}
                  </Text>
                  <Text>
                    {moment(this.state.selectedInspector.startDate).format(
                      'DD-MMM-YY h:mm A',
                    )}
                  </Text>
                </View>
                <Text style={{ paddingHorizontal: 10, marginTop: 30 }}>
                  {this.state.selectedInspector.address}
                </Text>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    paddingHorizontal: 10,
                    marginTop: 30,
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      this.hideDeletePopUp();
                    }}
                    style={{ backgroundColor: '#B9183A', borderRadius: 5 }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                      }}>
                      No
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      this.cancelBooking(this.state.selectedInspector);
                    }}
                    style={{ backgroundColor: '#2196F3', borderRadius: 5 }}>
                    <Text
                      style={{
                        color: '#fff',
                        paddingHorizontal: 15,
                        paddingVertical: 7,
                      }}>
                      Yes
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});

