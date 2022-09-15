import React, {Component} from 'react';
import {Platform, StyleSheet, View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
// import store from './src/Store';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import AuthLoadingScreen from './src/Components/Auth';
import AuthStack from './src/Routes/LoginStack';
import AppStack from './src/Routes/HomeStack';


// import {Provider} from 'react-redux';
// import Test from './src/Test';


// console.log("initial state: ", store.getState())
// const unsubscribe = store.subscribe(() => console.log("updated state: ", store.getState()));
// unsubscribe();



// export default class App extends Component {
//   render() {
//     return(
//       <Provider store={store}>
//         <Test />
//       </Provider>
     
//     )
//   }
// }
export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    }
  )
);
console.disableYellowBox = true;