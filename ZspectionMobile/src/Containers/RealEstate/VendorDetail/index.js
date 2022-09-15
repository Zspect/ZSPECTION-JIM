import React, { Component, useEffect, useState } from 'react';
import {
    View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView,
    Platform, Linking, Alert, BackHandler
} from 'react-native';
import Toolbar from '../../../Components/Toolbar';
import { API } from '../../../network/API';
import { showToastMsg } from '../../../utils';
import colors from '../../../utils/colors';


const VendorDetail = ({ navigation }) => {
    const [itemobj, setItemObj] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [skillList, setSkiilList] = useState([])

    // on back press
    function handleBackButtonClick() {
        navigation.goBack();
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        setItemObj(navigation.state.params.itemObj)
        console.log('navigation_details', navigation.state.params.itemObj)
        fetchVendorDetails()
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };
    }, [])

    const fetchVendorDetails = () => {
        API.fetchPartnerDetails(fetchPartnerDetailsRes, navigation.state.params.itemObj.userId)
    }

    const fetchPartnerDetailsRes = {
        success: (response) => {
            console.log("vndroe_list_res>>>", response)
            setSkiilList(response.data)
        },
        error: (error) => {
            console.log("vndroe_list_error>>>", error)
            // showToastMsg(error.message)
            setSkiilList([])
        }
    }

    const renderPartnerItem = ({ item, index }) => {
        return (
            <View style={{
                borderColor: colors.toolbar_bg_color, borderWidth: 1,
                borderRadius: 15, padding: 10, margin: 5
            }}>
                <Text style={{ color: colors.txtColor, fontSize: 12 }}>{item.name}</Text>
            </View>
        )
    }

    const renderChildValue = (felid) => {
        if (felid) {
            return felid
        }
        return " - "
    }

    const openPhoneDiler = (phone) => {
        let phoneNumber = phone;
        if (Platform.OS !== 'android') {
            phoneNumber = `telprompt:${phone}`;
        }
        else {
            phoneNumber = `tel:${phone}`;
        }
        Linking.canOpenURL(phoneNumber)
            .then(supported => {
                if (!supported) {
                    Alert.alert('Phone number is not available');
                } else {
                    return Linking.openURL(phoneNumber);
                }
            })
            .catch(err => console.log(err));
    }

    const openEmail = (email) => {
        Linking.openURL(`mailto:${email}`)
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView>
                <View style={{ flex: 1, alignContent: 'center', alignItems: 'center' }}>
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>First Name</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.firstName)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Last Name</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.lastName)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <TouchableOpacity style={styles.main_view}
                        onPress={() => openEmail(itemobj.emailId)}
                    >
                        <Text style={styles.heading_txt_style}>Email ID</Text>
                        <Text style={[styles.value_txt_style, { color: colors.toolbar_bg_color, textDecorationLine: 'underline' }]}>{renderChildValue(itemobj.emailId)}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider_view} />
                    <TouchableOpacity style={styles.main_view}
                        onPress={() => openPhoneDiler(itemobj.mobile)}
                    >
                        <Text style={styles.heading_txt_style}>Mobile</Text>
                        <Text style={[styles.value_txt_style, { color: colors.toolbar_bg_color, textDecorationLine: 'underline' }]}>{renderChildValue(itemobj.mobile)}</Text>
                    </TouchableOpacity>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Phone</Text>
                        <Text style={[styles.value_txt_style, { color: colors.toolbar_bg_color }]}>{renderChildValue(itemobj.phone)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Owner Name</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.ownerName)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Website</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.website)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Company Name</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.companyName)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Category</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.categoryName)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Address Line 1</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.addressLine1)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Address Line 2</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.addressLine2)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>City</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.city)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>State</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.state)}</Text>
                    </View>
                    <View style={styles.divider_view} />
                    <View style={styles.main_view}>
                        <Text style={styles.heading_txt_style}>Zipcode</Text>
                        <Text style={styles.value_txt_style}>{renderChildValue(itemobj.zipCode)}</Text>
                    </View>
                    {/* <View style={styles.divider_view} /> */}
                    {skillList.length > 0 ?
                        <View style={{width: '100%' }}>
                            <View style={{ width: '100%', height: 50, justifyContent: 'center', paddingHorizontal: 14 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: colors.toolbar_bg_color }}>Skill list</Text>
                            </View>
                            <View>
                                <FlatList
                                    data={skillList}
                                    keyExtractor={(item, index) => `${index}`}
                                    renderItem={renderPartnerItem}
                                    contentContainerStyle={{
                                        flexDirection: 'row',
                                        flexWrap: 'wrap', marginHorizontal: 8
                                    }}
                                />
                            </View>
                        </View> : null
                    }


                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    main_view: {
        width: '95%', flexDirection: 'row', paddingVertical: 10
    },
    heading_txt_style: {
        flex: 0.5, color: colors.gray, fontSize: 14
    },
    value_txt_style: {
        flex: 1, color: colors.black, fontSize: 15, textAlign: 'right'
    },
    divider_view: {
        width: '100%', height: 1, backgroundColor: colors.lightGray
    }
})

export default VendorDetail;