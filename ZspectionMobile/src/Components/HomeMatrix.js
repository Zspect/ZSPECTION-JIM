import React, {Component,useState} from 'react';
import {Text, View,StyleSheet,ScrollView, TextInput} from 'react-native';
import { Table, Row, Cols, Rows, Cell, TableWrapper } from "react-native-table-component"
const tableHead = ["Area \n (sq. ft.)", "Price \n ($)", "Duration \n (min)"]
const area=["0-100","100-200","200-300","300-400"]
const price=[50,100,150,200]
const duration=[60,20,120,180]
export const HomeMatrix = props => {
  return (
    <View style = {styles.container}>
    <View style={styles.horizontalLine}></View>
     <View style = {styles.headerContainer}>
         <Text style = {styles.heading}>Foundation Type</Text>
         <View style={styles.verticalLine}></View>
         <Text style = {styles.heading}>Property Type</Text>
     </View>
     {tableView()}
    </View>
  );
}
const onCellTextChange=(text,data,index)=>{
  console.log("CELL CHANGED :", text,data,index)
}
const tableView=()=> {
      let reQ = []
      for (let i = 0; i < duration.length; i++) {
        reQ[i] = new Array(area[i], price[i], duration[i])
      }
      const element = (data, index) => (
        // console.log("DATA, INDEX : " ,data, index)
        <TextInput
         onChangeText={text => {
                  onCellTextChange(text,data,index)
                }}
        />
      );
      return (
        <View>
            <Table borderStyle={{borderWidth: 1, borderColor: '#C1C0B9'}}>
              <Row data={tableHead} flexArr={[1, 1, 1]} style={styles.tableHead} textStyle={styles.tableText}/>
            </Table>
            <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
            {
                reQ.map((rowData, index) =>(
                  <TableWrapper key={index} style={[styles.row, index%2 && {backgroundColor: '#ebf1e9'}]}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} 
                          data={(cellIndex === 1 || cellIndex === 2) ? element(cellData, index) : cellData}
                          textStyle={styles.tableText}
                    />
                  ))
                }
              </TableWrapper>
                  ))
                }
            </Table>
            </ScrollView>
          </View>
      )
    
  }
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#5b9bd5",
    },
    headerContainer:{
        flexDirection:"row",
        justifyContent:'center',
        alignItems:"center"
    },
    heading:{
        flex:1,
        color:"white",
        fontSize:22,
        textAlign:'center'
    },
    horizontalLine:{
        height:1,
        backgroundColor:'grey'
    },
    verticalLine:{
        width:1,
        backgroundColor:'grey',
        height:45
    },
    tableHead: {
        height: 80,
        backgroundColor:"#67778b",
    },
    row: {
        flexDirection:'row',
        height: 40,
        backgroundColor:"#d6e3cf",
    },
    tableText: {
        margin:6,
        textAlign:"center",
        color:"white",
        fontSize:18,
    },
    rowText: {
        margin:6,
        paddingVertical:3,
        textAlign:"center",
        fontSize:18
    },
    dataWrapper: { marginTop: -1 },
})