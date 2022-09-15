import React, {Component,useState,useEffect} from 'react';
import {Text, View,StyleSheet,TouchableOpacity,Dimensions,Image} from 'react-native';
import { Icon } from 'react-native-elements';
const screenWidth = Math.round(Dimensions.get('window').width);  
const screenHeight = Math.round(Dimensions.get('window').height);

export const MatrixButton = props => {
    const [clicked, setClicked] = useState(false);
    const clickHandler=()=>{
        setClicked(!clicked);
    }
    props.onMatrixButtonClick && props.onMatrixButtonClick(clicked,props.matrixItem);
    const buttonStyle = clicked===true ? styles.pressed:styles.normal
    useEffect(() => {
      setClicked(false);
    },[]);
  return (
    <TouchableOpacity onPress={clickHandler}  style = {[buttonStyle,styles.orientation]}>
      <Image style={styles.iconStyle} source={{uri: props.iconUri}}/>
      <Text style = {styles.title}>{props.matrixItem.name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    orientation:{flexDirection:"row",justifyContent:"space-around"},
    iconStyle:{
      width:60,
      height:50,
      resizeMode:"contain"
    },
    normal:{
        backgroundColor: '#ffffff',
        height: 80,
        width: screenWidth/2-10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        borderColor:'#d8d8d8',
        borderWidth:1,
        margin:5,
    },
    pressed:{
        backgroundColor: '#ffffff',
        height: 80,
        width: screenWidth/2-10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius:5,
        borderColor:'#069e06',
        borderWidth:1,
        margin:5,
    },
    title:{
      fontSize:20,
    }
})