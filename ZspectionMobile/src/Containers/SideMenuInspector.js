import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NavigationActions, SafeAreaView } from 'react-navigation'
import { ScrollView, Text, View, StyleSheet, Dimensions, Image, Modal, TouchableOpacity, Alert } from 'react-native'
const SW = Dimensions.get('window').width
const SH = Dimensions.get('window').height

import Icon from 'react-native-vector-icons/EvilIcons';
import AsyncStorage from '@react-native-async-storage/async-storage'


const menuData = [
  { image: 'user', route: 'Inspections', title: 'Inspections' },
  // { image: 'calendar', route: 'InspectorBooking', title: 'Offline Booking' },
  { image: require('../../assets/images/group_958.png'), route: 'InspectorProfile', title: 'Profile'},
  { image: require('../../assets/images/group_958.png'), route: 'InspectorAvailability', title: 'Availability'},
  { image: require('../../assets/images/group_958.png'), route: 'BookingRoute', title: 'Booking'},
  // { image: require('../../assets/images/availabilty.png'), route: 'InspectorAvailabilityRoute', title: 'Availability' },
  // { image: require('../../assets/images/pricematrix.png'), route: 'PriceMatrixRoute', title: 'Price Matrix' },
  { image: require('../../assets/images/group_962.png'), route: 'ChangePasswordInspectorRoute', title: 'Change Password' },
  { image: require('../../assets/images/logout.png'), route: 'Logout', title: 'Logout' },
]

export class SideMenuInspector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    }
  }

  logoutData = async () => {
    await AsyncStorage.removeItem('roleid');
    await AsyncStorage.removeItem('userid');
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('profile');
    this.props.navigation.navigate('UserSelection');
    console.log("Logout done successfully.");
  }
  
  signout() {
    Alert.alert(
      '',
      'Are you sure you want to logout?',
      [
        {
          text: 'No',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: 'Yes', onPress: () => this.logoutData() },
      ],
      { cancelable: false },
    );
  }
  navigateToScreen = (route) => () => {
    if (route === 'Logout') {
      this.signout();
    }
    else {
      const navigateAction = NavigationActions.navigate({
        routeName: route,
      })
      this.props.navigation.toggleDrawer()
      this.props.navigation.dispatch(navigateAction)
    }
  }
  closeModal = () => {
    this.setState({ modalVisible: false });
  }
  logoutUser = () => {
    this.setState({ modalVisible: false }, () => {
      this.props.logoutFromLogin({});
      this.props.logoutFromSignUp({});
      this.props.navigation.replace('LoginScreen');
    });
  }
  getItems = () => {
    return menuData.map((item) => {
      return (
        <TouchableOpacity onPress={this.navigateToScreen(item.route)}>
          <View style={menuStyle.itemContainer}>
            <View style={{ flexDirection: 'row', flex: 0.99 }}>
              {
                !isNaN(item.image) ?
                  <Image source={item.image} style={menuStyle.iconPic} /> :
                  <Icon type='font-awesome' name={item.image} size={35} color={'grey'} />
              }
              <Text style={menuStyle.itemText}>{item.title}</Text>
            </View>
            {/* <Image source={Images.arrowNext} style={menuStyle.arrowNext} /> */}
          </View>
          <View style={menuStyle.separator}></View>
        </TouchableOpacity>
      )
    })
  }

  render() {
    // const {data} =this.props.profile;
    // console.log("Profile data is ", data)
    // let picURL = data && data.profilePictureURL!==undefined && data.profilePictureURL!== null ? data.profilePictureURL : undefined;
    return (
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <ScrollView>
          {this.getItems()}
        </ScrollView>
      </SafeAreaView>
    )
  }
}

SideMenuInspector.propTypes = {
  navigation: PropTypes.object,
}

const menuStyle = StyleSheet.create({
  profileContainer: {
    flex: 1,
    height: SH * 0.15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePic: {
    width: SW * 0.15,
    height: SW * 0.15,
    borderWidth: 1,
    borderColor: '#707070',
    borderRadius: (SW * 0.15) / 2,
  },
  iconPic: {
    width: (SW * 0.15) / 2,
    height: (SW * 0.15) / 2,
  },
  arrowNext: {},
  profileName: {
    fontSize: (SH * 0.15) / 6,
    fontWeight: 'bold',
    marginLeft: (SW * 0.15) / 5,
  },
  itemText: {
    fontSize: (SH * 0.15) / 6,
    marginLeft: (SW * 0.15) / 5,
  },
  separator: {
    height: (SH * 0.1) / 60,
    backgroundColor: '#e1e1e1',
    marginHorizontal: (SW * 0.15) / 10,
  },
  itemContainer: {
    flex: 1,
    height: SH * 0.08,
    flexDirection: 'row',
    alignItems: 'center',
  },
})
// const mapStateToProps = (state) => ({
//   signupData: state.user,
//   profile:state.profile,
// })

// const mapDispatchToProps = (dispatch) => ({
//   logoutFromLogin: (data) => dispatch(LoginAction.login(data)),
//   logoutFromSignUp: (data) => dispatch(SignupAction.signup(data)),
// })

// export default connect(
//  mapStateToProps,
//  mapDispatchToProps
// )(SideMenu)
