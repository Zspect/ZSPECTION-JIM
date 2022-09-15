import { Dimensions, Platform } from 'react-native';

export const deviceHeight = Dimensions.get('window').height;
export const deviceWidth = Dimensions.get('window').width;

class Constants {
    static navigation = undefined
    static languageStr = 'en'
    static accessToken = ""
    static companyBookingInspectionTypeList = []
    static AllBookingINspectionList = []
}
export default Constants;