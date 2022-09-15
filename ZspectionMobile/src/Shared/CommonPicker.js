

import React, { Component } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import ActionSheet from "react-native-actions-sheet";
import React, { createRef } from "react";
const actionSheetRef = createRef();
let actionSheet;
export default class CommonPicker extends Component{

render(){
    const { platform } = this.props;
return(
    <View
    style={{
      justifyContent: "center",
      flex: 1
    }}
  >
    <TouchableOpacity
      onPress={() => {
        actionSheetRef.current?.setModalVisible();
      }}
    >
      <Text>Open ActionSheet</Text>
    </TouchableOpacity>

    <ActionSheet ref={actionSheetRef}>
      <View>
        <Text>YOUR CUSTOM COMPONENT INSIDE THE ACTIONSHEET</Text>
      </View>
    </ActionSheet>
  </View>
)
}
}
