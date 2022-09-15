import { Dimensions, Alert } from 'react-native';
import moment from "moment";
import Toast from 'react-native-simple-toast'

const sizeDenominator = 850;

export function windowSize() {
    return Dimensions.get('window');
}

export const deviceWidth = Dimensions.get('window').width
export const deviceHeight = Dimensions.get('window').height

export function responsiveSize(fontSize) {
    const { width, height } = windowSize();
    return (Math.sqrt((height * height) + (width * width)) * (fontSize / sizeDenominator));
}


export const confirmAlert = (title, msg, headingOne, headingTwo, onSucess, onFail, cancelable) => {
    Alert.alert(title, msg, [{
        text: headingTwo,
        onPress: () => {
            onFail != undefined ? onFail() : console.log('cancel')
        }
    }, {
        text: headingOne,
        onPress: () => {
            onSucess != undefined ? onSucess() : console.log('sucess')
        }
    },], {
        cancelable: cancelable != undefined ? cancelable : true
    })
}

/**
 * 
 * @param {*} title 
 * @param {*} msg 
 * @param {*} headingOne 
 * @param {*} onSucess 
 * @param {*} cancelable 
 */
export const showAlert = (title, msg, headingOne, onSucess, cancelable) => {
    Alert.alert(title, msg, [{
        text: headingOne != undefined ? headingOne : 'Okay',
        onPress: () => {
            onSucess != undefined ? onSucess() : console.log('cancel')
        }
    }], {
        cancelable: cancelable != undefined ? cancelable : true
    })
}


export const removeHTMLTag = (str) => {
    return str.replace(/<(.|\n)*?>/g, '');
}

export const isEmail = (val) => {
    let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(val)) {
        return 'Invalid Email';
    }
}


export const rgbaColor = (color1, color2, color3, alpha) => {
    return 'rgba(' + color1 + ',' + color2 + ',' + color3 + ',' + alpha + ')';
}


/**
 * 
 * @param {*} apiDate 
 * @param {*} apiFormate 
 * @param {*} convertFormate 
 * @param {*} isTime 
 * @returns 
 */

/**
 * convert date and time 
 */
export const convertDateAndTime = (apiDate, apiFormate, convertFormate, isTime) => {
    if (apiFormate != undefined && apiFormate != null && apiFormate != '') {
        return moment(apiDate, apiFormate != undefined && apiFormate != null && apiFormate != '' ? apiFormate : '').format(convertFormate != undefined && convertFormate != null ? convertFormate : dateOrTimeFormate.mmDDyyyy)
    } else if (isTime != undefined && isTime != null && isTime != '' && isTime) {
        return moment(apiDate).format(convertFormate != undefined && convertFormate != null ? convertFormate : 'hh:mm a')
    } else {
        return moment(apiDate).format(convertFormate != undefined && convertFormate != null ? convertFormate : dateOrTimeFormate.mmDDyyyy)
    }
}

/**
 * show flash msg from app
 * @param {*} msg 
 * @param {*} desc 
 * @param {*} type 
 */
export const showFlashMsg = (type, msg, desc) => {
    showMessage({
        message: msg,
        description: desc ? desc : '',
        type: type ? type : "default",
    });
}

export const showToastMsg = (msg) => {
    Toast.show(msg)
}

/**
 * is_friend_status render
 * @param {} status 
 */
export const isFriendStatusRender = (status) => {
    return isFriendStatus[status]
}

// date formate count
export const dateToSecCount = (birthDate) => {
    console.log("main_dob>>", birthDate)
    let bobMoment = moment(birthDate, 'YYYY-MM-DD')
    let currentMoment = moment(new Date())
    let diffSec = -1

    // if (bobMoment.format('DD-MM') == currentMoment.format('DD-MM')) {
    //     console.log("is_same")
    // }

    let findCurrentMontInt = currentMoment.format("M")
    let bobMontInt = bobMoment.format("M")

    let findCurrentDateInt = currentMoment.format("D")
    let bobDateInt = bobMoment.format("D")

    console.log("common__", parseInt(bobMontInt) == parseInt(findCurrentMontInt), bobMontInt, findCurrentMontInt)

    if (parseInt(bobMontInt) > parseInt(findCurrentMontInt)) {
        //console.log("yeeeeee_isafter", bobMoment.format('DD-MM')) //after
        bobMoment.set({ 'year': currentMoment.format('yyyy') })
        diffSec = bobMoment.diff(currentMoment, 'seconds')
        console.log("yeeeeee_isafter", bobMoment.format('DD-MM'), diffSec)
    }
    else if (parseInt(bobMontInt) == parseInt(findCurrentMontInt)) {
        //console.log("yeeeeee_issamme", bobMoment.format('DD-MM')) //same

        if (parseInt(bobDateInt) == parseInt(findCurrentDateInt)) {
            console.log("date_same today birthday")
            diffSec = 0
        }
        else if (parseInt(bobDateInt) > parseInt(findCurrentDateInt)) {
            bobMoment.set({ 'year': currentMoment.format('yyyy') })
            diffSec = bobMoment.diff(currentMoment, 'seconds')
        }
    } else {
        // console.log("yeeeeee_else", bobMoment.format('DD-MM'), findCurrentMontInt, bobMontInt) // before
        bobMoment.set({ 'year': currentMoment.format('yyyy') })
        bobMoment.add(1, 'year')
        diffSec = bobMoment.diff(currentMoment, 'seconds')
        console.log("yeeeeee_else", bobMoment.format('DD-MM'), findCurrentMontInt, bobMontInt, diffSec) // before
    }

    // if (bobMoment.format('DD-MM-YYYY') == currentMoment.format('DD-MM-YYYY')) {
    //     console.log("is_same")
    // } else if (bobMoment.format('YYYY') == currentMoment.format("YYYY")) {
    //     console.log("before if>>", bobMoment.format('yyyy'), currentMoment.format('yyyy'))
    //     bobMoment.add(1, 'year')
    //     console.log("after if>>", bobMoment.format('yyyy'), currentMoment.format('yyyy'))
    //     diffSec = bobMoment.diff(currentMoment, 'seconds')
    // } else {
    //     if (bobMoment.isBefore(currentMoment)) {
    //         console.log("is_before>>> ", bobMoment.format("DD-MM-YYYY"), currentMoment.format('DD-MM-YYYY'))
    //         bobMoment.set({ 'year': currentMoment.format('yyyy') })
    //         if (bobMoment.isBefore(currentMoment, 'month')) {
    //             console.log("is_before_befor")
    //             bobMoment.add(1, 'year')
    //         } else {
    //             console.log("is_after_after")
    //         }
    //     }
    //     else {
    //         bobMoment.set({ 'year': currentMoment.format('yyyy') })
    //     }
    //     diffSec = bobMoment.diff(currentMoment, 'seconds')
    //     console.log("after elseeeee>>", bobMoment.format('YYYY'), currentMoment.format('yyyy'))
    // }
    console.log("new >>", diffSec)
    return diffSec
}


export const range = (start, end) => {
    return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

/**
 * is check input empty or not
 * @param {*} value 
 * @returns 
 */
export const isInputEmpty = (value) => {
    if (value.length === 0) {
        return true
    }
    return false
}

export const formatPhoneNumber = (phone) => {
    // var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    // var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    // if (match) {
    //     return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    // }
    // return null;
    const reg = new RegExp('^[0-9]+$');
    phone = phone.replace(/[^\d]/g, "");
    let valueM = ''
    if (phone.length == 10) {
        valueM = phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    } else {
        valueM = phone
    }
    return valueM;
}

export const INSPECTION_TYPE = [
    { id: 9, name: 'Home' },
    { id: 10, name: 'Pest' },
    { id: 11, name: 'Pool' },
    { id: 12, name: 'Roof' },
    { id: 14, name: 'Chimney' },
]

export const retriveINspectionTypeById = (id) => {
    let inspectionName = ''
    if (id == INSPECTION_TYPE[0].id) {
        inspectionName = INSPECTION_TYPE[0].name
    }
}

export const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) {
        return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    //return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];

    return [parseFloat((bytes / Math.pow(k, i)).toFixed(dm)), sizes[i]];
}


export const INSPECTOR_BOOKING_STATUS = {
    PENDING: 1,
    ACCEPT_BY_INSPECTOR: 2,
    REJECT_BY_INSPECTOR: 3,
    CANCELLED: 4,
    COMPLETED: 5
}



export const convertInspectorBookingStatusToStr = (id) => {
    let str = ''
    if (id == INSPECTOR_BOOKING_STATUS.PENDING) {
        str = "Pending"
    }
    else if (id == INSPECTOR_BOOKING_STATUS.ACCEPT_BY_INSPECTOR) {
        str = "Accepted"
    }
    else if (id == INSPECTOR_BOOKING_STATUS.REJECT_BY_INSPECTOR) {
        str = "Rejected"
    }
    else if (id == INSPECTOR_BOOKING_STATUS.CANCELLED) {
        str = "Cancelled"
    }
    else if (id == INSPECTOR_BOOKING_STATUS.COMPLETED) {
        str = "Completed"
    }
    return str;
}

export const allowedOnlyNumber = (number) => {
    return number.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
}

export const MAX_FILE_SIZE = 2000000  // 2mb

export const allowedOnlyCharacter = (txt) => {
    let letters = /^[A-Za-z ]+$/;
    if (letters.test(txt)) {
        return txt
    } else {
        return ""
    }
}

/**
 * parse google json to zipcode, city,state or latlong
 */
export const parseGoogleLocation = (details) => {
    const stateFinder = "administrative_area_level_1";
    const zipFinder = "postal_code";
    const cityFinder = "administrative_area_level_2";
    const { address_components,formatted_address } = details;
    var row = { zipcode: '', state: '', city: '', lat: '', long: '' }
    address_components.map((item) => {
        item.types.map((type) => {
            if (type == zipFinder) {
                row.zipcode = item.long_name
            }
            if (type == stateFinder) {
                row.state = item.long_name
            }
            if (type == cityFinder) {
                row.city = item.long_name
            }
        })
    })
    row.addressStr = formatted_address
    row.lat = details.geometry.location.lat;
    row.long = details.geometry.location.lng;
    return row;
}
