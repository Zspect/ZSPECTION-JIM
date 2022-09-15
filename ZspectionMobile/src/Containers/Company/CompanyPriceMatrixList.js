import React, { Component, useEffect, useState } from 'react';
import {
    Platform, StyleSheet, View, Text, ScrollView, Image, RefreshControl,
    FlatList, TouchableOpacity, TextInput, ActivityIndicator
} from 'react-native';
import Modal from "react-native-modal";
import { deviceHeight, deviceWidth } from '../../constants/Constants.js';
import colors from '../../utils/colors.js';
import Common from '../Common/index.js';
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { API } from "../../network/API";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showToastMsg } from '../../utils.js';
import { INSPECTION_TYPE, range } from '../../utils/utils.js';
import EmptyUI from '../../Components/EmptyUI.js';


let compayID = 0
const CompanyPriceMatrixList = ({ navigation }) => {
    const [priceMatrix, setPriceMatrix] = useState([])
    const [priceMatrixLading, setPriceMatrixLoading] = useState(false)
    const [isModal, setIsModal] = useState(false)
    const [isModalType, setIsModalType] = useState(0)
    const [infectionType, setInfectionType] = useState('')
    const [saveInfectionType, setSaveInfectionType] = useState('')
    const [saveInspector, setSaveInspector] = useState('')

    useEffect(() => {
        let focusSubscription = navigation.addListener(
            'didFocus',
            payload => {
                console.log("pppppppppp", payload)
                setIsModal(false)
                setIsModalType(0)
                setInfectionType('')
                setSaveInfectionType('')
                setSaveInspector('')
                getPriceMatrix()
            },
        );
        setPriceMatrixLoading(true)
        getPriceMatrix()
        AsyncStorage.removeItem("inspectorDataSave")
        fetchInfectionType()
        //return focusSubscription.remove()
    }, [])


    useEffect(() => {
        console.log("posdposapd >", saveInspector)
        getPriceMatrix()
    }, [saveInfectionType])


    useEffect(() => {
        console.log("posdposapd >", saveInspector)
        getPriceMatrix()
    }, [saveInspector])

    const fetchInfectionType = async () => {
        compayID = await AsyncStorage.getItem('companyId');
        API.fetchInfectionTypeFromCompanyId(infectionTypeRes, compayID)
    }

    const infectionTypeRes = {
        success: (response) => {
            console.log("sdsadsad >>", response.data)
            setInfectionType(response.data)
        },
        error: (error) => {
            console.log("company_inspector_error>>>", error)
        }
    }

    const getPriceMatrix = async () => {
        let cid = await AsyncStorage.getItem('companyId');
        setPriceMatrixLoading(true)
        let data = {
            "areaRangeId": 0,
            "inspectorId": saveInspector ? saveInspector.inspectorId : 0,
            "companyId": cid,
            "inspectionTypeId": saveInfectionType ? saveInfectionType.id : 0,
            "pTypeId": 0,
            "fTypeId": 0
        }
        API.fetchPriceMatrixNew(copanyPriceSrc, data)
    }


    const copanyPriceSrc = {
        success: (response) => {
            console.log("price_matrix  >>", response)
            setPriceMatrix(response.data)
            setPriceMatrixLoading(false)
        },
        error: (error) => {
            console.log("price_matrix err >>", error)
            setPriceMatrix([])
            setPriceMatrixLoading(false)
        }
    }

    const switchToAddINspector = () => {
        AsyncStorage.removeItem("inspectorDataSave")
        navigation.navigate('ComPriceMatrix')
    }

    const switchToNAvigate = (item, index) => {
        AsyncStorage.removeItem("inspectorDataSave")
        navigation.navigate('ComPriceMatrix', {
            params: item
        })
    }

    const renderItemData = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ width: '95%', alignSelf: 'center', marginBottom: 10 }}
                onPress={() => switchToNAvigate(item, index)}
            >
                <Text style={{ fontSize: 16, fontWeight: '800' }}>{'Inspection Type :- ' + item.inspectionTypeName}</Text>
                <Text style={{ fontSize: 13, marginTop: 4 }}>{'Inspector :- ' + item.inspectorName}</Text>
                <Text style={{ fontSize: 13, marginTop: 4 }}>{'price :- ' + item.price}</Text>
                {item.inspectionTypeId == INSPECTION_TYPE[2].id ?
                    <Text style={{ fontSize: 13, marginTop: 4 }}>{'No. of pool :- ' + item.noOfPool}</Text> :
                    item.inspectionTypeId == INSPECTION_TYPE[3].id ?
                        <Text style={{ fontSize: 13, marginTop: 4 }}>{'No. of stories :- ' + item.noOfStories}</Text> :
                        item.inspectionTypeId == INSPECTION_TYPE[4].id ?
                            <Text style={{ fontSize: 13, marginTop: 4 }}>{'No. of chimney :- ' + item.noOfChimney}</Text> :
                            <Text style={{ fontSize: 13, marginTop: 4 }}>{'Area :- ' + item.minArea + ' - ' + item.maxArea}</Text>
                }

                <View style={{
                    width: '95%', height: 0.5, backgroundColor: 'gray',
                    marginBottom: 5, marginTop: 15
                }} />
            </TouchableOpacity>
        )
    }

    const modalTypeHeading = () => {
        let heading = ''
        if (isModalType == 0) {
            heading = "Select Inspection Type"
        }
        else if (isModalType == 1) {
            heading = "Select Inspector"
        }
        return heading;
    }

    const closeModal = () => {
        setIsModalType(-1)
        setIsModal(false)
    }

    const fetchInspector = () => {
        API.fetchInspectorFromInfectionTypeCompayId(inspectorTypeRes, compayID + '/' + saveInfectionType.id)
    }

    const inspectorTypeRes = {
        success: (response) => {
            console.log("company_inspector >>>", response)
            setInfectionType(response.data)
        },
        error: (error) => {
            console.log("company_inspector_error>>>", error)
        }
    }

    const renderModalItem = ({ item, index }) => {
        console.log("dnasndka >>", isModalType)
        if (isModalType == 0) {
            return (
                <TouchableOpacity style={{ width: deviceWidth * 0.5, height: 45, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        setSaveInfectionType(item)
                        setSaveInspector('')
                        closeModal()
                    }}
                >
                    {/* <MaterialCommunityIcons
                        name='checkbox-blank-outline'
                        color={colors.black}
                        size={20}
                    /> */}
                    <Text style={{ marginHorizontal: 10 }}>{item.name}</Text>
                </TouchableOpacity>
            )
        }
        else if (isModalType == 1) {
            return (
                <TouchableOpacity style={{ width: deviceWidth * 0.5, height: 45, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => {
                        setSaveInspector(item)
                        closeModal()
                    }}
                >
                    <Text style={{ marginHorizontal: 10 }}>{item.firstName + ' ' + item.lastName}</Text>
                </TouchableOpacity>
            )
        }

        else {
            return null
        }
    }

    const clearFilter = () => {
        setSaveInfectionType('')
        setSaveInspector('')
        getPriceMatrix()
    }

    return (
        <View style={{ flex: 1, backgroundColor: colors.white }}>
            <View style={{ flex: 1 }}>
                <View style={{
                    width: '100%', height: 70, justifyContent: 'center',
                    alignContent: 'center', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 5
                }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={styles.main_container}>
                            <Text style={styles.heading_txt_style}>Inspection Type</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    fetchInfectionType()
                                    setIsModalType(0)
                                    setIsModal(true)
                                }}
                            >
                                <Text style={styles.value_txt_style}>{saveInfectionType ? saveInfectionType.name : 'Select Inspection Type'}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{ width: 1, height: 40, backgroundColor: 'red' }} />
                        <View style={styles.main_container}>
                            <Text style={styles.heading_txt_style}>Inspector Type</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    if (saveInfectionType) {
                                        fetchInspector()
                                        setIsModalType(1)
                                        setIsModal(true)
                                    } else {
                                        showToastMsg("please select inspection type")
                                    }
                                }}
                            >
                                <Text style={styles.value_txt_style}>{saveInspector ? saveInspector.firstName + ' ' + saveInspector.lastName : 'Select Inspector Type'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {saveInfectionType || saveInspector ?
                        <TouchableOpacity style={{
                            height: 40,
                            backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, paddingHorizontal: 8,
                            justifyContent: 'center', alignContent: 'center', alignItems: 'center', marginRight: 8
                        }}
                            onPress={() => clearFilter()}
                        >
                            <Text style={{ fontSize: 14, color: colors.white, }}>Clear</Text>
                        </TouchableOpacity> : null
                    }


                    {/* <TouchableOpacity style={{
                        height: 40,
                        backgroundColor: colors.toolbar_bg_color, borderRadius: 10, paddingHorizontal: 5,
                        justifyContent: 'center', alignContent: 'center', alignItems: 'center'
                    }}
                        onPress={() => switchToAddINspector()}
                    >
                        <MaterialCommunityIcons color={colors.white} name='plus-circle-outline' size={25} />
                    </TouchableOpacity> */}
                </View>

                {priceMatrixLading ? <ActivityIndicator color={colors.toolbar_bg_color} size='large' /> :
                    priceMatrix.length > 0 ?
                        <View style={{ flex: 1, marginTop: 10 }}>
                            <FlatList
                                data={priceMatrix}
                                renderItem={renderItemData}
                                style={{ flex: 1 }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View> :
                        <EmptyUI />
                }

            </View>

            <Modal
                testID={'modal'}
                isVisible={isModal}
                onBackButtonPress={() => {
                    setIsModal(false)
                }}
                onBackdropPress={() => {
                    setIsModal(false)
                }}
                style={styles.modal_view}>
                <View style={{ width: deviceWidth, height: deviceHeight * 0.5, backgroundColor: colors.white }}>
                    <View style={{ flex: 1, width: deviceWidth * 0.9, alignSelf: 'center' }}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                color: colors.toolbar_bg_color,
                                fontWeight: 'bold', textTransform: 'uppercase', flex: 1
                            }}>{modalTypeHeading()}</Text>
                            <TouchableOpacity
                                onPress={() => setIsModal(false)}
                            >
                                <AntDesign name='closecircle' color={colors.toolbar_bg_color} size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <FlatList
                                data={infectionType}
                                renderItem={renderModalItem}
                                style={{ flex: 1 }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1, alignContent: 'center', justifyContent: 'center', alignItems: 'center'
    },
    heading_txt_style: {
        color: colors.toolbar_bg_color, fontSize: 14, fontWeight: '900'
    },
    value_txt_style: {
        color: colors.black, fontSize: 14,
    },
    divider: {
        width: '100%', height: 1, backgroundColor: colors.gray, marginVertical: 10
    },
    modal_view: {
        justifyContent: 'flex-end',
        margin: 0,
    }
})

export default CompanyPriceMatrixList;
