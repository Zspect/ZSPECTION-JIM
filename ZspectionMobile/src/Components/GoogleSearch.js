import React, { Component } from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { CheckBox, Avatar, Icon, Input } from 'react-native-elements';
export default class GoogleSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
    };
  }
  componentDidMount() { }

  showIcon = () => {
    if (this.props.icon) {
      return (
        <Icon
          iconStyle={{ position: 'relative', top: 12, marginRight: 15 }}
          name="home"
          type="font-awesome"
        />
      );
    }
    if (this.props.iconMap) {
      return (
        <Icon
          color="#ccc"
          iconStyle={{ position: 'relative', top: 12, marginRight: 15 }}
          name="map-marker"
          type="font-awesome"
        />
      );
    }
  };

  render() {
    return (
      <GooglePlacesAutocomplete
        {...this.props}
        placeholder={
          this.props.placeholder ? this.props.placeholder : 'Address'
        }
        minLength={2}
        autoFocus={false}
        returnKeyType={'default'}
        listViewDisplayed={false}
        fetchDetails={true}
        renderLeftButton={() => this.showIcon()}
        //renderLeftButton={()  => this.props.icons && <Icon iconStyle={{position:'relative',top:12, marginRight:15}} name="map-marker" type="font-awesome" />}
        onPress={(data, details = null) => {
          console.log('oppoopooo', data)
          this.props.mapAddress(data, details);
        }}
        getDefaultValue={() => this.props.value}
        query={{
          key: 'AIzaSyAaDd5zJGonIbsOhgePQo5j2H1vKJtBw4Y', //'AIzaSyCe2Vwdo6y6kyp4hAdNboe638M_YR2HvHQ',
          language: 'en', // language of the results
          region: 'US',
          components: 'country:us',
        }}
        styles={{
          container: {
            borderBottomWidth: 0.4,
            marginLeft: 10,
            marginRight: 10,
            paddingRight: 10,
            // paddingLeft:5,
          },
          textInputContainer: {
            backgroundColor: 'rgba(0,0,0,0)',
            borderTopWidth: 0,
            padding: 0,
          },
          textInput: {
            color: '#5d5d5d',
            fontSize: 16,
            marginTop: 10,
            paddingLeft: 0,
            marginLeft: 0,
            fontSize: 14,
          },
          predefinedPlacesDescription: {
            color: '#1faadb',
          },
        }}
        currentLocation={false}
      />
    );
  }
}
