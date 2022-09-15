import React, { useEffect, useState } from 'react';
import {
    View,
    ScrollView,
    TouchableOpacity, StyleSheet,
    Image,
    TextInput,
    Alert,
} from 'react-native';
import { Text } from 'native-base';
import Loader from '../../../Components/Loader';
import { API } from "../../../network/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../utils/colors.js';
import Toolbar from '../../../Components/Toolbar/index.js';
import { allowedOnlyNumber, formatPhoneNumber, INSPECTION_TYPE, isEmail, isInputEmpty, showToastMsg } from '../../../utils/utils.js';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageResizer from 'react-native-image-resizer';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, RESULTS, openSettings, request } from 'react-native-permissions';

const InspectorProfile = ({ navigation }) => {
    const [profile, setProfile] = useState('')
    const [loading, setIsLoading] = useState(false)
    const [employeeId, setEmployeeId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [inspection, setInspection] = useState('')
    const [geoRadius, setGeoRadius] = useState(0)
    const [zipCode, setZipCode] = useState('')

    useEffect(() => {
        fetchInspectorInfo()
    }, [])

    const fetchInspectorInfo = async () => {
        setIsLoading(true)
        let inspectorID = await AsyncStorage.getItem('inspectorID');
        API.fetchInspectorProfile(fetchInspectorRes, inspectorID)
    }

    useEffect(() => {
        if (profile) {
            setIsLoading(false)
        }
    }, [profile])

    const fetchInspectorRes = {
        success: (response) => {
            console.log("ins_profile_res>>>", response)
            setProfile(response.data)
            setEmployeeId(response.data.employeeId)
            setFirstName(response.data.firstName)
            setLastName(response.data.lastName)
            setEmail(response.data.emailId)
            setMobile(response.data.mobileNumber)
            setInspection(response.data.comaSepratedInspectionName)
            setGeoRadius(response.data.geoRadius)
            setZipCode(response.data.zipCode)
        },
        error: (error) => {
            console.log("ins_profile_error>>>", error)
            setProfile('')
            setIsLoading(false)
        }
    }

    const updateValue = () => {
        if (isInputEmpty(firstName)) {
            showToastMsg("Please enter first name")
        }
        else if (isInputEmpty(lastName)) {
            showToastMsg("Please enter last name")
        }
        else if (isInputEmpty(email)) {
            showToastMsg("Please enter emailId")
        }
        else if (isEmail(email)) {
            showToastMsg("Email must be a valid email address")
        }
        else if (isInputEmpty(mobile)) {
            showToastMsg("Please enter mobile number")
        }
        else if (mobile.length < 14) {
            showToastMsg("Please enter valid mobile number")
        }
        else if (isInputEmpty(geoRadius)) {
            showToastMsg("Please enter Geo radius")
        }
        else {
            let data = {
                "firstName": firstName,
                "lastName": lastName,
                "employeeId": employeeId,
                "zipCode": zipCode,
                "ilatitude": profile.ilatitude,
                "ilongitude": profile.ilongitude,
                "geoRadius": geoRadius,
                "mobileNumber": mobile,
            }
            API.updateInspectorFromCompany(updateInspector, data, profile.inspectorId)
        }
    }

    const updateInspector = {
        success: (response) => {
            console.log("update_ins>>>", response)
            showToastMsg(response.message)
        },
        error: (error) => {
            console.log("update_ins_error>>>", error)
        }
    }

    const photoFromGallery = async () => {
        const result = await launchImageLibrary({
            mediaType: "photo",
            selectionLimit: 1
        });
        imageResize(result)

    }

    const photoUsingCamera = () => {
        request(PERMISSIONS.ANDROID.CAMERA).then((response) => {
            if (response == 'granted') {
                launchCamera({
                    mediaType: "photo",
                    selectionLimit: 1,
                }).then((result) => {
                    imageResize(result) 
                }).catch((error) => {
                })
                // const result = await launchCamera({
                //     mediaType: "photo",
                //     selectionLimit: 1
                // });
                // imageResize(result)
            }else{
                openSettings()
            }
        }).catch((error) => {
            console.log("request_error>>>", error)
        })

    }

    const imageResize = async (resp) => {
        console.log('Picker Response = ', resp);
        if (resp.didCancel) {
            console.log('User cancelled image picker');
        } else if (resp.error) {
            console.log('ImagePicker Error: ', resp);
        } else if (resp.customButton) {
            console.log('User tapped custom button: ', resp.customButton);
        } else {
            let response = resp.assets[0]
            let dataImg = {
                uri: response.uri,
                name: response.fileName,
                filename: response.fileName,
                type: response.type
            }
            var body = new FormData();
            body.append('File', dataImg);
            API.uploadInspectorProfilePic(uploadProfilePic, body,
                profile.inspectorId)
        }
    }

    const uploadProfilePic = {
        success: (response) => {
            console.log("upload_profile_pic>>>", response)
            showToastMsg(response.message)
            fetchInspectorInfo()
        },
        error: (error) => {
            console.log("upload_profile_pic_error>>>", error)

        }
    }

    const profilePicAlert = () => {
        Alert.alert("Profile Image", "Please select profile image", [
            {
                text: 'Camera',
                onPress: () => {
                    photoUsingCamera();
                }
            },
            {
                text: 'Gallery',
                onPress: () => {
                    photoFromGallery()
                }
            },
        ], { cancelable: true })
    }

    return (
        <View style={{ flex: 1, }}>
            <Toolbar
                innerScreen={false}
                title='Profile'
                onCallbackPress={() => navigation.toggleDrawer()}
            />
            <View style={{ flex: 1 }}>
                {loading ? <Loader /> :
                    <ScrollView
                        style={{ flex: 1 }}
                    >
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={{
                                width: 110, height: 110, borderRadius: 80,
                                borderColor: colors.toolbar_bg_color, borderWidth: 1,
                                alignSelf: 'center', marginTop: 15
                            }}
                                onPress={() => profilePicAlert()}
                            >
                                <Image
                                    source={{ uri: profile.profilePic }}
                                    style={{ width: undefined, height: undefined, flex: 1, borderRadius: 80 }}
                                />
                                <View style={{
                                    width: 40, height: 40, backgroundColor: colors.white,
                                    position: 'absolute', right: -10, bottom: 0, borderRadius: 25,
                                    borderColor: colors.loginBlue, borderWidth: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                                }}>
                                    <MaterialCommunityIcons name='camera' color={colors.loginBlue} size={25} />
                                </View>
                            </TouchableOpacity>
                            <View style={{ width: '95%', flex: 1, alignSelf: 'center' }}>
                                <View>
                                    <Text style={styles.heading_txt}>Employee ID</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={employeeId}
                                        editable={false}
                                        onChangeText={(txt) => setEmployeeId(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>First Name</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={firstName}
                                        onChangeText={(txt) => setFirstName(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Last Name</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={lastName}
                                        onChangeText={(txt) => setLastName(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Email</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={email}
                                        editable={false}
                                        onChangeText={(txt) => setEmail(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Mobile</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={mobile}
                                        keyboardType='numeric'
                                        maxLength={14}
                                        onChangeText={(txt) => setMobile(formatPhoneNumber(txt))}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Geo Radius</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={geoRadius.toString()}
                                        keyboardType='numeric'
                                        maxLength={3}
                                        onChangeText={(txt) => setGeoRadius(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Zipcode</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={zipCode}
                                        keyboardType='numeric'
                                        maxLength={6}
                                        onChangeText={(txt) => setZipCode(allowedOnlyNumber(txt))}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <View>
                                    <Text style={styles.heading_txt}>Inspection</Text>
                                    <TextInput
                                        style={styles.value_txt_input}
                                        placeholder='Enter value'
                                        numberOfLines={1}
                                        value={inspection}
                                        editable={false}
                                        onChangeText={(txt) => setInspection(txt)}
                                    />
                                    <View style={styles.divider_style} />
                                </View>

                                <TouchableOpacity style={{
                                    width: 110, height: 40, backgroundColor: colors.loginBlue,
                                    borderRadius: 18, justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center', marginVertical: 25
                                }}
                                    onPress={() => updateValue()}
                                >
                                    <Text style={{ color: colors.white, fontSize: 14, fontWeight: '900' }}>SAVE</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </ScrollView>
                }
            </View>
        </View>
    )

}

const styles = StyleSheet.create({
    heading_txt: {
        color: colors.softBlue, fontSize: 15,
    },
    value_txt_input: {
        width: '100%', color: colors.black, fontSize: 15, padding: 0
    },
    divider_style: {
        width: '100%', height: 1, backgroundColor: colors.lightGray, marginTop: 5, marginBottom: 10
    }
})

export default InspectorProfile