import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions, BackHandler
} from 'react-native';
import {
  Text,
  Form,
} from 'native-base';
import { Icon, Input, Button } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import DateTimePicker from '@react-native-community/datetimepicker';
import GoogleSearch from '../../../../Components/GoogleSearch';
import moment from 'moment';
import { parseGoogleLocation } from '../../../../utils/utils';
import styles from '../../../../../assets/styles/style.js';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ROLE_ID, showToastMsg } from '../../../../utils';

let SW = Dimensions.get('window').width;
let SH = Dimensions.get('window').height;

const InspectionLocationTime = ({ navigation }) => {
  const [address, setAddress] = useState('')
  const [stateStr, setStateStr] = useState('')
  const [zipcode, setZipcode] = useState('')
  const [city, setCity] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [date, setDate] = useState(new Date())
  const [datePass, setPassDate] = useState(moment().format('MM/DD/YYYY'))
  const [timePickerShow, setTimePickerShow] = useState(false)
  const [pickerTime, setPickerTime] = useState(new Date())
  const [displayTime, setDisplayTime] = useState('')
  const [roleId, setRoleID] = useState(0)

  function handleBackButtonClick() {
    navigation.goBack();
    return true;
  }

  useEffect(async () => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    let roleID = await AsyncStorage.getItem('role');
    setRoleID(roleID)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    };
  }, [])

  const mapAddress = (data, details) => {

    AsyncStorage.setItem('AgentRequestedAddress', JSON.stringify(details));
    // this.setState({
    //   address: data.description,
    //   mapAddress: details,
    //   addressText: data.description,
    // });
    var parseAdderss = parseGoogleLocation(details);
    console.log('data?>>>>>>>', parseAdderss);
    if (parseAdderss) {
      setStateStr(parseAdderss.state)
      setZipcode(parseAdderss.zipcode)
      setCity(parseAdderss.city)
      setLatitude(parseAdderss.lat)
      setLongitude(parseAdderss.long)
      setAddress(parseAdderss.addressStr)
    }

    // const {location} = details.geometry;
    // this.setState({
    //   zipcode: parseAdderss.zipcode,
    //   state: parseAdderss.state,
    //   city: parseAdderss.city,
    //   latitude: location.lat,
    //   longitude: location.lng,
    // });
  };


  const onChange = (event, selectedDate) => {
    console.log("oopop >>", selectedDate)
    setPickerTime(selectedDate)
    setTimePickerShow(false)
    // if (time) {
    //   console.log(time, this.state.pickerInputName);
    //   this.setState(
    //     {
    //       time: moment(time).format('HH:mm A'),
    //       displayTime: moment(time).format('HH:mm'),
    //     },
    //     () => {
    //       console.log('Display Time is : ', this.state.displayTime);
    //     },
    //   );
    // }
  };

  /**
   * switch to inspection type slider screen you can add multiple data in inspection side
   */
  const switchToInspectionTypeValue = () => {
    if (address.length == 0) {
      showToastMsg("Please select an address")
    } else {
      let storeScreenData = {
        address: address,
        inspectionlng: longitude,
        inspectionlat: latitude,
        inspectiondate: datePass,
        time: moment(pickerTime).format('HH:mm a'),
      }

      navigation.navigate("InformationSlider", {
        storeLocationData: storeScreenData
      })
    }


    // if (roleId == ROLE_ID[1].id) {
    //   let storeScreenData = {
    //     address: address,
    //     inspectionlng: longitude,
    //     inspectionlat: latitude,
    //     inspectiondate: navigation.state.params.selectedDate,
    //     time: moment(pickerTime).format('HH:mm a'),
    //   }

    //   navigation.navigate("InspectorBooking", {
    //     storeLocationData: storeScreenData
    //   })
    // } else {
    //   let storeScreenData = {
    //     address: address,
    //     inspectionlng: longitude,
    //     inspectionlat: latitude,
    //     inspectiondate: datePass,
    //     time: moment(pickerTime).format('HH:mm a'),
    //   }
    //   navigation.navigate("InformationSlider", {
    //     storeLocationData: storeScreenData
    //   })
    // }


  }


  return <ScrollView
    keyboardShouldPersistTaps="always"
  >
    <View>
      <Form>
        <GoogleSearch
          textInputProps={{
            // onChangeText: text => (addressTextDefault = text),
          }}
          placeholder="Street Address"
          value={address}
          mapAddress={mapAddress}
          icon={true}
        />
        <View style={[styles.twoRow]}>
          <Input
            containerStyle={styles.threeRow}
            disabled
            placeholder="State"
            value={stateStr}
            inputStyle={[styles.font15]}
          />
          <Input
            containerStyle={styles.threeRow}
            disabled
            placeholder="City"
            value={city}
            inputStyle={[styles.font15]}
          />
        </View>
        <Input
          containerStyle={styles.threeRow}
          disabled
          keyboardType="numeric"
          value={zipcode}
          placeholder="Zip"
          inputStyle={[styles.font15]}
        />

        <View style={[styles.sectionColumn]}>
          <DatePicker
            mode="date"
            minDate={new Date()}
            date={date.length > 0 ? date : new Date()}
            placeholder="Date"
            format="MM/DD/YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={date => {
              setDate(date)
              setPassDate(moment(date).format('MM/DD/YYYY'));
            }}
            iconComponent={
              <Icon
                size={20}
                name="calendar"
                type="font-awesome"
                containerStyle={styles.dateIcon}
              />
            }
            customStyles={{
              dateText: styles.dateText,
              dateInput: styles.dateInput,
            }}
          />
        </View>

        <View style={[styles.sectionColumn]}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              paddingTop: 15,
              paddingBottom: 5,
            }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', justifyContent: 'flex-start' }}
              onPress={
                () =>
                  setTimePickerShow(true)
                //this.showDatePicker(this.state.displayTime, 'start_time')
              }>
              <Icon
                size={18}
                name="clock-o"
                type="font-awesome"
                color="black"
                containerStyle={{ textAlignVertical: 'center' }}
              />
              <Text
                style={[styles.dateText, { color: 'black', marginLeft: 10 }]}>
                {pickerTime
                  ? moment(pickerTime, 'hh:mm').format('LT')
                  : 'HH:MM'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
          {timePickerShow && (
            <DateTimePicker
              testID="dateTimePicker"
              value={pickerTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={onChange}
            />
          )}
        </View>
        <View style={styles.center}>
          <Button
            title="Proceed"
            buttonStyle={styleSearch.btnNext}
            onPress={() => switchToInspectionTypeValue()}
          />
        </View>
      </Form>
    </View >
    <StatusBar backgroundColor="#28558E" barStyle="light-content" />


  </ScrollView >;
};

const styleSearch = StyleSheet.create({
  btnNext: {
    backgroundColor: '#28558E',
    paddingHorizontal: SW * 0.051,
    paddingVertical: SH * 0.013,
    borderRadius: 5,
    marginTop: SH * 0.081,
  },
});

export default InspectionLocationTime;
