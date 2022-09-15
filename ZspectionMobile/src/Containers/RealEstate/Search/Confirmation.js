// import React, { Component } from 'react';
// import { Platform, StyleSheet, View, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
// import styles from '../../../../assets/styles/style.js';
// import {
//     Container, Header, Content, Button, Card, CardItem,
//     Text, Body, Form, Item, Input, Picker
// } from 'native-base';
// import { CheckBox, Avatar, Icon } from 'react-native-elements';
// import DatePicker from 'react-native-date-picker'

// export default class Confirmation extends Component {
//     constructor(props) {
//         super(props)
//         this.state = {

//         }
//     }

//     showAlert1() {
//         Alert.alert(
//             '',
//             'Would you like to order your NHD or Home Warranty?',
//             [
//                 {
//                     text: 'No',
//                     onPress: () => console.log('Cancel Pressed'),
//                     style: 'cancel',
//                 },
//                 { text: 'Yes', onPress: () => console.log('OK Pressed') },
//             ]
//         );
//     }

//     renderItem = ({ item }) => {
//         return (
//             <View>
//                 <View style={styles.advertisementSpaces}>
//                     <Text style={styles.white}>Home Inspection</Text>
//                 </View>
//                 <View style={styles.rows}>
//                     <Image source={{ uri: 'https://bootdey.com/img/Content/avatar/avatar7.png' }} style={styles.pic} />
//                     <View>
//                         <View style={styles.nameContainers}>
//                             <Text style={styles.nameTxt}>Kristin</Text>
//                         </View>
//                         <View style={styles.nameContainers}>
//                             <Text style={styles.nameTxt}>Bobs Home Inspection</Text>
//                         </View>
//                     </View>
//                     <View style={{ justifyContent: 'center', alignSelf: 'center', alignContent: 'center' }}>
//                         <Text style={{ color: 'red', marginBottom: 3 }}>$420</Text>
//                         <Icon style={[styles.icons]} name="delete" size={18} color="#333" />
//                     </View>
//                 </View>
//                 <View style={{ paddingLeft: 10 }}>
//                     <Text style={styles.nameTxt}>Jim Smith</Text>
//                 </View>
//             </View>
//         );
//     }
//     render() {
//         return (
//             <ScrollView>
//                 <View style={styles.homeContainer}>
//                     <View style={styles.advertisementSpace}>
//                         <Text style={styles.white}>Advertisement Space</Text>
//                     </View>
//                     <View style={styles.inspectionRequestFormContainer}>
//                         <View style={{ marginTop: 20 }}>
//                             <Text style={{ color: '#28558E' }}>INSPECTION REQUEST:-</Text>
//                         </View>
//                     </View>
//                     <View style={styles.inspectionRequestFormContainer}>
//                         <View style={styles.card}>
//                             <Text style={styles.nameTxt}>Woodland Hills</Text>
//                             <Text style={styles.nameTxt}>20/07/19</Text>
//                         </View>
//                         <View style={styles.card}>
//                             <Text style={styles.nameTxt}>CA-91367</Text>
//                             <Text style={styles.nameTxt}>09:30 PM</Text>
//                         </View>
//                     </View>
//                     <FlatList
//                         extraData={this.state}
//                         //data={this.state.calls}
//                         renderItem={this.renderItem} />
//                     <View style={styles.centers}>
//                         <Button style={styles.loginButton} onPress={this.showAlert1} >
//                             <Text style={styles.textCenter}>Confirm</Text>
//                         </Button>
//                     </View>
//                 </View>
//             </ScrollView>
//         );
//     }
// }