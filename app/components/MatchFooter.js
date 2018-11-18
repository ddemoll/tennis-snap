import React, { Component } from 'react'

import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet,
  Platform,
  Linking,
  ActionSheetIOS
} from 'react-native'
import { Button, Text as NBText, Icon } from 'native-base';

class MatchFooter extends Component {
  constructor(props) {
    super(props);

    this.handleGetDirections = this.handleGetDirections.bind(this);
    this.openMaps = this.openMaps.bind(this);
  }

  handleGetDirections() {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          title: this.props.data.facilityAddress,
          options: ['Open in Apple Maps', 'Open in Google Maps', 'Cancel'],
          destructiveButtonIndex: -1,
          cancelButtonIndex: 2,
        },
        this.openMaps
      );
    } else if (Platform.OS === 'android') {
      var address = encodeURIComponent(this.props.data.facilityAddress);
      Linking.openURL('http://maps.google.com/maps?&q=' + address);
    }
  }
  openMaps(option) {
    var address = encodeURIComponent(this.props.data.facilityAddress);
    switch (option) {
      case 0:
        Linking.openURL('http://maps.apple.com/?q=' + address);
        break;

      case 1:
        var nativeGoogleUrl = 'comgooglemaps-x-callback://?q=' +
          address + '&x-success=f8://&x-source=F8';
        Linking.canOpenURL(nativeGoogleUrl).then((supported) => {
          var url = supported ? nativeGoogleUrl : 'http://maps.google.com/?q=' + address;
          Linking.openURL(url);
        });
        break;
    }
  }

  goToDetail(flight) {

    this.props.navigation.navigate("StandingsDetail", {

      title: flight.flightName,
      meta: flight
    })

  }

  render() {

    let {day, month, dateInMonth, time, facilityName, facilityAddress, price, flight} = this.props.data;

    return (
    <View style={{marginTop: 4}}>
        <View style={styles.matchElementContainer}>
          <Text style={styles.dateElementText}>{day}, {month} {dateInMonth} at {time}</Text>

        </View>
        {facilityAddress &&

          <View style={styles.matchElementContainer}>
            <Text style={styles.matchElementLinkText}>{facilityName}</Text>
            <Text style={styles.matchElementLinkSubText}>{facilityAddress}</Text>
            {price !== 0 && <Text style={styles.matchElementSubText}>{price}</Text>}
            <Button iconLeft rounded style={styles.directionsBtn} onPress={this.handleGetDirections}>
              <Icon type="MaterialIcons" name='directions' />
              <NBText>Directions</NBText>
            </Button>
          </View>
      
      }
        <TouchableHighlight onPress={() => this.goToDetail(flight)}>

        <View style={styles.matchElementContainer}>
          <Text style={styles.matchElementLinkText}>{flight.cYear} {flight.flightName}</Text>
        </View>
        </TouchableHighlight>
        <View style={styles.matchElementContainer}>
          <Text style={styles.matchElementText}>{flight.teamName}</Text>
        </View>

    </View>
    );
  }
}

const styles = StyleSheet.create({
  matchElementContainer: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16
  },
  dateElementText: {
    color: 'black',
    fontSize: 16
  },
  matchElementLinkText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16
  },
  matchElementLinkSubText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  matchElementText: {
    color: 'black',
    fontSize: 16
  },
  directionsBtn: {
    marginTop: 8
  }
});

export default MatchFooter
