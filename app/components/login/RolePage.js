import React, { Component } from 'react';
import ReactNative from 'react-native';


const {
  View,
  Text,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity
} = ReactNative;

import { Text as NBText, Title, Subtitle, Container, Header, Left, Right, Body, Button, Icon } from 'native-base';
import { Images, Fonts, Colors } from "../../Themes";

export default class RolePage extends Component {

 onPressButton = (selection) => {
   this.props.navigation.navigate('Login', {title: selection})
 }

  render() {

    return (
      <Container>
          <Header>
              <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
            <Body style={{ flex: 3 }}>
              <Title>Select Your Role</Title>
            </Body>
            <Right/>
          </Header>

            <View style={styles.outerContainer}>

            <TouchableOpacity style={styles.roleContainer} onPress={() => this.onPressButton('Captain')}>

                <Image source={Images.captainIcon} style={styles.logo} />
                <View style={styles.txtCtnr}>
                  <Text style={styles.titleTxt}>Captain</Text>
                  <Text style={styles.subtitleTxt}>Activate your teams and start saving time.</Text>
                </View>

            </TouchableOpacity>

            <TouchableOpacity style={styles.roleContainer} onPress={() => this.onPressButton('Player')}>
              <Image source={Images.playerIcon} style={styles.logo} />
              <View style={styles.txtCtnr}>
                <Text style={styles.titleTxt}>Player</Text>
                <Text style={styles.subtitleTxt}>Set your availability and view scores and schedule.</Text>
              </View>

            </TouchableOpacity>

            <View style={styles.footerContainer}>

            </View>

          </View>


        </Container>
    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.ricePaper
  },

  roleContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.border,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 10,

 },
 txtCtnr: {
   flex: 1,
   flexDirection: 'column',
   paddingLeft: 10,


 },

 logo: {
   width: 50,
   height: 50,
   resizeMode: 'contain',
 },
 playerGraphic: {
   width: 300,
   height: 300,
   resizeMode: 'contain'
 },
 titleTxt: {
   fontSize: 20,
   color: 'black',
   fontWeight: 'bold',
   paddingBottom: 1
 },
 subtitleTxt: {
   //flex: 1,
   //flexWrap: 'wrap',
   fontSize: 16,
   color: Colors.lightGray,
   paddingTop: 1,

 },
 footerContainer: {
   flex: 3
 }

});
