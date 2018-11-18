import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  ListView,
  TouchableHighlight,
  ActivityIndicator,
  AsyncStorage,
  Platform,
  Linking
} from 'react-native'
import { Title, Container, Header, Icon as IconBase, Left, Right, Body, Button } from 'native-base';

//import {AdMobBanner} from 'react-native-admob';
//import AdMobConfig from '../lib/AdMobConfig'

import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';
import StatusIndicator from '../components/StatusIndicator'

import styles from '../styles/MatchListStyles';
import { Colors } from "../Themes";

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  getSectionHeaderData: (dataBlob, sectionID) => sectionID,
  getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID+':'+rowID]
});

class ScheduleList extends Component {

  constructor(props) {
    super(props);
    this.noTokenErrorDisplayed = false;
    this.adCount = 0;
  }

  componentDidMount () {
    this.adCount = 0;

    AsyncStorage.getItem("isLoggedIn").then((value) => {
         //console.log("ustaNum", value)
         if(value == null || value === "0") {
           this.props.navigation.navigate("LoginNav")
         } else {

          AsyncStorage.getItem("ustaNum").then((value) => {
               //console.log("ustaNum", value)
               if(value == null || value === "0") {
                 this.props.navigation.navigate("LoginNav")
               } else {
                 AsyncStorage.getItem("isCaptain").then((isC) => {
                   //dont fetch matches again is coming from ActivateTeamsPage
                   let shouldFetchMatches = this.props.navigation.getParam('shouldFetchMatches', true)
                   if(shouldFetchMatches) {
                     this.props.fetchMatches(value, isC === "1");
                   }

                 }).done();

               }
           }).done();
      }
    }).done();
 }

  goToDetail(match, awayTeamTxt, homeTeamTxt) {


    let flight = this.props.fetchedMatches.matches.userTeams[match.userTeamId];
    let meta = {...match, ...{awayTeamTxt, homeTeamTxt, flight, ustaNum: this.props.fetchedMatches.matches.userData.ustaNum, name: this.props.fetchedMatches.matches.userData.playerName}};

    this.props.navigation.navigate("ScheduleDetail", {meta})

  }

  render(){
    let list;
    let fetching = this.props.fetchedMatches.isFetching
    if(fetching) {
      list = false;

    } else if(!fetching) {
      if(this.props.fetchedMatches.matches.userData.numTeams > 0) {
          //autosubscribe player to all teams activated by captain
          if(this.props.playerSubscriptions.error && this.props.playerSubscriptions.errorMsg == 'noToken' && !this.noTokenErrorDisplayed) {
            Alert.alert(
              'Unable to activate team!',
              'Enable push notifications for TennisSnap in your settings before activating team.',
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
            this.noTokenErrorDisplayed = true;
          }

          list = <ListView
                ref={(input) => { this.list = input; }}
                dataSource={dataSource.cloneWithRowsAndSections(this.props.fetchedMatches.matches.schedule.dataBlob, this.props.fetchedMatches.matches.schedule.sectionIDs, this.props.fetchedMatches.matches.schedule.rowIDs)}
                 renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
                renderRow={(match, sectionID, rowID) => {

                  //some teams dont have facilityName or facilityAddress -> defaults to team name
                  let opponentTeamFacilityName = this.props.teams[match.opponentTeamId].facilityName || match.opponentTeamName
                  let userTeamFacilityName = this.props.teams[match.userTeamId].facilityName || match.teamName
                  let awayTeamTxt = "", homeTeamTxt = "";
                  let textColor = 'black';

                  //second part of expression used to determine when captain activated from ActivateTeamsPage
                  if((match.userTeamId in this.props.activatedTeams) || (this.props.captainTeams.teams && this.props.captainTeams.teams[match.userTeamId]) ) {
                    textColor = Colors.appBlue;
                  }

                  //check if is home match for users team
                  if(match.isHome === "True") {
                    homeTeamId = match.userTeamId;
                    awayTeamId = match.opponentTeamId;

                    if(userTeamFacilityName != opponentTeamFacilityName) {
                      homeTeamTxt = userTeamFacilityName;
                      awayTeamTxt = opponentTeamFacilityName;
                    } else {
                      homeTeamTxt = this.props.fetchedMatches.matches.userTeams[match.userTeamId].teamName
                      awayTeamTxt = match.opponentTeamName
                    }

                  } else {
                    //away match for user
                    homeTeamId = match.opponentTeamId;
                    awayTeamId = match.userTeamId;

                    if(userTeamFacilityName != opponentTeamFacilityName) {
                      homeTeamTxt = opponentTeamFacilityName;
                      awayTeamTxt = userTeamFacilityName;
                    } else {
                      homeTeamTxt = match.opponentTeamName
                      awayTeamTxt = this.props.fetchedMatches.matches.userTeams[match.userTeamId].teamName
                    }
                  }

                  let matchStausIcon = null;
                  if(match.matchId in this.props.userScheduleStatus) {
                    matchStausIcon = <StatusIndicator index={this.props.userScheduleStatus[match.matchId]} />
                  } else if((match.userTeamId in this.props.playerSubscriptions.teams) && (match.userTeamId in this.props.activatedTeams) || this.props.captainTeams.teams[match.userTeamId]) {
                    //show question mark by default
                    matchStausIcon = <StatusIndicator index="2" />
                  }


                  return(
                  <View>

                  <TouchableHighlight onPress={ () => this.goToDetail(match, awayTeamTxt, homeTeamTxt)} >

                    <View style={styles.parentContainer}>

                      <Text style={[styles.userTeamText, {color: textColor}]}>{this.props.fetchedMatches.matches.userTeams[match.userTeamId].teamName}</Text>

                      <View style={styles.matchContainer}>
                          <View style={styles.matchDateContainer}>
                            <Text style={styles.matchDateText}>{match.month} {match.dateInMonth}</Text>
                            <Text style={styles.matchDateText}>{match.day}</Text>
                            <Text style={styles.matchMonthText}>{match.time}</Text>
                          </View>

                          <View style={styles.matchTeamsContainer}>

                            <View style={styles.teamContainer}>
                              <View style={styles.teamNameContainer}>
                                <Text style={[styles.teamNameText, {color: 'black'}]}>{awayTeamTxt}</Text>
                              </View>
                            </View>
                            <View style={styles.teamContainer}>
                              <View style={styles.teamNameContainer}>
                                <Text style={[styles.teamNameText, {color: 'black'}]}>@{homeTeamTxt}</Text>
                              </View>
                            </View>

                          </View>

                          <View style={styles.matchIconContainer}>
                            {matchStausIcon}
                          </View>

                      </View>

                    </View>

                  </TouchableHighlight>

                  </View>
                  );
                }}
                renderSectionHeader={(sectionData, sectionID) =>
                  <View style={styles.sectionHeader}>
                  <Text style={styles.sectionHeaderText}>{sectionID}</Text>
                  </View>

                }
              />
      } else {
        list = <Text style={styles.noDataText}>No teams on record for {this.props.fetchedMatches.matches.userData.playerName}</Text>;
      }
    }



    return (
      <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <IconBase name="ios-menu" />
              </Button>
            </Left>
            <Body style={{flex: 3}}>
              <Title>Upcoming Matches</Title>
            </Body>
            <Right/>

          </Header>


          {fetching && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}
          {!fetching && list}

        </Container>

    )
  }
}

function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches,
    teams: state.teams,
    playerSubscriptions: state.playerSubscriptions,
    userScheduleStatus: state.userScheduleStatus,
    activatedTeams: state.activatedTeams,
    captainTeams: state.captainTeams,
  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList);
