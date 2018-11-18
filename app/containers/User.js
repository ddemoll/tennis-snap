import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

import {detailScrollContainerStyle} from '../styles/ListStyles';
const {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  AsyncStorage
} = ReactNative;
import { Title, Container, Content, Header, Icon, Left, Right, Body, Button, Text as NBText } from 'native-base';
import { Colors } from "../Themes";

import UserTeamList from './UserTeamList'

import PurchaseContainer from './PurchaseContainer'
import Modal from "react-native-modal";

class User extends Component {

  state = {
    isModalVisible: false
  };
  _openModal = () => this.setState({ isModalVisible: true });
  _closeModal = () => this.setState({ isModalVisible: false });

   logout = () => {
     this.props.logout();
     AsyncStorage.setItem('isLoggedIn', "0");
     AsyncStorage.setItem('ustaNum', '0');
     AsyncStorage.setItem('isCaptain', '0');
     this.props.navigation.navigate('Welcome');
   }

  render() {
    let myLoader = true
    //has data come back from server
    if(!this.props.fetchedMatches.isFetching) {
      myLoader = false;
      var {playerName, ustaNum, ntrp, isCaptain, unusedTeams} = this.props.fetchedMatches.matches.userData;

    }

    return (

      <Container>

          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body style={{ flex: 3 }}>
              <Title>My Account</Title>
            </Body>
            <Right/>

          </Header>
          <Content>


          {!myLoader && <View>

            <View style={styles.matchElementContainer}>
              <Text style={styles.elementText}>{playerName}</Text>
            </View>
            <View style={styles.matchElementContainer}>
              <Text style={styles.elementText}>USTA #: {ustaNum}</Text>
            </View>
            <View style={[styles.matchElementContainer, {paddingBottom: 8}]}>
              <Text style={styles.elementText}>NTRP: {ntrp}</Text>
            </View>


            <View style={styles.parentContainer}>
              <View style={styles.lineupTitleContainer}>
                <Text style={styles.lineupTitleText}>My Teams</Text>
              </View>

              <UserTeamList ustaNum={ustaNum} navigate={this.props.navigation.navigate}/>
            </View>


                {
                  isCaptain &&
                  <View style={styles.bankContainer}>
                    <View style={styles.teamNameContainer}>
                      <Text style={[styles.elementText, {color: (unusedTeams > 0) ? Colors.appBlue : 'red'}]}>Unused Teams: {unusedTeams}</Text>
                    </View>
                    <View>
                      <Button style={{'height': 40}} rounded success bordered onPress={this._openModal}>
                        <NBText>Buy More</NBText>
                      </Button>
                    </View>

                  </View>
                }


            <View style={styles.logoutBtnCntr}>
              <Button rounded block>
                <NBText onPress={this.logout}>LOG OUT</NBText>
              </Button>
            </View>

            </View>

          }
          {myLoader && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}

          <Modal isVisible={this.state.isModalVisible}
            onBackdropPress={this._closeModal}
            animationIn="zoomIn"
            animationOut="fadeOut">

            <PurchaseContainer

              onBuyNowPress={this._closeModal}
            />
          </Modal>

          </Content>
        </Container>
    );
  }
}

const styles = StyleSheet.create({

  matchElementContainer: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingHorizontal: 16
  },
  elementText: {
    color: 'black',
    fontSize: 16
  },

  parentContainer: {
    backgroundColor: 'white',
    borderTopColor: '#cecece',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,


    paddingVertical: 8,

  },
  lineupTitleText: {
    fontSize: 16,
    paddingLeft: 16,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  lineupText: {
    fontSize: 16

  },


  teamNameContainer: {
    flex: 4,
    flexWrap: 'wrap',
    justifyContent: 'center'

  },
  bankContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,

  },
  logoutBtnCntr: {
    paddingTop: 16,
    paddingHorizontal: 16,
    //alignSelf: 'flex-end'
  }

});

function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches,
    captainTeams: state.captainTeams,
    playerSubscriptions: state.playerSubscriptions

  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(User);
