import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, ScrollView, Image, Alert, StatusBar, ActivityIndicator} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { withNavigation } from 'react-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import ShortcutBadger from 'react-native-shortcut-badge';
class Notifications extends Component {
	constructor(props) {
		super(props)
	}

	async componentDidMount() {
	   this.checkPermission();
	   this.setDeviceInfo();
	//    this.createNotificationListeners();
	}

	componentWillUnmount() {
	//   this.notificationListener();
	//   this.notificationOpenedListener();
	}

	async setDeviceInfo() {
		this.setDeviceId(DeviceInfo.getUniqueId());
		// DeviceInfo.getUniqueId().then(uniqueId => {
			
		// });
		
	}

	async setDeviceId(deviceId) {
		await AsyncStorage.setItem('deviceId', deviceId);
	}

	async checkPermission() {
	//   const enabled = await firebase.messaging().hasPermission();
	//   if (enabled) {
	//       this.getToken();
	//   } else {
	//       this.requestPermission();
	//   }
	}

	async createNotificationListeners() {
	  /*
	  * Triggered when a particular notification has been received in foreground
	  * */
	  this.notificationListener = firebase.notifications().onNotification(async (notification) => {
	      const { title, body } = notification;
	      const badgeCount = await firebase.notifications().getBadge();
	      
	      const localNotification = new firebase.notifications.Notification({
	      	show_in_foreground: true,
	      })
	        .setNotificationId(notification.notificationId)
	        .setTitle(notification.title)
	        .setBody(notification.body)
	        .ios.setBadge(notification.ios.badge)
	        .android.setChannelId('seeinghearts_notification_channel')
	        .android.setSmallIcon('@drawable/ic_launcher')
	        .android.setColor('#00B5EC')
	        .android.setPriority(firebase.notifications.Android.Priority.High);

	        firebase.notifications()
	        .displayNotification(localNotification)
	        .catch(err => console.log("error: ",err))
	  		console.log("badgeCount: ",badgeCount);

	        firebase.notifications().setBadge(badgeCount + 1);
	        // ShortcutBadger.setCount(badgeCount + 1);

	  });

	  const channel = new firebase.notifications.Android.Channel('zspection_notification_channel', 'zspection', firebase.notifications.Android.Importance.Max)
	    .setDescription('zspection Channel');
	    
	  // Create the channel
	  firebase.notifications().android.createChannel(channel);

	  /*
	  * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
	  * */
	  this.notificationOpenedListener = firebase.notifications().onNotificationOpened(async (notificationOpen) => {
	      const { title, body } = notificationOpen.notification;
	      console.log("notificationOpen: ",notificationOpen);

	      const badgeCount = await firebase.notifications().getBadge();
	      firebase.notifications().setBadge(badgeCount - 1);
	  });

	  /*
	  * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
	  * */
	  const notificationOpen = await firebase.notifications().getInitialNotification();
	  if (notificationOpen) {
	  		// const badgeCount = await notifications.getBadge();
	  		// notifications.setBadge(badgeCount - 1);

	      	// this.props.navigation.navigate('NotificationPage',{"data":notificationOpen.notification.data});
	      // if(notificationOpen.notification.data) {
	      // 	this.props.navigation.navigate('NotificationPage',{"data":notificationOpen.notification.data});
	      // }
	      
	  }
	  else {
	  	// this.props.navigation.navigate('Auth');
	  }
	  /*
	  * Triggered for data only payload in foreground
	  * */
	  this.messageListener = firebase.messaging().onMessage((message) => {
	    //process data message
	    console.log(JSON.stringify(message));
	  });
	}

	showAlert(title, body) {
	  Alert.alert(
	    title, body,
	    [
	        { text: 'OK', onPress: () => console.log('OK Pressed') },
	    ],
	    { cancelable: false },
	  );
	}
	

	async requestPermission() {
	  try {
	      await firebase.messaging().requestPermission();
	      // User has authorised
	      this.getToken();
	  } catch (error) {
	      // User has rejected permissions
	      console.log('permission rejected');
	      this.checkPermission();
	  }
	}

	async getToken() {
	  fcmToken = await firebase.messaging().getToken();
	  if (fcmToken) {      
		// user has a device token
		await AsyncStorage.setItem('fcmToken', fcmToken);
		console.log("fcmToken: ",fcmToken)
		// this.props.navigation.navigate('Auth'); // it was commented due to which screen was stuck on splash when we re open the app after company registration.
	  }
	  else {
		  this.requestPermission();
	  }
	}


	render() {
		return null;
	}
}
export default withNavigation(Notifications);