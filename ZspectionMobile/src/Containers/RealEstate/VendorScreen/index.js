import React, { Component, useEffect, useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, FlatList, StyleSheet,BackHandler } from 'react-native';
import EmptyUI from '../../../Components/EmptyUI';
import Loader from '../../../Components/Loader';
import Toolbar from '../../../Components/Toolbar';
import { deviceWidth } from '../../../constants/Constants';
import { API } from '../../../network/API';
import { showToastMsg } from '../../../utils';
import colors from '../../../utils/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Modal from "react-native-modal";
import { deviceHeight } from '../../../utils/utils';


const VendorScreen = ({ navigation }) => {
    const [partnerList, setPartnerList] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [updatePartnerList, setUpdatePartnerList] = useState([])
    const [isModalShow, setIsModalShow] = useState(false)
    const [isSortModalShow, setIsSortModalShow] = useState(false)
    const [modalType, setModalType] = useState(0)
    const [sortList, setSortList] = useState([])
    const [categoriesName, setCategoriesName] = useState('')
    const [cityName, setCityName] = useState('')
    const [companyName, setCompanyName] = useState('')
    const [sortLoading, setSortLoading] = useState(false)

    function handleBackButtonClick() {
        BackHandler.exitApp()
        return true;
    }

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
        fetchPartnerList()
        return () => {
            BackHandler.removeEventListener("hardwareBackPress", handleBackButtonClick);
        };

    }, [])

    useEffect(() => {
        if (modalType == 1) {
            fetchCompanyList()
        }
        else if (modalType == 2) {
            fetchCategoriesList()
        }
        else if (modalType == 3) {
            fetchCityList()
        }
        if (modalType > 0) {
            setIsSortModalShow(true)
        }

    }, [modalType])

    const fetchCompanyList = () => {
        setSortLoading(true)
        API.fetchParterCompanyList(categoriesRes, '')
    }

    const categoriesRes = {
        success: (response) => {
            console.log("company_reg_res>>>", response)
            setSortList(response.data)
            setSortLoading(false)
        },
        error: (error) => {
            console.log("company_reg_error>>>", error)
            setSortList([])
            setIsSortModalShow(false)
            setSortLoading(false)
        }
    }


    const fetchCategoriesList = () => {
        setSortLoading(true)
        API.fetchPartnerCategoryList(categoriesRes, '')
    }

    const fetchCityList = () => {
        setSortLoading(true)
        API.fetchPartnerCityList(categoriesRes, '')
    }

    useEffect(() => {
        let text = search.toLowerCase()
        let partners = partnerList
        let filteredName = partners.filter((item) => {
            let array = ''
            if (item.emailId && item.emailId.toLowerCase().match(text)) {
                array = item
            }
            else if (item.categoryName && item.categoryName.toLowerCase().match(text)) {
                array = item
            }
            return array
        })
        setUpdatePartnerList(filteredName)
    }, [search])

    const fetchPartnerList = () => {
        setIsLoading(true)
        let data = {
            "categoryName": categoriesName,
            "companyName": companyName,
            "cityName": cityName
        }
        API.fetchPartnerList(partnerListRes, data)
    }

    const partnerListRes = {
        success: (response) => {
            console.log("parthner_list_res>>>", response)
            setPartnerList(response.data)
            setUpdatePartnerList(response.data)
            setIsLoading(false)
        },
        error: (error) => {
            console.log("parthner_list_error>>>", error)
            showToastMsg(error.message);
            setPartnerList([])
            setUpdatePartnerList([])
            setIsLoading(false)
        }
    }

    const renderPartnerItem = ({ item, index }) => {

        return (
            <TouchableOpacity style={{ width: '100%', marginVertical: 5, marginHorizontal: 10 }}
                onPress={() => navigation.navigate("VendorDetails", {
                    itemObj: item
                })}
            >
                <View style={styles.child_main_view}>
                    <Text style={styles.child_heading_txt}>Name :- </Text>
                    <Text style={styles.child_value_value_txt}>{item.firstName ? item.firstName + ' ' + item.lastName : "-"}</Text>
                </View>

                <View style={styles.child_main_view}>
                    <Text style={styles.child_heading_txt}>Category :- </Text>
                    <Text style={styles.child_value_value_txt}>{item.categoryName ? item.categoryName : '-'}</Text>
                </View>

                <View style={styles.child_main_view}>
                    <Text style={styles.child_heading_txt}>Email ID :- </Text>
                    <Text style={styles.child_value_value_txt}>{item.emailId ? item.emailId : '-'}</Text>
                </View>

                <View style={styles.child_main_view}>
                    <Text style={styles.child_heading_txt}>Mobile :- </Text>
                    <Text style={styles.child_value_value_txt}>{item.mobile ? item.mobile : '-'}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    const onSearchValue = (val) => {
        setSearch(val)
    }

    const saveData = (item) => {
        if (modalType == 1) {
            setCompanyName(item)
        }

        else if (modalType == 2) {
            setCategoriesName(item)
        }

        else if (modalType == 3) {
            setCityName(item)
        }
        setModalType(0)
        setIsSortModalShow(false)
    }

    const renderSortItem = ({ item, index }) => {
        return (
            <TouchableOpacity style={{ width: deviceWidth * 0.85, paddingVertical: 6, alignSelf: 'center' }}
                onPress={() => saveData(item)}
            >
                <Text style={{ fontSize: 14, color: colors.txtColor }}>{item}</Text>
            </TouchableOpacity>
        )
    }

    const renderFlatlist = () => {
        return (
            <View style={{ flex: 1 }}>
                {sortLoading ? <Loader /> :
                    <FlatList
                        data={sortList}
                        keyExtractor={(item, index) => `${index}`}
                        renderItem={renderSortItem}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => {
                            return (<EmptyUI />)
                        }}
                    />
                }
            </View>
        )
    }

    const renderHeader = () => {
        let header = ''
        if (modalType == 1) {
            header = "Select Company"
        }
        else if (modalType == 2) {
            header = "Select Categories"
        }
        else if (modalType == 3) {
            header = "Select City"
        }
        return (
            <Text style={{
                color: colors.toolbar_bg_color,
                fontWeight: 'bold', textTransform: 'uppercase', flex: 1
            }}>{header}</Text>
        )
    }

    const searchFilter = () => {
        fetchPartnerList()
        setIsModalShow(false)
        setModalType(0)
        setIsSortModalShow(false)
    }

    const clearFilter = () => {
        setCompanyName('')
        setCityName('')
        setCategoriesName('')
        setIsModalShow(false)
        setIsSortModalShow(false)
        setTimeout(() => {
            setIsLoading(true)
            let data = {
                "categoryName": '',
                "companyName": '',
                "cityName": ''
            }
            API.fetchPartnerList(partnerListRes, data)
        }, 800)
        setModalType(0)
    }

    return (
        <View style={{ flex: 1 }}>
            {/* <Toolbar
                onCallbackPress={() => navigation.toggleDrawer()}
                title={'Vendors'}
            /> */}
            <View style={{ flex: 1 }}>
                <View style={{ width: deviceWidth, height: 45, flexDirection: 'row', marginVertical: 5, paddingHorizontal: 10, }}>
                    <View style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                        <AntDesign name='search1' color={colors.gray} size={29} />
                        <TextInput
                            style={{ flex: 1, color: colors.txtColor, fontSize: 14, marginHorizontal: 5 }}
                            placeholder='Category, Email ID'
                            onChangeText={(val) => setSearch(val)}
                            value={search}
                        />
                    </View>
                    <TouchableOpacity
                        style={{
                            flex: 0.13, backgroundColor: colors.toolbar_bg_color,
                            justifyContent: 'center', alignContent: 'center', alignItems: 'center', borderRadius: 35
                        }}
                        onPress={() => setIsModalShow(true)}
                    >
                        <MaterialCommunityIcons name='filter' color={colors.white} size={25} />
                    </TouchableOpacity>
                </View>
                <View style={{ width: deviceWidth, height: 1, backgroundColor: colors.toolbar_bg_color }} />

                {isLoading ? <Loader /> :
                    updatePartnerList.length > 0 ?
                        <FlatList
                            data={updatePartnerList}
                            keyExtractor={(item, index) => `${index}`}
                            renderItem={renderPartnerItem}
                            ItemSeparatorComponent={() => <View style={{ width: '100%', height: 1, backgroundColor: colors.lightGray }} />}
                        /> : <EmptyUI />
                }

            </View>
            <Modal
                isVisible={isModalShow}
                onBackButtonPress={() => {
                    setIsModalShow(false)
                }}
                onBackdropPress={() => {
                    setIsModalShow(false)
                }}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}>
                <View style={{ width: deviceWidth, height: deviceHeight * 0.5, backgroundColor: colors.white }}>
                    <View style={{ flex: 1, width: deviceWidth * 0.9, alignSelf: 'center' }}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{
                                color: colors.toolbar_bg_color,
                                fontWeight: 'bold', textTransform: 'uppercase', flex: 1
                            }}>{'Sort Partner Directory'}</Text>
                            <TouchableOpacity
                                onPress={() => setIsModalShow(false)}
                            >
                                <AntDesign name='closecircle' color={colors.toolbar_bg_color} size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={styles.modal_main_touch_style}
                                onPress={() => {
                                    setModalType(1)
                                }}
                            >
                                <Text style={styles.modal_main_txt_heading}>Company</Text>
                                <Text style={styles.modal_main_val_txt}>{companyName ? companyName : 'Select Company'}</Text>
                            </TouchableOpacity>
                            <View style={styles.modal_heading_divider} />

                            <TouchableOpacity style={styles.modal_main_touch_style}
                                onPress={() => {
                                    setModalType(2)
                                }}
                            >
                                <Text style={styles.modal_main_txt_heading}>Categories</Text>
                                <Text style={styles.modal_main_val_txt}>{categoriesName ? categoriesName : 'Select Categories'} </Text>
                            </TouchableOpacity>
                            <View style={styles.modal_heading_divider} />

                            <TouchableOpacity style={styles.modal_main_touch_style}
                                onPress={() => {
                                    setModalType(3)
                                }}
                            >
                                <Text style={styles.modal_main_txt_heading}>City</Text>
                                <Text style={styles.modal_main_val_txt}>{cityName ? cityName : 'Select City'} </Text>
                            </TouchableOpacity>
                            <View style={styles.modal_heading_divider} />

                            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 15 }}>
                                <TouchableOpacity style={{
                                    width: 100, height: 45, backgroundColor: colors.toolbar_bg_color,
                                    justifyContent: 'center', alignItems: 'center', alignContent: 'center', borderRadius: 10, alignSelf: 'center'
                                }}
                                    onPress={() => searchFilter()}
                                >
                                    <Text style={{ color: colors.white, fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold' }}>Search</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    width: 100, height: 45, borderColor: colors.red, borderWidth: 1,
                                    justifyContent: 'center', alignItems: 'center',
                                    alignContent: 'center', borderRadius: 10, alignSelf: 'center', marginLeft: 20
                                }}
                                    onPress={() => clearFilter()}
                                >
                                    <Text style={{ color: colors.red, fontSize: 14, textTransform: 'uppercase', fontWeight: 'bold' }}>Clear</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>


            <Modal
                isVisible={isSortModalShow}
                onBackButtonPress={() => {
                    setIsSortModalShow(false)
                    setModalType(0)
                }}
                onBackdropPress={() => {
                    setIsSortModalShow(false)
                    setModalType(0)
                }}
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                }}>
                <View style={{ width: deviceWidth, height: deviceHeight * 0.5, backgroundColor: colors.white }}>
                    <View style={{ flex: 1, width: deviceWidth * 0.9, alignSelf: 'center' }}>
                        <View style={{ width: '100%', height: 50, justifyContent: 'center', alignContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                            {renderHeader()}
                            <TouchableOpacity
                                onPress={() => {
                                    setIsSortModalShow(false)
                                    setModalType(0)
                                }}
                            >
                                <AntDesign name='closecircle' color={colors.toolbar_bg_color} size={25} />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            {renderFlatlist()}
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    child_main_view: {
        width: '100%', flexDirection: 'row', marginVertical: 2, justifyContent: 'center', alignContent: 'center', alignItems: 'center'
    },
    child_heading_txt: {
        color: colors.gray, fontSize: 12, flex: 0.25
    },
    child_value_value_txt: {
        color: colors.black, fontSize: 12, flex: 1
    },
    modal_main_touch_style: {
        width: deviceWidth * 0.9, justifyContent: 'center', alignContent: 'center'
    },
    modal_main_txt_heading: {
        color: colors.gray, fontSize: 12
    },
    modal_main_val_txt: {
        color: colors.txtColor, fontSize: 14, marginTop: 4
    },
    modal_heading_divider: {
        width: deviceWidth * 0.9, height: 1, backgroundColor: colors.gray, marginVertical: 8
    }
})
export default VendorScreen;