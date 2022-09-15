import React, { Component } from 'react';
import { Platform, Dimensions, StyleSheet, Text, View, ScrollView, ActivityIndicator, StatusBar } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Circle, AnimatedRegion, Animated } from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API } from '../network/API'


let { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
// const LATITUDE_DELTA = 1;
const LATITUDE_DELTA = 1.1922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// const LONGITUDE_DELTA = 1;
const LATITUDE = 28.5355;
const LONGITUDE = 77.391;
const CONVERSION = 1610;
const KEY = "AIzaSyAaDd5zJGonIbsOhgePQo5j2H1vKJtBw4Y";

import { CheckBox, Avatar, Icon, Input, Button, Slider } from 'react-native-elements';
import style from '../../assets/styles/style.js';
import axios from 'axios';
import Errors from '../Components/Errors';
import Common from '../Containers/Common';
import Loader from '../Components/Loader';
import { relativeTimeThreshold } from 'moment';
// import Geolocation from '@react-native-community/geolocation';

let initState = {
	mile: 5,
	zip: '',
	latitudeDelta: LATITUDE_DELTA,
	longitudeDelta: LONGITUDE_DELTA,
	latitude: 0,
	longitude: 0,
	loading: false,
}

export default class Maps extends Component {

	constructor(props) {
		super(props);
		this.state = initState
		this.common = new Common();
	}






	search = (text) => {
		this.setState({ 'zip': text })
		if (text.length != 5) return;
		var queryString = "https://maps.googleapis.com/maps/api/geocode/json?address=" + text + "&key=" + KEY;
		axios.get(queryString).then(response => {
			console.log("Response of Map api :", response);
			var data = response.data.results[0].geometry;
			var { location } = data;
			console.log("Location found is :", location)
			var coordinate = { latitude: location.lat, longitude: location.lng, latitudeDelta: LATITUDE_DELTA, longitudeDelta: LONGITUDE_DELTA }
			this.setState({
				latitude: location.lat,
				longitude: location.lng,
				// latitudeDelta: location.latitudeDelta,
				// longitudeDelta: location.latitudeDelta
				latitudeDelta: LATITUDE_DELTA,
				longitudeDelta: LONGITUDE_DELTA
			})
			this.map.region = coordinate;
			console.log("Region coordinate : ", this.map.region);
			this.circle.center = { latitude: location.lat, longitude: location.lng };
			this.circle.key = { latitude: location.lat, longitude: location.lng }.toString();
			this.circle.radius = this.state.mile * CONVERSION;

		})
	}

	getInitialRegion() {
		return {
			latitude: this.state.latitude,
			longitude: this.state.longitude,
			latitudeDelta: this.state.latitudeDelta,
			longitudeDelta: this.state.longitudeDelta
		}
	}
	async componentDidMount() {
		this.focusSubscription = this.props.navigation.addListener(
			'didFocus',
			payload => {
				this.setState(initState)
			}
		);

		let zipVal = await AsyncStorage.getItem('zipCode');
		if (zipVal !== null)
			this.search(zipVal)
		let mileVal = await AsyncStorage.getItem('mile');
		if (mileVal !== null && zipVal !== null)
			this.setState({ zip: zipVal, mile: parseInt(mileVal) })
	}

	componentWillUnmount() {
		this.focusSubscription.remove();
		AsyncStorage.setItem("zipCode", this.state.zip);
		AsyncStorage.setItem("mile", '' + this.state.mile);
	}
	onRegionChange(region) {
		this.changePosition(region)
	}

	DragEnd = (response) => {
		this.changePosition(response)
	}

	changePosition(response) {
		var { coordinate } = response.nativeEvent;
		this.setState({
			latitude: coordinate.latitude,
			longitude: coordinate.longitude
		})
	}


	uploadProfilePic = {
		success: (response) => {
			console.log("upload_profile_pic>>", response)
			//this.props.navigation.navigate('InspectorRegisterMatrix', { "inspectorData": response.data })
		},
		error: (error) => {
			console.log("upload_profile_pic> err > ", error)
		}
	}

	saveInspectorRes = {
		success: (response) => {
			this.setState({ loading: false });
			console.log("save_inspector_sucess >>>", response)
			this.common.showToast(response.message)
			if (response.code != 1001) {
				var request = this.props.navigation.getParam('profile');
				var body = new FormData();
				body.append('File', {
					uri: request.profilePic.uri, name: request.profilePic.fileName,
					filename: request.profilePic.fileName, type: request.profilePic.type
				});
				API.uploadInspectorProfilePic(this.uploadProfilePic, body,
					response.data.inspectorId)
				this.props.navigation.navigate('Inspector')

				// AsyncStorage.setItem("inspectorDataSave", JSON.stringify(response.data)).then((data) => {
				// 	console.log("fulll >>", data)
				// 	setTimeout(() => {
				// 		this.props.navigation.navigate('CompanyPriceMatrixRoute')
				// 	}, 1000);

				// 	// AsyncStorage.getItem("inspectorDataSave").then((data) => {
				// 	// 	console.log("adsadsabda >>", data)
				// 	// })
				// }).catch((err) => {
				// 	console.log("fulll  err >>", err)
				// })
				// setTimeout(() => {
				// 	//this.props.navigation.navigate('CompanyPriceMatrixRoute')
				// }, 1000)

			} else {
				this.common.showToast(response.message)
			}
			//this.props.navigation.navigate('InspectorRegisterMatrix', { "inspectorData": response.data })
		},
		error: (error) => {
			console.log("save_inspector_error>>>", error)
			this.setState({ loading: false });
			this.common.showToast(response.message)
		}
	}

	onRegister = async () => {
		if (!this.state.zip) {
			this.common.showToast("Please Enter Zip");
		}
		// else if(this.state.zip && !this.common.validateZipCode(this.state.zip)) {
		// 	this.common.showToast("Please Enter Valid Zip");
		// }
		else {

			var authToken = await AsyncStorage.getItem("authToken");
			await this.getRequestData().then(data => {
				//var response = new API('SaveInspector', data).getResponse();
				console.log("upload_data:: >>", data)
				API.saveInspector(this.saveInspectorRes, data)
				//console.log("Save inspector response: ", response);
				// response.then(result => {
				// 	if (result.response == 201) {
				// 		this.setState({ loading: false },async()=>{
				// 		await AsyncStorage.removeItem('zipCode');
				// 		await AsyncStorage.removeItem('mile');
				// 		this.setState({ zip: '',mile:5 });
				// 		await AsyncStorage.setItem("inspectionTypeID",""+(data.inspectionTypeID)) // Need to remove later when service will return inspectionTypeID
				// 		this.common.showToast(result.message)
				// 		if(data.profilePic!==""){
				// 			console.log("Result when uploading inspector profile : ", result);
				// 			this.setState({ loading: true });
				// 			let picData = data.pic_data;
				// 			var body = new FormData();
				// 			body.append('PhotoFile', { uri: picData.uri, name: picData.fileName, filename: picData.fileName, type: picData.type });
				// 			var photoResult = await new API('UploadInspectorPic', body).getResponse2("/" + result.resultID1);
				// 			console.log("Photo upload result : ",photoResult);
				// 			console.log("Inspector id is : ",result.resultID1);
				// 			if(photoResult.response == 201){
				// 				this.setState({ loading: false })
				// 				this.common.showToast(photoResult.message)
				// 				this.props.navigation.navigate('InspectorRegisterMatrix', { "inspectorData": result })
				// 			}else{
				// 				this.setState({ loading: false })
				// 				this.common.showToast(photoResult.message)
				// 			}
				// 		} else{
				// 			this.props.navigation.navigate('InspectorRegisterMatrix', { "inspectorData": result })
				// 		}
				// 		});
				// 	}
				// 	else {
				// 		this.setState({ loading: false });
				// 		let message = result.response.data.message!==undefined ? result.response.data.message : result.message
				// 		this.common.showToast(message)
				// 	}
				// })
			}).catch(e => {
				this.common.showToast("Failed to save Inspector, try again later")
				this.setState({ loading: false });
			});
		}
	}


	async getRequestData() {
		var request = this.props.navigation.getParam('profile');
		request.flag = 0
		var newRequest = {
			...request,
			"zipcode": this.state.zip,
			"geoRadius": this.state.mile,
			"iLatitude": this.state.latitude,
			"iLongitude": this.state.longitude
		}
		return newRequest;
	}


	render() {
		if (this.state.loading) return <Loader />
		return (
			<View style={{ flex: 1 }}>
				<View>
					<Input
						value={this.state.zip}
						onChangeText={(text) => this.search(text)}
						placeholder="Enter USC Zip"
						keyboardType="numeric"
						inputStyle={style.font14}

					/>
					<View style={{ margin: 10 }}>
						<View style={style.row}>
							<Text style={style.registerOtherComponentsText}>Set Geofencing Radius</Text>
							<Text style={[style.registerOtherComponentsText, { color: '#BE780F' }]}> {this.state.mile} miles</Text>
						</View>
						<Slider
							value={this.state.mile}
							onValueChange={value => this.setState({ mile: value })}
							thumbTintColor="#28558E"
							minimumValue={1}
							maximumValue={50}
							step={1}
							minimumTrackTintColor="#28558E"
						/>
						<View style={[style.row]}>
							<Text style={[style.registerOtherComponentsText, style.twoRow]}>1 mile</Text>
							<Text style={[style.registerOtherComponentsText, style.twoRow, { textAlign: 'right' }]}>50 miles</Text>
						</View>
						<View style={[style.row, { marginTop: 15 }]}>
							<Text style={[style.registerOtherComponentsText, { fontWeight: 'bold' }]}>Note</Text>
							<Text style={[style.registerOtherComponentsText]}> - Drag the map to mark you accurate territory.</Text>
						</View>
					</View>
				</View>
				<View style={{ flex: 1 }}>
					<MapView
						provider={PROVIDER_GOOGLE}
						style={styles.map}
						ref={map => { this.map = map }}
						onPress={(region) => this.onRegionChange(region)}
						region={this.getInitialRegion()}
						mapType="standard"
						initialRegion={this.getInitialRegion()}
						showsBuildings
						showsTraffic
						zoomEnabled
						minZoomLevel={10}
						zoomControlEnabled
						loadingEnabled={true}
						moveOnMarkerPress={false}
						onRegionChangeComplete={(coor) => console.log("onRegionChange: ", coor)}
					>
						<Circle
							center={{ latitude: this.state.latitude, longitude: this.state.longitude }}
							radius={CONVERSION * this.state.mile}
							fillColor="rgba(000,000,000,0.2)"
							strokeWidth={1}
							strokeColor="#000"
							zIndex={1}
							ref={circle => { this.circle = circle }}
						/>
						<MapView.Marker.Animated
							draggable
							ref={marker => { this.marker = marker }}
							coordinate={this.getInitialRegion()}
							onDragEnd={(e) => this.DragEnd(e)}
						/>
					</MapView>

				</View>
				<View style={style.center}>
					<Button
						title="Save"
						buttonStyle={style.btnNext}
						onPress={() => this.onRegister()}>
					</Button>
				</View>
			</View>
		)
	}
}


const styles = StyleSheet.create({
	container: {
		...StyleSheet.absoluteFillObject,
		height: 400,
		width: 400,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	map: {
		...StyleSheet.absoluteFillObject,
	},
});