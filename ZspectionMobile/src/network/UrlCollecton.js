export const PARENT_URL = {
    //   PARENT_URL: 'https://testapi.gohealthnow.com/',  // old
    PARENT_URL: 'https://testapi.zspection.com/',  // new
}

export const BASE_URL = {
    VERSION: "v1/",
    BASE_URL: PARENT_URL.PARENT_URL + 'api/',
    API_TIME_OUT: 300000,
    SUCCESS: 1000,
    FAILED: 400,
    SERVERERROR: 1002,
    ACEESS_DENINED: 401,
    DEFAULT_IMAGE: PARENT_URL.PARENT_URL + "assets/images/user.png"
}



/**
 * Api method
 */
export const API_METHOD = {
    POST: 'POST',
    GET: 'GET',
    PATCH: 'PATCH',
    DELETE: 'DELETE',
    PUT: 'PUT'
}

export const REQUEST_FORMATE = {
    RAW: 'RAW',
    FORM: 'FORM'
}

/**
 * api headers
 */
export const HEADER_KEYS = {
    CONTENT_TYPE_KEY: 'Content-Type',
    CONTENT_TYPE_VAL_MULTIPART_FORM_DATA: 'multipart/form-data',
    CONTENT_TYPE_JSON: 'application/json',
    CONTENTTYPE_FORM_X: 'application/x-www-form-urlencoded;charset=UTF-8'
}


/**
 * Url collections
 */
export const URLCollection = {
    LOGIN: BASE_URL.BASE_URL + 'LogIn',
    REGISTRATION: BASE_URL.BASE_URL + 'Reagent',
    UPLOAD_PIC: BASE_URL.BASE_URL + 'Reagent/Image/',
    INSPECTION_TYPE: BASE_URL.BASE_URL + 'InspectionType',
    PRICE_MATRIX: BASE_URL.BASE_URL + 'PriceMatrix',
    FOUNDATION_TYPE: BASE_URL.BASE_URL + 'FoundationType',
    PROPERTY_TYPE_TAX: BASE_URL.BASE_URL + 'PropertyType/ForAgent',
    SEARCH_HISTORY: BASE_URL.BASE_URL + 'Booking/Search',
    FAV_INSPECTOR: BASE_URL.BASE_URL + 'FavoriteInspector/',
    SEARCH_INSPECTOR: BASE_URL.BASE_URL + 'Inspector/FindInspector',
    BOOKING: BASE_URL.BASE_URL + 'Booking',
    RE_AGENT_PROFILE: BASE_URL.BASE_URL + 'Reagent/',
    RE_AGENT_PROFILE_PIC: BASE_URL.BASE_URL + 'Reagent/Image/',
    UPDATE_CHANGE_PASS: BASE_URL.BASE_URL + 'User/ChangePassword',
    REGISTER_COMPANY: BASE_URL.BASE_URL + 'Company',
    UPLOAD_COMPANY_PIC: BASE_URL.BASE_URL + 'Company/Image/',
    FETCH_DAYWISE_BOOKING: BASE_URL.BASE_URL + 'Booking/DateWiseBooking',
    FETCH_COMPANY_DETAILS: BASE_URL.BASE_URL + 'Company/',
    SAVE_COMPANY_PROFILE_PIC: BASE_URL.BASE_URL + 'Company/Image/',
    FETCH_COMPANY_INSPECTOR: BASE_URL.BASE_URL + 'Inspector/CompanyInspector/',
    COMPANY_INSPECTOR_INSPECTION_TYPE: BASE_URL.BASE_URL + 'Inspector/CompanyInspectorByInspectionType/',
    PROPERTY_TYPE: BASE_URL.BASE_URL + 'PropertyType ',
    AREA_RANGE: BASE_URL.BASE_URL + 'AreaRange',
    COMPANY_PRICE_MATRIX_SAVE: BASE_URL.BASE_URL + 'PriceMatrixInspector',
    COMPANY_CHIMNEY_PRICE_MATRIX_SAVE: BASE_URL.BASE_URL + 'InspectorChimneyPriceMatrix  ',
    CHIMNEY_TYPE_LIST: BASE_URL.BASE_URL + 'ChimneyType',
    PRICE_MATRIX_GET: BASE_URL.BASE_URL + 'PriceMatrixInspector/PricematrixGet',
    COMPANY_INSPECTION_BY_CO_ID: BASE_URL.BASE_URL + 'InspectionType/CompanyInspectionTypes/',
    INSPECTOR_INSPECTION_BY_IN_ID: BASE_URL.BASE_URL + 'InspectionType/InspectorInspectionTypes/',
    SAVE_INSPECTOR: BASE_URL.BASE_URL + 'Inspector',
    FETCH_INSPECTOR_DETAILS: BASE_URL.BASE_URL + 'Inspector/',
    FETCH_INSPECTION_BOOKING_DETAILS_BY_ID: BASE_URL.BASE_URL + 'Booking/',
    UPDATE_INSPECTOR_FROM_COMPANY: BASE_URL.BASE_URL + 'Inspector/',
    ENABLE_DISABLE_INSPECTOR: BASE_URL.BASE_URL + 'Inspector/EnableDisableInspector',
    UPDATE_PRICE_MATRIX: BASE_URL.BASE_URL + 'PriceMatrixInspector/UpdatePriceMatrixInspector',
    PRICE_MATRIX_STATUS: BASE_URL.BASE_URL + 'PriceMatrixInspector/ActiveInactivePriceMatrixInspector',
    REMOVE_FAV_INSPECTOR: BASE_URL.BASE_URL + 'FavoriteInspector/RemoveFavoriteInspector',
    INSPECTOR_PROFILE_PIC: BASE_URL.BASE_URL + 'Inspector/Image/',
    INSPECTOR_BOOKING_BY_ID: BASE_URL.BASE_URL + "Booking/InspectorBooking/",
    INSPECTOR_DATE_WISE_BOOKING: BASE_URL.BASE_URL + "Booking/DateWiseBookingInspector",
    INSPECTOR_DETAILS_BY_ID: BASE_URL.BASE_URL + "Booking/BookingDetailByBookingDetailId/",
    ACCEPT_BOOKING_BY_INSPECTOR: BASE_URL.BASE_URL + 'Booking/AcceptBooking/',
    REJECT_BOOKING_BY_INSPECTOR: BASE_URL.BASE_URL + 'Booking/RejectBooking/',
    FETCH_INSPECTOR_INFO_BY_ID: BASE_URL.BASE_URL + 'Inspector/',
    FETCH_INSPECTOR_HOUR_BY_INS_ID: BASE_URL.BASE_URL + 'InspectorHour/',
    UPDATE_INSPECTOR_HOUR_BY_INS_ID: BASE_URL.BASE_URL + 'InspectorHour/UpdateIHours',
    LEAVE_APPLY: BASE_URL.BASE_URL + 'Leaves',
    JOB_START_TIME_UPDATE: BASE_URL.BASE_URL + 'Booking/JobStartTimeUpdate/',
    CLOSE_BOOKING_BY_INSPECTOR: BASE_URL.BASE_URL + 'Booking/CloseBooking/',
    FORGOT_PASSWORD: BASE_URL.BASE_URL + 'User/ForgotPassword/',
    CHANGE_FOR_GOT_PASSWORD: BASE_URL.BASE_URL + 'User/ChangeForGotPassword',
    PARTNER_LIST: BASE_URL.BASE_URL + 'User/PatnersList',
    VENDOR_DETAILS: BASE_URL.BASE_URL + 'User/PatnerSkills/',
    UPLOAD_AGENT_PROFILE_PIC: BASE_URL.BASE_URL + 'Reagent/Image/',
    RESCHEDULE_BOOK: BASE_URL.BASE_URL + 'Booking/RescheduleBooking',
    FETCH_BOOK_DATE_FROM_INS: BASE_URL.BASE_URL + 'Booking/MonthWiseBooking',
    VENDOR_COMPANYS: BASE_URL.BASE_URL + 'User/GetVendorCompany',
    VENDOR_CATEGORIES: BASE_URL.BASE_URL + 'User/GetVendorCategory',
    VENDOR_CITY: BASE_URL.BASE_URL + 'User/GetVendorCity',
    INSPECTOR_BOOKING: BASE_URL.BASE_URL + 'Inspector/IsInspectorAvilableForBooking',

}