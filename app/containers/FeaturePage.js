import React, { Component } from 'react';
import ReactNative from 'react-native';

import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

const {
  View,
  Text,
  StyleSheet,
  Platform,
  ScrollView,
  AsyncStorage,
  Alert,
  Linking
} = ReactNative;

import { Container, Footer, FooterTab, Button, Icon, Text as NBText } from 'native-base';
import { Images, Fonts, Colors } from "../Themes";
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon3 from 'react-native-vector-icons/Foundation';

import PurchaseContainer from './PurchaseContainer'
import Modal from "react-native-modal";

class FeaturePage extends Component {

  state = {
    isModalVisible: false
  };
  _openModal = () => this.setState({ isModalVisible: true });
  _closeModal = () => this.setState({ isModalVisible: false });

  getSubscriptionData = async () => {
    const token = await AsyncStorage.getItem("token");

    if(token != null) {
      let ChannelType = (Platform.OS === 'ios') ? 'APNS' : 'GCM';
      const {ustaNum, userTeamId, isUSTACaptain} = this.props.navigation.state.params.data;
      let data = {
        isCaptain: isUSTACaptain,
        ustaNum,
        teamID: userTeamId,
        address: token,
        ChannelType
      }
      return data;
    } else {
      Alert.alert(
        'Unable to activate team!',
        'Enable push notifications for Tennis Snap in your settings before activating team.',
        [
          {text: Platform.OS == 'ios' ? 'Enable Now' : 'OK', onPress: () => {
            if(Platform.OS == 'ios') {
              Linking.canOpenURL('app-settings:').then(supported => {
                if (!supported) {
                  console.log('Can\'t handle settings url');
                } else {
                  return Linking.openURL('app-settings:');
                }
              }).catch(err => console.log('An error occurred', err));
            }
            }

          }
        ],
        { cancelable: false }
      )
      return null;
    }
  }

  subscribe = async () => {

    const token = await AsyncStorage.getItem("token");

    if(token != null) {
      let ChannelType = (Platform.OS === 'ios') ? 'APNS' : 'GCM';
      const {ustaNum, userTeamId, isUSTACaptain} = this.props.navigation.state.params.data;
      let data = {
        isCaptain: isUSTACaptain,
        ustaNum,
        teamID: userTeamId,
        address: token,
        ChannelType
      }
      if(isUSTACaptain) {
        if(this.props.unusedTeams > 0) {

          this.props.activateTeam(data);
        } else {
          //prompt captain to buy more teams
          this._openModal();
        }

      } else {
        this.props.requestSubscription(data);
      }
    } else {
      Alert.alert(
        'Unable to activate team!',
        'Enable push notifications for Tennis Snap in your settings before activating team.',
        [
          {text: Platform.OS == 'ios' ? 'Enable Now' : 'OK', onPress: () => {
            if(Platform.OS == 'ios') {
              Linking.canOpenURL('app-settings:').then(supported => {
                if (!supported) {
                  console.log('Can\'t handle settings url');
                } else {
                  return Linking.openURL('app-settings:');
                }
              }).catch(err => console.log('An error occurred', err));
            }
            }

          }
        ],
        { cancelable: false }
      )
    }

  }

  //check if we need to fetch lineup after captain activates or player subscribes
  componentWillReceiveProps(nextProps) {

    const {userTeamId} = this.props.navigation.state.params.data
    if(nextProps.captainTeams.created !== null) {
      this.props.subscribeCaptainDone();
      //use to fetch lineup when team is activated from ScheduleDetail
      this.props.navigation.state.params.onComplete();

    } else if(nextProps.playerSubscriptions.created !== null) {
      this.props.subscribePlayerDone();
      if(userTeamId in this.props.activatedTeams) {
        this.props.navigation.state.params.onComplete();

      }
    }
    this.props.navigation.goBack();

  }

  render() {


    const {isUSTACaptain} = this.props.navigation.state.params.data;

    let screenTitle = isUSTACaptain ? 'Captain Team Activation' : 'Player Team Activation';
    let title1 = 'MATCH ALERTS';
    let subtitle1 = isUSTACaptain ? 'Push notifications to your team for upcoming matches and lineups' : 'Push notifications for upcoming matches and lineups';
    let title2 = `PLAYER AVAILABILITY${isUSTACaptain ? '' : '*'}`;
    let subtitle2 = isUSTACaptain ? 'Track who’s coming to each match with player availability' : 'Let your captain and team know when you are available to play';
    let title3 = `LINEUPS${isUSTACaptain ? '' : '*'}`;
    let subtitle3 = isUSTACaptain ? 'Set who\'s playing in each match and assign positions with lineups' : 'View your position and check who\'s playing in each match';


    return (


      <View style={styles.outerContainer}>
        <View style={styles.headerContainer}>
          <View style={{flex:1}}></View>
          <View style={{flex:5, paddingBottom: 2}}><Text style={styles.headerText}>{screenTitle.toUpperCase()}</Text></View>
          <View style={{flex:1}}>
          <Button small style={{backgroundColor: Colors.appBlueDark, alignSelf: 'flex-end'}} onPress={() => this.props.navigation.goBack()}>
              <Icon name="ios-close" />
          </Button>
          </View>
        </View>
        <View style={styles.middleContainer}>
          <View style={styles.header2Cntr}>
            <Text style={styles.h4}>Unlock Premium Features</Text>
          </View>
          <ScrollView>

            <View style={styles.itemContainer}>
                <View style={styles.iconCntr}>
                 <Icon1 name="notifications-none" color="white" size={26} />
                 </View>
                <View style={styles.txtCtnr}>
                  <Text style={styles.titleTxt}>{title1}</Text>
                  <Text style={styles.subtitleTxt}>{subtitle1}</Text>
                </View>

            </View>
            <View style={styles.itemContainer}>
                  <View style={styles.iconCntr}>
                 <Icon2 name="calendar-check" size={26} color="white" />
                 </View>
                <View style={styles.txtCtnr}>
                  <Text style={styles.titleTxt}>{title2}</Text>
                  <Text style={styles.subtitleTxt}>{subtitle2}</Text>
                </View>

            </View>
            <View style={styles.itemContainer}>
              <View style={styles.iconCntr}>
                 <Icon3 name="clipboard-notes" size={26} color="white" />
                 </View>
                <View style={styles.txtCtnr}>
                  <Text style={styles.titleTxt}>{title3}</Text>
                  <Text style={styles.subtitleTxt}>{subtitle3}</Text>
                </View>

            </View>
            {!isUSTACaptain &&
              <Text style={[styles.disclaimerTxt, {marginTop: 10}]}>* Requires activation by your team captain</Text>
            }
            </ScrollView>


        </View>
        <View style={styles.footerContainer}>
          <Text style={[styles.disclaimerTxt, {marginBottom: 10}]}>Press ACTIVATE NOW to enable these features.</Text>
          <View style={styles.footerBtnCtnr}>
            <Button rounded block light onPress={this.subscribe}>
              <NBText style={styles.btnText}>ACTIVATE NOW</NBText>
            </Button>
        </View>
        </View>

        <Modal isVisible={this.state.isModalVisible}
          onBackdropPress={this._closeModal}
          animationIn="zoomIn"
          animationOut="fadeOut">

          <PurchaseContainer
            onComplete={async () => {
              const data = await this.getSubscriptionData();
              this.props.activateTeam(data);
            }}
            onBuyNowPress={this._closeModal}
          />
        </Modal>

      </View>


    );
  }
}

function mapStateToProps(state) {
  return {
    captainTeams: state.captainTeams,
    playerSubscriptions: state.playerSubscriptions,
    activatedTeams: state.activatedTeams,
    fetchedLineups: state.fetchedLineups,
    unusedTeams: state.fetchedMatches.matches.userData.unusedTeams,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FeaturePage);

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',
    //justifyContent: 'space-between',
    backgroundColor: Colors.appBlue,
  },

  headerContainer: {
    flex: 1.5,
    marginHorizontal: 10,
    marginBottom: 10,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',

 },
 headerText: {
   fontSize: 18,
   color: 'white',
   textAlign: 'center',
   fontWeight: 'bold'
 },
 header2Cntr: {
  paddingVertical: 10,
  borderBottomColor: Colors.steel,
  borderBottomWidth: StyleSheet.hairlineWidth,
 },
 middleContainer: {
   flex: 11,
   borderRadius: 5,
   marginHorizontal: 10,
   //justifyContent: 'center',
   //alignItems: 'center',
   backgroundColor: Colors.appBlueLight
  //paddingHorizontal: 20,

},
itemContainer: {
  flex: 2,
  flexDirection: 'row',
  //justifyContent: 'space-evenly',
  alignItems: 'center',
  paddingHorizontal: 10

},
iconCntr: {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center',
},
txtCtnr: {
  flex: 7,
  flexDirection: 'column',
  padding: 10

},
titleTxt: {
  fontSize: 16,
  color: 'white',
  fontWeight: 'bold',
  paddingBottom: 2
},
subtitleTxt: {
  fontSize: 14,
  color: Colors.steel,
  paddingTop: 2
},
footerContainer: {
  flex: 4,
  justifyContent: 'center',
  alignItems: 'center',

},
footerBtnCtnr: {
  width: '75%'
},
 logo: {
   width: 50,
   height: 50,
   resizeMode: 'contain'
 },
 playerGraphic: {
   width: 300,
   height: 300,
   resizeMode: 'contain'
 },
 h4: {
   fontSize: 26,
   color: 'white',
   textAlign: 'center'
 },
 h5: {
   fontSize: 20,
   color: 'white',
   textAlign: 'center'
 },
 btnText: {
   fontSize: 18,
   color: '#3F51B5',
 },
 disclaimerCntr: {
   padding: 10
 },
 disclaimerTxt: {
   fontSize: 14,
   textAlign: 'center',
   color: 'white',

 },
});
