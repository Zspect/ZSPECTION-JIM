import React, {Component} from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import ServicesStack from '../Containers/Company/Stacks/ServicesStack';
import ProfileStack from '../Containers/Company/Stacks/CompanyProfileStack';
import InspectorStack from '../Containers/Company/Stacks/InspectorStack';
import CreateOfflineBooking from '../Containers/Company/Services/CreateOfflineBooking';

import CompanyHome from './CompanyHome';
import RealEstateHome from './RealEstateHome';
import InspectorHome from './InspectorHome';
import RegisterPriceMatrix from '../Containers/RegisterPriceMatrix';

import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import CompanyInspections from '../Containers/CompanyInspections';
import CompanyTrials from '../Containers/CompanyTrials';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {SideMenu} from '../Containers/SideMenu';
import {Dimensions, TouchableOpacity} from 'react-native';
import RealEstateProfileStack from '../Containers/RealEstate/Stacks/RealEstateProfileStack';
import VendorStack from '../Containers/RealEstate/Stacks/VendorStack';
import CompanyProfileStack from '../Containers/Company/Stacks/CompanyProfileStack';
import BookingStack from "../Containers/Company/Stacks/BookingStack";
import InspectorsAvailabilityStack from '../Containers/Inspector/Stacks/InspectorAvailabilityStack';
import CompanyInspectorsAvailabilityStack from '../Containers/Company/Stacks/CompanyInspectorsAvailabilityStack';
import {SideMenuInspector} from '../Containers/SideMenuInspector';
import {SideMenuAgent} from '../Containers/SideMenuAgent';
import InspectorPriceMatrixStack from '../Containers/Inspector/Stacks/InspectorPriceMatrixStack';
import CompanyPriceMatrixStack from '../Containers/Company/Stacks/CompanyPriceMatrixStack';
import CompanyPriceMatrixListStack from '../Containers/Company/Stacks/CompanyPriceMatrixListStack';
import ChangeCompanyPassword from '../Containers/Company/Profile/ChangeCompanyPassword';
import ChangeRealEstatePassword from '../Containers/RealEstate/ChangeRealEstatePassword';
import ChangePasswordInspector from '../Containers/Company/ChangePasswordInspector';
import InspectionStack from '../Containers/Inspector/Stacks/InspectionStack';
import InspectorBooking from '../Containers/Company/inspector/InspectorBooking';
import SearchStack from '../Containers/RealEstate/Stacks/SearchStack';
import HistoryStack from '../Containers/RealEstate/Stacks/HistoryStack';
import History from '../Containers/RealEstate/History';
import FavoritesStack from '../Containers/RealEstate/Stacks/FavoritesStack';
const WIDTH = Dimensions.get('window').width;
import Icon2 from 'react-native-vector-icons/EvilIcons';
import CompanyPriceMatrix from '../Containers/Company/CompanyPriceMatrix';
import InspectorProfile from '../Containers/Inspector/InspectorProfile';
import InspectorAvailability from '../Containers/Inspector/InspectorAvailability/index';
import Vendor from '../Containers/RealEstate/VendorScreen';
import VendorScreen from '../Containers/RealEstate/VendorScreen';
import VendorDetail from '../Containers/RealEstate/VendorDetail';

export const CompanyStack = createStackNavigator({
  CompanyTrial: {
    screen: CompanyTrials,
    navigationOptions: {
      header: null,
    },
  },
  CompanyInspection: {
    screen: CompanyInspections,
    navigationOptions: {
      header: null,
    },
  },
  RegisterPriceMatrix: {
    screen: RegisterPriceMatrix,
    navigationOptions: {
      header: null,
    },
  },
});
const drawerConfig = {
  contentComponent: SideMenu,
  drawerWidth: WIDTH,
};
const drawerConfigInspector = {
  contentComponent: SideMenuInspector,
  drawerWidth: WIDTH,
};
const drawerConfigRealEstate = {
  contentComponent: SideMenuAgent,
  drawerWidth: WIDTH,
};
const RealEstateDrawerNavigator = createDrawerNavigator(
  {
    Inspection: SearchStack,
    History: HistoryStack,
    Favorites: FavoritesStack,
    ProfileRoute: RealEstateProfileStack,
    VendorStack: VendorStack,
    // VendorStack: VendorScreen,
    // VendorDetail:VendorDetail,
    ChangePasswordAgentRoute: createStackNavigator({
      ChangePassword: {
        screen: ChangeRealEstatePassword,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'Change Password',
          headerStyle: {backgroundColor: '#28558E'},
          headerTitleContainerStyle: {justifyContent: 'center'},
          headerTintColor: '#FFF',
          headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Icon2
                iconStyle={{marginLeft: 15, fontWeight: 'normal'}}
                size={30}
                color="#FFF"
                name="navicon"
                type="material"
              />
            </TouchableOpacity>
          ),
        }),
      },
    }),
  },
  drawerConfigRealEstate,
);

const InspectorDrawerNavigator = createDrawerNavigator(
  {
    Inspections: InspectionStack,
    BookingRoute: BookingStack,
    InspectorBooking: createStackNavigator({
      Booking: {
        screen: InspectorBooking,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'Create Offline Booking',
          headerStyle: {backgroundColor: '#28558E'},
          headerTintColor: '#FFF',
          headerTitleContainerStyle: {justifyContent: 'center'},
          headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Icon2
                iconStyle={{marginLeft: 15, fontWeight: 'normal'}}
                size={30}
                color="#FFF"
                name="navicon"
                type="material"
              />
            </TouchableOpacity>
          ),
        }),
      },
    }),
    InspectorProfile: InspectorProfile,

    InspectorAvailability: InspectorAvailability,
    // InspectorAvailabilityRoute: InspectorsAvailabilityStack,

    PriceMatrixRoute: InspectorPriceMatrixStack,
    ChangePasswordInspectorRoute: createStackNavigator({
      ChangePasswordInspector: {
        screen: ChangePasswordInspector,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'Change Password',
          headerStyle: {backgroundColor: '#28558E'},
          headerTitleContainerStyle: {justifyContent: 'center'},
          headerTintColor: '#FFF',
          headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Icon2
                iconStyle={{marginLeft: 15, fontWeight: 'normal'}}
                size={30}
                color="#FFF"
                name="navicon"
                type="material"
              />
            </TouchableOpacity>
          ),
        }),
      },
    }),
  },
  drawerConfigInspector,
);

// company route
const HomeScreenDrawerNavigator = createDrawerNavigator(
  {
    // Companies:CompanyHome,
    Services: ServicesStack,
    Inspectors: InspectorStack,
    // OfflineBooking: offlineBookingStack,
    ProfileRoute: CompanyProfileStack,
    CompanyInspectorsAvailabilityRoute: CompanyInspectorsAvailabilityStack,
    CompanyPriceMatrixListStack: CompanyPriceMatrixListStack,
    BookingRoute: BookingStack,
    CompanyPriceMatrixRoute: CompanyPriceMatrixStack,
    ChangePasswordCompanyRoute: createStackNavigator({
      ChangeCompanyPassword: {
        screen: ChangeCompanyPassword,
        navigationOptions: ({navigation}) => ({
          headerTitle: 'Change Password',
          headerStyle: {backgroundColor: '#28558E'},
          headerTintColor: '#FFF',
          headerLeft: (
            <TouchableOpacity
              onPress={() => {
                navigation.toggleDrawer();
              }}>
              <Icon2
                iconStyle={{marginLeft: 15, fontWeight: 'normal'}}
                size={30}
                color="#FFF"
                name="navicon"
                type="material"
              />
            </TouchableOpacity>
          ),
        }),
      },
    }),
  },
  drawerConfig,
);

const HomeStack = createSwitchNavigator({
  RealEstateHome: RealEstateDrawerNavigator, //RealEstateHome
  InspectorHome: InspectorDrawerNavigator, // InspectorHome,
  CompanyHome: HomeScreenDrawerNavigator, //  CompanyHome,
  CompanyInspections: CompanyStack,
  RegisterPriceMatrix: RegisterPriceMatrix,
});

module.exports = HomeStack;
