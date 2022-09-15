import React, { Component } from 'react';
import { Platform, StyleSheet, FlatList, View, StatusBar, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import styles from '../../../../assets/styles/style2.js';
import styles2 from '../../../../assets/styles/style.js';
import {
  Container, Header, Content, Card, CardItem, Right, Left, Switch,
  Text, Body, Title, Form, Item, Toast,
} from 'native-base';
import { CheckBox, Avatar, Input, Slider, Icon, Button } from 'react-native-elements';
import API from '../../../Api/Api';
import Loader from '../../../Components/Loader';
import Common from '../../../Containers/Common';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default class RegisterMatrix extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foundation: [],
      companyId: 0,
      currentPage: 0,
      currentPriceMatrixPage: 0,
      category: '',
      errors: [],
      loading: false,
      submit: false,
      priceMatrix: [],
      foundationList: [],
      pageList: [],
      UICArray: [],
      selectedPrice: 0,
      selectedDuration: 0,
      priceArray: [],
      durationArray: [],
      checkStatus: false,
      inspectorData: this.props.navigation.state.params.inspectorData
    };
    this.common = new Common();
  }

  componentDidMount() {
    this.getFoundation();
  }

  async getFoundation() {
    let inspectionTypeId = this.state.inspectorData.resultID3
    this.fetchRecord("" + inspectionTypeId);
  }
  fetchRecord = async inspectionTypeId => {
    this.setState({ loading: true });
    console.log("Fetching inspector price matrix");
    //////
    let response = await new API('PriceMatrix', {}).getApiResponse('/' + inspectionTypeId);
    console.log("Inspector price matrix", response);
    if (response.status === 200) {
      let arr = this.state.UICArray;
      arr.push(response.data);
      this.setState({ UICArray: arr });
      this.setState({ loading: false });
    } else {
      this.setState({ loading: false });
      this.common.showToast(result.message);
    }
  };
  updatePrice = (index, price) => {
    let priceArray = this.state.priceArray;
    priceArray[index] = price;
    this.setState({ priceArray })
  }
  updateDuration = (index, duration) => {
    let durationArray = this.state.durationArray;
    durationArray[index] = duration;
    this.setState({ durationArray })
  }

  updateMatrix = async () => {
    let copiedArray = [...this.state.UICArray];
    let Foundation = copiedArray[this.state.currentPage];
    let FoundationItem = Foundation[this.state.currentPriceMatrixPage];
    let FoundationItemMatrixArray = FoundationItem.priceMatrix;
    this.state.priceArray.map((price, index) => {
      FoundationItemMatrixArray[index].price = price !== undefined ? price : 0;
    })
    this.state.durationArray.map((duration, index) => {
      FoundationItemMatrixArray[index].duration = duration !== undefined ? duration : 0;
    })
    FoundationItem.priceMatrix = FoundationItemMatrixArray;
    Foundation[this.state.currentPriceMatrixPage] = FoundationItem;
    copiedArray[this.state.currentPage] = Foundation;
    this.setState({ UICArray: copiedArray }, () => {
      this.setState({ priceArray: [], durationArray: [] })
    })
  }

  priceRow = ({ item, index }) => {
    let Area = item.area;
    let Price = "" + item.price;
    let DurationMin = "" + item.duration;
    return (
      <View
        style={[
          styles.sectionMatrixRow2,
          { backgroundColor: index % 2 == 0 ? '#fff' : '#dbe2ec' },
        ]}
        key={item.InspectionTypeId}>
        <View style={{ flex: 1 }}>
          <Text style={[{ fontSize: 13, textAlign: 'center' }]}>
            {Area}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <TextInput
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ fontSize: 15, textAlign: 'center' }}
            placeholder={Price !== undefined ? Price : "0"}
            style={{ padding: 0 }}
            onChangeText={text => this.updatePrice(index, text)}
            keyboardType="numeric"
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            disabledInputStyle={{ borderWidth: 1 }}
            inputContainerStyle={{ borderBottomWidth: 0 }}
            inputStyle={{ fontSize: 15, textAlign: 'center' }}
            placeholder={DurationMin !== undefined ? DurationMin : "0"}
            style={{}}
            onChangeText={text => this.updateDuration(index, text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    );
  };

  getRequestData = async () => {
    let arr = [];
    let priceMatrixID = 0;
    let arrayToSave = [...this.state.UICArray]
    let companyId = await AsyncStorage.getItem("companyId");
    let inspectionTypeId = await AsyncStorage.getItem("inspectionTypeID");
    let currentTime = new Date().getTime();
    arrayToSave.map((childArray, index) => {
      childArray.map((matrixArray, index) => {
        matrixArray.priceMatrix.map((matrix, index) => {
          console.log("Matrix data to upload : ", matrix)
          priceMatrixID++
          let data = {};
          data["companyID"] = parseInt(companyId);
          data["priceMatrixID"] = matrix.priceMatrixID;
          data["inspectionTypeID"] = parseInt(inspectionTypeId);
          data["fromArea"] = matrix.fromArea;
          data["toArea"] = matrix.toArea;
          data["pTypeID"] = matrix.pTypeID;
          data["fTypeID"] = matrix.fTypeID;
          data["price"] = parseInt(matrix.price);
          data["duration"] = parseInt(matrix.duration);
          data["isActive"] = true;
          data["createdOn"] = new Date().toISOString();
          data["inspectorID"] = this.state.inspectorData.resultID1;
          data["inspectorPriceID"] = parseInt(priceMatrixID);
          arr.push(data);
        })
      })
    })
    console.log("Array to save is :", arr);
    return arr;
  }

  saveMatrix = async () => {
    let companyId = await AsyncStorage.getItem("companyId");
    let inspectionTypeId = await AsyncStorage.getItem("inspectionTypeID");
    this.setState({ loading: true });
    await this.getRequestData().then(data => {
      console.log('matrix request: ', JSON.stringify(data));
      let response = new API('InspectorPrices', data).getResponse();
      console.log('Inspector price matrix upload response: ', response);
      response.then(result => {
        if (result.response == 201) {
          this.setState({ loading: false }, () => {
            this.common.showToast(result.message);
            this.props.navigation.navigate("Inspector", {
              "companyId": companyId,
              "inspectionTypeId": inspectionTypeId,
            })
          })
        } else {
          this.setState({ loading: false });
          this.common.showToast('Error: ' + result.message);
        }
      });
    });
  };

  onNextClick = () => {
    this.updateMatrix().then(() => {
      setTimeout(() => {
        let foundationArr = this.state.UICArray[this.state.currentPage]
        if (foundationArr !== undefined) {
          let matrixArr = foundationArr[this.state.currentPriceMatrixPage + 1]
          if (matrixArr !== undefined) {
            this.setState({ currentPriceMatrixPage: this.state.currentPriceMatrixPage + 1 })
          } else {
            let foundationArr = this.state.UICArray[this.state.currentPage + 1]
            if (foundationArr !== undefined) {
              this.setState({ currentPage: this.state.currentPage + 1, currentPriceMatrixPage: 0 })
            }
          }
        }
      });
    }, 300)
  }
  onBackClick = () => {
    this.updateMatrix().then(() => {
      setTimeout(() => {
        if (this.state.currentPriceMatrixPage !== 0) {
          this.setState({
            currentPriceMatrixPage: this.state.currentPriceMatrixPage - 1,
          });
        } else if (this.state.currentPriceMatrixPage === 0 && this.state.currentPage !== 0) {
          this.setState({ currentPage: this.state.currentPage - 1 }, () => {
            let foundationArr = this.state.UICArray[this.state.currentPage]
            this.setState({ currentPriceMatrixPage: foundationArr.length - 1 });
          });
        }
      }, 300)
    })
  }

  showButtonRow(currentPageIndex, currentPriceMatrixIndex) {
    let foundation = this.state.UICArray.length > 0 && this.state.UICArray[currentPageIndex];
    if (
      (currentPageIndex === this.state.UICArray.length - 1 &&
        currentPriceMatrixIndex === foundation.length - 1) ||
      (currentPriceMatrixIndex === foundation.length - 1 &&
        currentPageIndex === this.state.UICArray.length - 1)
    ) {
      return (
        <View key={currentPageIndex} style={styles2.twoRow}>
          <View style={styles2.nextButtonWrapper}>
            {currentPageIndex + currentPriceMatrixIndex !== 0 && (
              <Button
                title="Back"
                buttonStyle={styles2.btnNext}
                icon={
                  <Icon
                    name="angle-left"
                    containerStyle={{ position: 'absolute', left: 10 }}
                    type="font-awesome"
                    color="#FFF"
                  />
                }
                iconLeft
                onPress={() => {
                  this.onBackClick();
                  this.scroll.scrollTo({ x: 0, y: 0, animated: true });
                }}
              />
            )}
          </View>
          <View style={styles2.nextButtonWrapper}>
            <Button
              title="Save"
              buttonStyle={styles2.btnNext}
              onPress={() => this.updateMatrix().then(() => {
                this.saveMatrix();
              })}
            />
          </View>
        </View>
      );
    } else {
      return (
        <View key={currentPageIndex} style={styles2.twoRow}>
          <View style={styles2.nextButtonWrapper}>
            {currentPageIndex + currentPriceMatrixIndex !== 0 && (
              <Button
                title="Back"
                buttonStyle={styles2.btnNext}
                icon={
                  <Icon
                    name="angle-left"
                    containerStyle={{ position: 'absolute', left: 10 }}
                    type="font-awesome"
                    color="#FFF"
                  />
                }
                iconLeft
                onPress={() => {
                  this.onBackClick();
                  this.scroll.scrollTo({ x: 0, y: 0, animated: true });
                }}
              />
            )}
          </View>
          <View style={styles2.nextButtonWrapper}>
            <Button
              title="Next"
              buttonStyle={styles2.btnNext}
              icon={
                <Icon
                  name="angle-right"
                  containerStyle={{ position: 'absolute', right: 10 }}
                  type="font-awesome"
                  color="#FFF"
                />
              }
              iconRight
              onPress={() => {
                this.onNextClick();
                this.scroll.scrollTo({ x: 0, y: 0, animated: true });
              }}
            />
          </View>
        </View>
      );
    }
  }

  getBodyLayout(pageIndex, matrixIndex) {
    let foundation = this.state.UICArray.length > 0 && this.state.UICArray[pageIndex];
    let matrix = foundation.length > 0 && foundation[matrixIndex].priceMatrix;
    let ftRequired = foundation.length > 0 && foundation[matrixIndex].propertyFoundationType.ftRequired;
    let column = ftRequired === true ? "Area" : "Count";
    if (!foundation || !matrix) return null;
    let visibility = { display: 'flex' };
    return (
      <View style={visibility}>
        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-around', }}>
          <View style={{ flexDirection: 'row', borderColor: '#e5e5e5', borderWidth: 1, width: '48%', justifyContent: 'center', paddingVertical: 10, }}>
            <Text style={{ color: 'gray', fontSize: 14 }}>Foundation - </Text>
            <Text style={{ color: '#28558E', fontSize: 15 }}>{foundation[matrixIndex].propertyFoundationType.foundationType}</Text>
          </View>
          <View style={{ flexDirection: 'row', borderColor: '#e5e5e5', borderWidth: 1, width: '48%', justifyContent: 'center', paddingVertical: 10, }}>
            <Text style={{ color: 'gray', fontSize: 14, flexWrap: 'nowrap' }}>Property - </Text>
            <Text style={{ color: '#28558E', fontSize: 15 }}>{foundation[matrixIndex].propertyFoundationType.propertyType}</Text>
          </View>
        </View>

        <View style={[styles.twoRow, { backgroundColor: '#67778b', paddingVertical: 10, marginTop: 20 }]}>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.heading2, { color: '#fff' }]}>{ftRequired ? "Area" : "Count"}</Text>
            {ftRequired ? <Text style={[styles.heading3, { color: '#fff' }]}>(sq.ft.)</Text> : null}
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.heading2, { color: '#fff' }]}>Price</Text>
            <Text style={[styles.heading3, { color: '#fff' }]}>($)</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={[styles.heading2, { color: '#fff' }]}>Duration</Text>
            <Text style={[styles.heading3, { color: '#fff' }]}>(min)</Text>
          </View>
        </View>
        <FlatList
          data={matrix}
          keyExtractor={(item, index) => item.priceMatrixID.toString()}
          renderItem={this.priceRow}
        />
      </View>
    );
  }
  getTitle = () => {
    let title = this.state.UICArray.length > 0 && this.state.UICArray[this.state.currentPage][0] && this.state.UICArray[this.state.currentPage][0].propertyFoundationType.inspectionName;
    return (
      <Text style={{ fontSize: 14, color: '#fff' }}>
        {"(" + title + ")"}
      </Text>
    );
  };
  setCheckStatus = () => {
    this.setState({ checkStatus: !this.state.checkStatus });
  }
  render() {
    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <ScrollView
        ref={ref => {
          this.scroll = ref;
        }}>
        <Header style={{ backgroundColor: '#28558E', flexDirection: "row", alignItems: "center" }}>
          <Body style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Title>Inspector Price Matrix</Title>
            {this.getTitle()}
          </Body>
          <Icon iconStyle={{ marginRight: 15, fontWeight: 'normal', }} size={20} color="#FFF" name='notifications' type='material' />
        </Header>
        <StatusBar backgroundColor="#28558E" barStyle="light-content" />
        <View>
          {/* <View style={{flexDirection:'row',alignItems:"center"}}>
                <CheckBox checked={this.state.checkStatus} onPress={() => this.setCheckStatus()} checkedColor="#28558E" size={25} containerStyle={styles.loginContainerStyle} color="#808080" style={styles.loginCheckbox} />
                <Text style={{color:'#808080', fontSize:15}}>Copy price matrix from company</Text>
            </View> */}
          {this.getBodyLayout(this.state.currentPage, this.state.currentPriceMatrixPage)}
          {this.showButtonRow(this.state.currentPage, this.state.currentPriceMatrixPage)}
        </View>
      </ScrollView>
    );
  }
}
