import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "./Api/Api";
import qs from 'qs';
import { Linking } from 'react-native';
import Toast from 'react-native-simple-toast';

export async function sendEmail(to, subject, body, options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
}



export const ifEmailExists = async (email) => {
    let userId = await AsyncStorage.getItem("userId");
    console.log("user id from storage is :", userId)
    if (userId == null || userId == undefined) {
        userId = 0;
    }
    var data = { userid: userId, emailid: email };
    console.log("Data to validate email : ", data);
    let response = await new API('ValidateEmail', data).getResponse();
    return response;
}

export const showToastMsg = (msg) => {
    Toast.show(msg, Toast.SHORT)
}


export const ROLE_ID = [
    { id: 1, name: 'RealEstAgent' },
    { id: 2, name: 'Inspector' },
    { id: 3, name: 'company' }
]

export const REAL_AGENT_ROLE = 1
export const INSPECTOR_ROLE = 2
export const COMPANY_ROLE = 3

