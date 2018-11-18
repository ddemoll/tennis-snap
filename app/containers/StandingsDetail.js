import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

import {detailScrollContainerStyle} from '../styles/ListStyles';

import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  StyleSheet,
  Navigator,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native'
import { Title, Container, Header, Icon, Left, Right, Body, ActionSheet, Button } from 'native-base';

import {AdMobBanner} from 'react-native-admob';
import AdMobConfig from '../lib/AdMobConfig'

class StandingsDetail extends Component {

  componentDidMount() {

    let {meta} = this.props.navigation.state.params;

    if(this.props.fetchedStandings.isFetching || this.props.fetchedStandings[meta.flightId] === undefined) {
      this.props.fetchStandings(meta.flightId, meta.subflightId);

    }

  }

  render() {
    let {title, meta} = this.props.navigation.state.params;
    let myLoader = true;

    if(!this.props.fetchedStandings.isFetching && this.props.fetchedStandings[meta.flightId] !== undefined) {
      myLoader = false;
      var teams = this.props.fetchedStandings[meta.flightId].teams;

    }


    return (
      <Container>
          <Header>
              <Left>
            <Button transparent onPress={() => this.props.navigation.pop()}>
              <Icon name="arrow-back" />
            </Button>
          </Left>
            <Body style={{ flex: 3 }}>
              <Title>{title}</Title>
            </Body>
            <Right/>

          </Header>

          {!myLoader &&
          <ScrollView>

            <View style={styles.headerContainer}>
              <View style={styles.rankContainer}>
                <Text style={styles.elementText}>RK</Text>
              </View>
              <View style={styles.teamContainer}>
                <Text style={styles.elementText}>Team</Text>
              </View>
              <View style={styles.recordContainer}>
                <Text style={styles.elementText}>Record</Text>
              </View>
              <View style={styles.tieContainer}>
                <Text style={styles.elementText}>Tiebreak</Text>
              </View>
            </View>

            {teams.map((team, index) => {


              let {teamId, wins, losses, indwins, indlosses, setslost, gameslost, tiebreaker} = team;
              console.log(teamId)
              let teamName = "";
              if(this.props.teams[teamId] == undefined) {
                teamName = "Unknown";
              } else {
                  teamName = this.props.teams[teamId].facilityName
              }


              return (
                <View style={styles.standingContainer} key={index}>
                  <View style={styles.rankContainer}>
                    <Text style={styles.elementText}>{index+1}</Text>
                  </View>
                  <View style={styles.teamContainer}>
                    <Text style={styles.elementText}>{teamName}</Text>
                  </View>
                  <View style={styles.recordContainer}>
                    <Text style={styles.elementText}>{wins}-{losses}</Text>
                  </View>
                  <View style={styles.tieContainer}>
                    <Text style={styles.elementText}>{tiebreaker === "0" ? "-" : `${team[tiebreaker]} ${tiebreaker}`}</Text>
                  </View>
                </View>
              );
            })
          }

          </ScrollView>
          }

          {myLoader && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}

          <AdMobBanner
            adSize="smartBannerPortrait"
            adUnitID={AdMobConfig.getAdUnitID(1)}
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.log(error)}
            style={{alignSelf:'center'}}
          />

        </Container>
    );
  }

}

function mapStateToProps(state) {
  return {
    fetchedStandings: state.fetchedStandings,
    teams: state.teams
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StandingsDetail);

const styles = StyleSheet.create({

  ...detailScrollContainerStyle,
  headerContainer: {

    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'white',
    borderBottomColor: '#707070',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',

    paddingTop: 8
  },
  standingContainer: {

    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'white',
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',

    paddingTop: 16
  },
  rankContainer: {
    flex: 1
  },
  teamContainer: {
    flex: 5
  },
  recordContainer: {
    flex: 2
  },
  tieContainer: {
    flex: 2
  },
  elementText: {
    textAlign: 'center',
    color: 'black'
  }
});
