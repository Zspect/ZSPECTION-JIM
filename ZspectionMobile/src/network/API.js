import { URLCollection, API_METHOD, HEADER_KEYS, BASE_URL, REQUEST_FORMATE, } from './UrlCollecton'
import axios from 'axios';
import Constant from '../constants/Constants';

export const API = {
    login: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.LOGIN)
    },
    fetchStaticContent: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.STATIC_CONTENT)
    },
    fetchPrivacyPolicy: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.PRIVACY_POLICY)
    },
    signUp: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.REGISTRATION)
    },
    uploadProfilePic: (onResponse, data, param) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.UPLOAD_PIC + param)
    },
    fetchInfectionType: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.INSPECTION_TYPE)
    },
    fetchInfectionTypeFromCompanyId: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.INSPECTION_TYPE + '?' + data)
    },
    fetchPriceMatrixInfectionType: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.PRICE_MATRIX + '/' + data)
    },
    fetchPriceMatrix: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.PRICE_MATRIX)
    },
    fetchFoundationType: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FOUNDATION_TYPE)
    },
    fetchPropertyTypeTax: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.PROPERTY_TYPE_TAX)
    },
    searchHistory: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.SEARCH_HISTORY)
    },
    searchInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.SEARCH_INSPECTOR)
    },
    bookingAPi: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.BOOKING)
    },
    profileDetails: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.RE_AGENT_PROFILE + data)
    },
    realAgentProfileUpdate: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.RE_AGENT_PROFILE + id)
    },
    realAgentUpdateProfilePic: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.RE_AGENT_PROFILE_PIC + id)
    },
    updateChangePassword: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.UPDATE_CHANGE_PASS)
    },
    fetchFavInpector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FAV_INSPECTOR + data)
    },
    registerCompany: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.REGISTER_COMPANY)
    },
    uploadRegisterCompanyImage: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.UPLOAD_COMPANY_PIC + id)
    },
    fetchDayWiseBookingDetails: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.FETCH_DAYWISE_BOOKING)
    },
    fetchCompanyDetails: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FETCH_COMPANY_DETAILS + data)
    },
    updateCompanyProfile: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.FETCH_COMPANY_DETAILS + id, data)
    },
    updateCompanyProfilePic: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.SAVE_COMPANY_PROFILE_PIC + id, data)
    },
    fetchCompanyInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FETCH_COMPANY_INSPECTOR + data)
    },
    fetchInspectorFromInfectionTypeCompayId: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.COMPANY_INSPECTOR_INSPECTION_TYPE + data)
    },
    fetchPropertyType: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.PROPERTY_TYPE)
    },
    fetchAreaRange: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.AREA_RANGE)
    },
    saveCompanyPriceMatrix: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.COMPANY_PRICE_MATRIX_SAVE)
    },
    saveCompanyChimneyPriceMatrix: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.COMPANY_CHIMNEY_PRICE_MATRIX_SAVE)
    },
    fetchChimneyType: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.CHIMNEY_TYPE_LIST)
    },
    fetchPriceMatrixNew: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.PRICE_MATRIX_GET)
    },
    fetchCompanyInfectionByCoID: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.COMPANY_INSPECTION_BY_CO_ID + data)
    },
    fetchInspectorInfectionByINID: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.INSPECTOR_INSPECTION_BY_IN_ID + data)
    },
    saveInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.SAVE_INSPECTOR)
    },
    fetchInspectorDetails: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FETCH_INSPECTOR_DETAILS + data)
    },
    updateInspectorFromCompany: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.UPDATE_INSPECTOR_FROM_COMPANY + id, data)
    },
    enableDisableInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.ENABLE_DISABLE_INSPECTOR, data)
    },

    fetchPriceMatrixFromData: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.PRICE_MATRIX)
    },
    updatePriceMatrix: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PATCH, URLCollection.UPDATE_PRICE_MATRIX, data)
    },
    priceMatrixStatus: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PATCH, URLCollection.PRICE_MATRIX_STATUS, data)
    },
    addToFavInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.FAV_INSPECTOR)
    },
    removeToFavInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.REMOVE_FAV_INSPECTOR)
    },
    uploadInspectorProfilePic: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.INSPECTOR_PROFILE_PIC + id)
    },
    fetchInspectorBookById: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.INSPECTOR_BOOKING_BY_ID + data)
    },
    fetchInspectorBookByDate: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.INSPECTOR_DATE_WISE_BOOKING)
    },
    fetchInspectorDetailsById: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.INSPECTOR_DETAILS_BY_ID + data)
    },
    acceptBookingByInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PATCH, URLCollection.ACCEPT_BOOKING_BY_INSPECTOR + data)
    },
    rejectBookingByInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PATCH, URLCollection.REJECT_BOOKING_BY_INSPECTOR + data)
    },
    fetchInspectorProfile: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FETCH_INSPECTOR_INFO_BY_ID + data)
    },
    fetchInspectorAvailability: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FETCH_INSPECTOR_HOUR_BY_INS_ID + data)
    },
    updateInspectorAvailability: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.UPDATE_INSPECTOR_HOUR_BY_INS_ID)
    },
    leaveApplyInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.LEAVE_APPLY)
    },
    jobStartTimeUpdate: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PUT, URLCollection.JOB_START_TIME_UPDATE + data)
    },
    closeBookingByInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.PATCH, URLCollection.CLOSE_BOOKING_BY_INSPECTOR + data)
    },
    forgotPassword: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.FORGOT_PASSWORD + data)
    },
    changeForGotPassword: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.CHANGE_FOR_GOT_PASSWORD)
    },
    fetchPartnerList: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.PARTNER_LIST)
    },
    fetchPartnerDetails: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.VENDOR_DETAILS + data)
    },
    uploadAgentProfilePic: (onResponse, data, id) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.RE_AGENT_PROFILE_PIC + id)
    },
    rescheduleInspection: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.RESCHEDULE_BOOK)
    },
    fetchBookDateFromIns: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.FETCH_BOOK_DATE_FROM_INS)
    },
    fetchParterCompanyList: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.VENDOR_COMPANYS)
    },
    fetchPartnerCityList: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.VENDOR_CITY)
    },
    fetchPartnerCategoryList: (onResponse, data) => {
        request(onResponse, data, API_METHOD.GET, URLCollection.VENDOR_CATEGORIES)
    },
    bookingForInspector: (onResponse, data) => {
        request(onResponse, data, API_METHOD.POST, URLCollection.INSPECTOR_BOOKING)
    }
}



//is heck intenet connection
export const isInternetCheck = () => {

}

export const request = async (onResponse, data, type, url, requestFormate) => {
    let appHeaders = {}

    if (type == API_METHOD.GET) {
        if (Constant.accessToken != undefined) {
            console.log("globals.userToken", Constant.accessToken)
            appHeaders = {
                'Content-Type': HEADER_KEYS.CONTENT_TYPE_JSON,
                // 'Authorization': 'Bearer ' + Constant.accessToken
            }
        } else {
            appHeaders = {
                'Content-Type': HEADER_KEYS.CONTENT_TYPE_JSON,
            }
        }
    } else if (type == API_METHOD.PUT) {
        appHeaders = {
            'Content-Type': HEADER_KEYS.CONTENT_TYPE_JSON,
            //  'Content-Type': HEADER_KEYS.CONTENTTYPE_FORM_X,
            //  'Authorization': 'Bearer ' + Constant.accessToken
        }
    }
    else {
        if (Constant.accessToken != undefined && Constant.accessToken != '') {
            appHeaders = {
                'Content-Type': HEADER_KEYS.CONTENT_TYPE_VAL_MULTIPART_FORM_DATA,
                // 'Authorization': 'Bearer ' + Constant.accessToken
            }
        } else {
            appHeaders = {
                'Content-Type': HEADER_KEYS.CONTENT_TYPE_JSON,
            }
        }
    }

    let apiconfig = {};
    if (API_METHOD.GET == type) {
        apiconfig = {
            method: type,
            url: url,
            headers: appHeaders,
            timeout: BASE_URL.API_TIME_OUT,
            timeoutErrorMessage: 'strings.api_timeout'
        }
    } else if (API_METHOD.DELETE == type) {
        apiconfig = {
            method: type,
            url: url,
            headers: appHeaders,
            timeout: BASE_URL.API_TIME_OUT,
            timeoutErrorMessage: 'strings.api_timeout'
        }
    }
    else if (REQUEST_FORMATE.RAW == requestFormate) {
        apiconfig = {
            method: type,
            url: url,
            headers: appHeaders,
            timeout: BASE_URL.API_TIME_OUT,
            timeoutErrorMessage: 'strings.api_timeout'
        }
    }
    else {
        apiconfig = {
            method: type,
            url: url,
            headers: appHeaders,
            timeout: BASE_URL.API_TIME_OUT,
            timeoutErrorMessage: 'strings.api_timeout',
            data: data
        }
    }

    console.log("header_value :ELSE::", appHeaders)
    console.log("featureURL >>> " + url);
    console.log("data >>> " + JSON.stringify(data));
    console.log("type " + type);
    console.log("apiconfig ", apiconfig);

    await axios(apiconfig).then((response) => {
        console.log("API_RESPONSE :: -> ", url, " = ", JSON.stringify(data), " = ", response)
        if (response.data != null && response.data != '') {
            onResponse.success(response.data)
            // if (response.data.code == BASE_URL.SUCCESS) {
            //     onResponse.success(response.data)
            // } else {
            //     onResponse.error(response.data)
            // }
        }
    }).catch((error) => {
        console.log("API_Failed::", error)
        if (error.response != undefined && error.response != null) {
            if (error.response.data != undefined) {
                onResponse.error(error.response.data)
            } else {
                onResponse.error("Server problem plese try again after some time")
            }
        } else {
            onResponse.error(error.message)
        }
    })
}