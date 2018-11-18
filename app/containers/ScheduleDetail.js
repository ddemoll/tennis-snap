import React, { Component } from 'react'

import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

import MatchHeader from '../components/MatchHeader';
import LineupContainer from '../components/LineupContainer'
import MatchFooter from '../components/MatchFooter';
import {detailScrollContainerStyle} from '../styles/ListStyles';

import SegmentedControlTab from 'react-native-segmented-control-tab'
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Button,
  ActivityIndicator,
  AsyncStorage,
  Platform,
  Alert
} from 'react-native'
import { Title, Container, Header, Icon as IconBase, Left, Right, Body, ActionSheet, Button as ButtonBase, Text as TextBase } from 'native-base';
import { Colors } from "../Themes";

//import {AdMobBanner} from 'react-native-admob';
//import AdMobConfig from '../lib/AdMobConfig'

//import Icon from 'react-native-vector-icons/Foundation';

class ScheduleDetail extends Component {

  constructor(props) {
    super(props);
    this.changeStatus = this.changeStatus.bind(this)

    //this.refreshed = false;
    this.isUSTACaptain = false;
    this.isCaptain = false;

  }


  changeStatus(i) {
    const {matchId, ustaNum, name} = this.props.navigation.state.params.meta;
    let reverseStatusMap = {0: "3", 1: "2", 2: "1"};
    this.props.postStatus({match_id: matchId, player_id: ustaNum, avail: reverseStatusMap[i], name})
  }


  goToLineup = () => {
    const {userTeamId, matchId, flight, homeTeamTxt, dateString} = this.props.navigation.state.params.meta;
    this.props.navigation.navigate("LineupEditor", {teamId: userTeamId, matchId, flightName: flight.flightName, homeTeam: homeTeamTxt, dateString })
  }

  shouldFetchLineup = () => {
    const {userTeamId} = this.props.navigation.state.params.meta
    return (this.isCaptain || (userTeamId in this.props.playerSubscriptions.teams && userTeamId in this.props.activatedTeams));
  }

  componentDidMount() {
    if(this.shouldFetchLineup())
      this.props.fetchLineup(this.props.navigation.state.params.meta.matchId);
  }


  render() {
    const {userTeamId, matchId, ustaNum, flight, homeTeamTxt, dateString} = this.props.navigation.state.params.meta;

    //usta captain?
    if(this.props.fetchedMatches.matches.userData.isCaptain) {
      //activated captain?
      this.isCaptain = this.props.captainTeams.teams[userTeamId]
      //user is captain but team is not activated
      this.isUSTACaptain = (userTeamId in this.props.captainTeams.teams)
    }

    let availableCount = 0;
    let availabilityStatus = -1;
    if(matchId in this.props.userScheduleStatus) {
      let statusMap = {"3": 0, "2": 1, "1": 2};
      availabilityStatus = statusMap[this.props.userScheduleStatus[matchId]];
    }

    let myLoader = true;
    let lineupArr = [];
    if(!this.shouldFetchLineup())
      myLoader = false;

    let isLineupPublished = (matchId in this.props.fetchedLineups) &&
      this.props.fetchedLineups[matchId].lineup &&
      this.props.fetchedLineups[matchId].lineup.created &&
      this.props.fetchedLineups[matchId].lineup.published;

    if(!this.props.fetchedLineups.isFetching && (matchId in this.props.fetchedLineups)) {
      myLoader = false;

      //count available players
      let playerStatus = this.props.fetchedLineups[matchId].status;
      Object.keys(playerStatus).forEach(function(ustaNum) {
          if(playerStatus[ustaNum].status == "3") {

            availableCount++
          }
      });


      //lineup
      if(isLineupPublished) {
        let positions = this.props.fetchedLineups[matchId].lineup.positions;
        lineupArr.push(positions['1 Singles']);
        lineupArr.push(positions['2 Singles']);
        lineupArr.push(positions['1 Doubles']);
        lineupArr.push(positions['2 Doubles']);
        lineupArr.push(positions['3 Doubles']);
      }
    }

    let subscribeBtn = null;

    let featuresData = {
      isUSTACaptain: this.isUSTACaptain,
      ustaNum,
      userTeamId,
    }
    let statusTabs = <View>
          <SegmentedControlTab
              tabsContainerStyle={styles.statusContainer}

              tabStyle={{borderRadius: 0, borderColor: 'transparent'}}
                values={['Available', 'Maybe','Not Available']}
                selectedIndex={availabilityStatus}
                onTabPress={this.changeStatus}
              />
              <Text style={{padding: 10, textAlign: 'center', color: availableCount == 0 ? 'red' : 'green'}}>{availableCount} {availableCount == 1 ? 'player' : 'players'} available</Text>
              </View>

    let subBtn = <View style={styles.activateTeamBtnContainer}>
                  <ButtonBase iconLeft style={{backgroundColor: Colors.appBlue}} onPress={() => this.props.navigation.navigate('FeaturePage', {data: featuresData, onComplete: () => {this.props.fetchLineup(matchId)} })}>
                    <IconBase name='ios-add-circle-outline'/>
                    <TextBase>Activate Team</TextBase>
                  </ButtonBase>
                </View>

    //is generic captain
    if(this.isUSTACaptain) {
      //is active captain of team
      if(this.isCaptain) {
        subscribeBtn = statusTabs

      } else {
        subscribeBtn = subBtn

      }
    } else {
      //player is subscribed and team activated by captain
      if((userTeamId in this.props.playerSubscriptions.teams) && (userTeamId in this.props.activatedTeams)) {
        subscribeBtn = statusTabs

        //player subscribed but captain has not activated
      } else if(userTeamId in this.props.playerSubscriptions.teams){
        subscribeBtn = null
      } else {
        subscribeBtn = subBtn
      }
    }

    //MatchFooter data
    var footerData = {
      day: this.props.navigation.state.params.meta.day,
      month: this.props.navigation.state.params.meta.month,
      dateInMonth: this.props.navigation.state.params.meta.dateInMonth,
      time: this.props.navigation.state.params.meta.time,
      facilityName: this.props.navigation.state.params.meta.facilityName,
      facilityAddress: this.props.navigation.state.params.meta.facilityAddress,
      price: this.props.navigation.state.params.meta.price,
      flight: this.props.navigation.state.params.meta.flight,

    };

    return (
      <Container>
          <Header>
              <Left style={{ flex: 1 }}>
            <ButtonBase transparent onPress={() => this.props.navigation.goBack()}>
              <IconBase name="arrow-back" />
            </ButtonBase>
          </Left>
            <Body style={{ flex: 1 }}>
              <Title>{this.props.navigation.state.params.meta.isHome === "True" ? "Home" : "Away"} Match</Title>
            </Body>
            {this.isCaptain ?
            <Right style={{ flex: 1 }}>
              <ButtonBase transparent onPress={this.goToLineup}>
                <TextBase>Lineup</TextBase>
              </ButtonBase>
            </Right> : <Right style={{ flex: 1 }}/>}


          </Header>

          {!myLoader && <ScrollView>

            <MatchHeader awayTeam={this.props.navigation.state.params.meta.awayTeamTxt} homeTeam={this.props.navigation.state.params.meta.homeTeamTxt} date={this.props.navigation.state.params.meta.dateInMonth} month={this.props.navigation.state.params.meta.month} />

            {subscribeBtn}

          {isLineupPublished &&
            <LineupContainer lineup={lineupArr} navigation={this.props.navigation} />
          }

            <MatchFooter data={footerData} navigation={this.props.navigation}/>

          {(this.isCaptain || (userTeamId in this.props.playerSubscriptions.teams)) &&
          <View style={styles.teamActivatedContainer}>
            <View style={styles.teamActivatedSubContainer}>
              <IconBase name="ios-checkmark-circle-outline" style={styles.teamActivatedIcon} />
              <Text style={styles.teamActivatedText}>Team Activated</Text>
            </View>
          </View>}

          </ScrollView>}
          {myLoader && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}


        </Container>

    );
  }
}

function mapStateToProps(state) {
  return {
    //scheduleMap: state.scheduleMap,
    fetchedMatches: state.fetchedMatches,
    fetchedLineups: state.fetchedLineups,
    activatedTeams: state.activatedTeams,
    captainTeams: state.captainTeams,
    playerSubscriptions: state.playerSubscriptions,
    userScheduleStatus: state.userScheduleStatus

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetail);

const styles = StyleSheet.create({
  ...detailScrollContainerStyle,

  activateTeamBtnContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 4
  },
  teamActivatedContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 8
  },
  teamActivatedSubContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  teamActivatedIcon: {
    fontSize: 24,
    color: 'green',
    paddingRight: 4,
    //paddingTop: 4
  },
  teamActivatedText: {
    color: 'green',
    fontSize: 18,
    paddingLeft: 4,

  },
  statusContainer: {
    marginVertical: 4,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
});
