import React, { Component } from 'react';
import ReactNative from 'react-native';


const {
  View,
  Text,
  StyleSheet,
  Platform,
  Image
} = ReactNative;

import { Button, Text as NBText } from 'native-base';
import { Images, Fonts, Colors } from "../../Themes";

export default class WelcomePage extends Component {


  render() {

    return (

      <View style={styles.outerContainer}>
        <View style={styles.headerContainer}>
          <Image source={Images.logo} style={styles.logo} />

          <View style={styles.headerTxtCntr} >
            <Text style={styles.h1}>Tennis Snap</Text>
            <Text style={styles.rightHeaderTxt}>USTA Team Management</Text>
          </View>

        </View>
        <View style={styles.middleContainer}>
          <Image source={Images.player} style={styles.playerGraphic} />
        </View>
        <View style={styles.footerContainer}>
          <View style={styles.footerBtnCtnr}>
        <Button rounded block light onPress={() => this.props.navigation.navigate('Role')}t>
          <NBText style={styles.btnText}>GET STARTED</NBText>
        </Button>
        </View>
        </View>
      </View>

    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'space-between',
    backgroundColor: Colors.appBlue,
  },

  headerContainer: {
    flex: 1,
    flexWrap: 'wrap',
    //marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'

 },
 headerTxtCntr: {
   marginHorizontal: 10

},
 middleContainer: {
   flex: 2,
   justifyContent: 'center',
   alignItems: 'center'
  //paddingHorizontal: 20,

},
footerContainer: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',

},
footerBtnCtnr: {
  width: '75%'
},
 logo: {
   width: 50,
   height: 50,
   resizeMode: 'contain',
   marginRight: 4,

 },
 playerGraphic: {
   width: 300,
   height: 300,
   resizeMode: 'contain'
 },
 h1: {
   fontSize: 38,
   color: 'white',
   fontWeight: 'bold'
 },
 rightHeaderTxt: {
   fontSize: 24,
   color: 'white',
   //fontWeight: 'bold'
 },
 btnText: {
   fontSize: 18,
   color: '#3F51B5'
 }
});
