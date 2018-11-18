import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

import MatchResultHeader from '../components/MatchResultHeader';
import PlayerContainer from '../components/PlayerContainer';
import MatchFooter from '../components/MatchFooter';

import Icon from 'react-native-vector-icons/Entypo';

import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  StyleSheet,
  Platform,
  Linking,
  ActivityIndicator
} from 'react-native'
import { Title, Container, Header, Icon as Icon2, Left, Right, Body, Button } from 'native-base';

//import {AdMobBanner} from 'react-native-admob';
//import AdMobConfig from '../lib/AdMobConfig'

import {detailScrollContainerStyle} from '../styles/ListStyles';

class ResultDetail extends Component {

  componentDidMount() {

    if(this.props.fetchedScores.isFetching || this.props.fetchedScores[this.props.navigation.state.params.meta.matchId] === undefined) {
      this.props.fetchScores(this.props.navigation.state.params.meta.matchId, this.props.navigation.state.params.meta.userTeamId, this.props.navigation.state.params.meta.opponentTeamId);

    }

  }

  render() {
    let myLoader = true;
    let statusTxt = "", resultColor = "", homeTeamTxt, awayTeamTxt;

    if(!this.props.fetchedScores.isFetching && this.props.fetchedScores[this.props.navigation.state.params.meta.matchId] !== undefined) {

          myLoader = false;

          const {matchId, opponentTeamId, userTeamId, opponentTeamName, teamName, totalHomeWin, totalHomeLost, isHome, day, month, dateInMonth, time, facilityName, facilityAddress, price} = this.props.navigation.state.params.meta

          var {matchScores, userTeamInfo} = this.props.fetchedScores[this.props.navigation.state.params.meta.matchId];
          var homeTeamId;


            //parse which team won
            let resultType = "", totalWon = "", totalLost = "";
            let opponentTeamFacilityName = this.props.teams[opponentTeamId].facilityName || opponentTeamName
            let userTeamFacilityName = this.props.teams[userTeamId].facilityName || teamName

            //check if is home match for users team
            if(isHome === "True") {
              homeTeamId = userTeamId;
              homeTeamTxt = userTeamFacilityName;
              awayTeamTxt = opponentTeamFacilityName;
              totalWon = totalHomeWin;
              totalLost = totalHomeLost;

            } else {
              //away match
              homeTeamId = opponentTeamId;
              homeTeamTxt = opponentTeamFacilityName;
              awayTeamTxt = userTeamFacilityName;
              totalWon = totalHomeLost;
              totalLost = totalHomeWin;

            }

          if(this.props.fetchedScores[matchId].scoresReported) {
            //no scores reported all courts double default
            myLoader = false;
            statusTxt = "No matches were played";
          }


          //MatchFooter data
          var footerData = {
            day,
            month,
            dateInMonth,
            time,
            facilityName,
            facilityAddress,
            price,
            flight: this.props.userTeams[userTeamId]
          };

        }


    return (
      <Container>
          <Header>
              <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon2 name="arrow-back" />
            </Button>
          </Left>
            <Body>
              <Title>{this.props.navigation.state.params.meta.isHome === "True" ? "Home" : "Away"} Match</Title>
            </Body>
            <Right/>

          </Header>

          {!myLoader &&
            <ScrollView>

              <MatchResultHeader awayTeam={awayTeamTxt} homeTeam={homeTeamTxt}
                date={this.props.navigation.state.params.meta.dateInMonth} month={this.props.navigation.state.params.meta.month}
                awayGamesW={this.props.navigation.state.params.meta.totalHomeLost} homeGamesW={this.props.navigation.state.params.meta.totalHomeWin}
                awayTextColor={this.props.navigation.state.params.meta.awayTextColor} homeTextColor={this.props.navigation.state.params.meta.homeTextColor}
               />

              {!this.props.fetchedScores[this.props.navigation.state.params.meta.matchId].scoresReported &&
              <View style={styles.resultContainer}>
                <Text style={{color: "black"}}>{statusTxt}</Text>
              </View>
              }
              <View style={{marginVertical: 4}}>
                {this.props.fetchedScores[this.props.navigation.state.params.meta.matchId].scoresReported &&
                  matchScores.map((match, index) => {

                  let homeColor, awayColor, homeTextWeight, awayTextWeight, homeFontColor = "gray", awayFontColor = "gray", scoreArr = match.score.split(","), homeScore = "", awayScore = "";
                  let homePlayer1, homePlayer1Id, homePlayer2, homePlayer2Id, awayPlayer1, awayPlayer1Id, awayPlayer2, awayPlayer2Id;
                  if(match.status === "4") {
                    //double default
                    //hide arrows
                    homeColor = "#FFFFFF";
                    awayColor = "#FFFFFF";
                    homePlayerText = awayPlayerText = "Default";
                  } else {
                    if(homeTeamId === match.winningTeamId) {
                      homeTextWeight = "bold";
                      homeFontColor = "black";
                      homeColor = "#000000";
                      awayColor = "#FFFFFF";
                      for(let i = 0; i<scoreArr.length; ++i) {
                        i%2===0 ? homeScore += `${scoreArr[i]} ` : awayScore += `${scoreArr[i]} `;
                      }

                      homePlayer1 = match.winningPlayer1Name;
                      homePlayer1Id = match.winningPlayer1USTANumber;
                      homePlayer2 = match.winningPlayer2Name;
                      homePlayer2Id = match.winningPlayer2USTANumber;
                      awayPlayer1 = match.losingPlayer1Name;
                      awayPlayer1Id = match.losingPlayer1USTANumber;
                      awayPlayer2 = match.losingPlayer2Name;
                      awayPlayer2Id = match.losingPlayer2USTANumber;

                    } else {
                      //AWAY WON
                      awayTextWeight = "bold";
                      awayFontColor = "black";
                      homeColor = "#FFFFFF";
                      awayColor = "#000000";
                      for(let i = 0; i<scoreArr.length; ++i) {
                        i%2===0 ? awayScore += `${scoreArr[i]} ` : homeScore += `${scoreArr[i]} `;
                      }
                      homePlayer1 = match.losingPlayer1Name;
                      homePlayer1Id = match.losingPlayer1USTANumber;
                      homePlayer2 = match.losingPlayer2Name;
                      homePlayer2Id = match.losingPlayer2USTANumber;
                      awayPlayer1 = match.winningPlayer1Name;
                      awayPlayer1Id = match.winningPlayer1USTANumber;
                      awayPlayer2 = match.winningPlayer2Name;
                      awayPlayer2Id = match.winningPlayer2USTANumber;
                    }
                  }

                  return (
                    <View style={styles.scoreContainer} key={index}>
                      <View style={styles.posContainer}>
                        <Text style={styles.matchElementSubText}>{match.position} {match.matchFormat}</Text>
                      </View>

                      <View style={styles.playerContainer}>

                        <View style={styles.playerNameContainer}>
                          <PlayerContainer player1Name={awayPlayer1} player1Id={awayPlayer1Id} player2Name={awayPlayer2} player2Id={awayPlayer2Id} isDoubles={match.matchFormat === "Doubles"} fontWeight={awayTextWeight} navigation={this.props.navigation} />
                        </View>
                        <View style={styles.playerScoreContainer}>
                          <Text style={styles.playerScoreText}>{awayScore}</Text>
                          <Icon name="triangle-left" size={20} color={awayColor} />
                        </View>
                      </View>
                      <View style={styles.playerContainer}>
                        <View style={styles.playerNameContainer}>
                          <PlayerContainer player1Name={homePlayer1} player1Id={homePlayer1Id} player2Name={homePlayer2} player2Id={homePlayer2Id} isDoubles={match.matchFormat === "Doubles"} fontWeight={homeTextWeight} navigation={this.props.navigation} />
                        </View>
                        <View style={styles.playerScoreContainer}>
                          <Text style={styles.playerScoreText}>{homeScore}</Text>
                          <Icon name="triangle-left" size={20} color={homeColor} />
                        </View>
                      </View>

                    </View>
                  );
                })
              }
              </View>

              <MatchFooter data={footerData} navigation={this.props.navigation}/>

            </ScrollView>}
            {myLoader && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}

        </Container>

    );
  }


}

function mapStateToProps(state) {
  return {
    fetchedScores: state.fetchedScores,
    //used to get flight name
    userTeams: state.fetchedMatches.matches.userTeams,

    teams: state.teams

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultDetail);

const styles = StyleSheet.create({
  ...detailScrollContainerStyle,
  resultContainer: {
    paddingTop: 16,
    backgroundColor: 'white',
    alignItems: 'center'
  },
  scoreContainer: {

    paddingBottom: 16,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'white',
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  posContainer: {
    paddingTop: 8
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8
  },
  playerScoreContainer: {
    flex: .75,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  arrowContainer: {
    flex: .25,
    justifyContent: 'flex-end'
  },
  playerNameContainer: {
    flex: 4,
    flexWrap: 'wrap'
  },
  playerNameText: {
    color: 'black',
    fontSize: 16
  },
  playerScoreText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold'
  },


});
