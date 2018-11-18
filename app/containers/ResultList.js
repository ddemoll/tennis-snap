import React, { Component } from 'react'
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native'

import { Title, Container, Header, Icon as Icon2, Left, Right, Body, ActionSheet, Button } from 'native-base';

import styles from '../styles/MatchListStyles';
import { Colors } from "../Themes";
import Icon from 'react-native-vector-icons/Entypo';

//import {AdMobBanner} from 'react-native-admob';
//import AdMobConfig from '../lib/AdMobConfig'

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  getSectionHeaderData: (dataBlob, sectionID) => sectionID,
  getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID+':'+rowID]
});

class ResultList extends Component {
  constructor(props) {
    super(props);

    this.adCount = 0;
  }

  goToDetail(match, awayTextColor, homeTextColor) {
    this.props.navigation.navigate("ResultDetail", {meta: {...match, ...{awayTextColor, homeTextColor}}})

  }

  componentDidMount () {
    //reset addCount on page refresh
    this.adCount = 0;
  }

  render(){

    let list;
    let fetching = this.props.fetchedMatches.isFetching
    if(fetching) {
      list = false;

    } else if(!fetching) {
        if(this.props.fetchedMatches.matches.userData.numTeams > 0) {
          list = <ListView
            ref={(input) => { this.list = input; }}
            dataSource={dataSource.cloneWithRowsAndSections(this.props.fetchedMatches.matches.results.dataBlob, this.props.fetchedMatches.matches.results.sectionIDs, this.props.fetchedMatches.matches.results.rowIDs)}
             renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderRow={(match, sectionID, rowID) => {

              //parse which team won
              let totalWon = "", totalLost = "", awayWeight = "normal", homeWeight = "normal", awayColor = "", homeColor = "", awayTextColor = "gray", homeTextColor = "gray";
              let awayTeamId, homeTeamId, awayTeamTxt = "", homeTeamTxt = "";

              let opponentTeamFacilityName = this.props.teams[match.opponentTeamId].facilityName || match.opponentTeamName
              let userTeamFacilityName = this.props.teams[match.userTeamId].facilityName || match.teamName

              totalHomeWon = match.totalHomeWin;
              totalAwayWon = match.totalHomeLost;
              //check if is home match for users team
              if(match.isHome === "True") {
                homeTeamId = match.userTeamId;
                awayTeamId = match.opponentTeamId;

                homeTeamTxt = userTeamFacilityName;
                awayTeamTxt = opponentTeamFacilityName;
              } else {
                //away match for user
                homeTeamId = match.opponentTeamId;
                awayTeamId = match.userTeamId;

                homeTeamTxt = opponentTeamFacilityName;
                awayTeamTxt = userTeamFacilityName;
              }
              if(match.homeTeamDidWin === "1") {
                homeTextColor = "black";
                homeColor = "#000000";
                awayColor = "transparent";
                homeWeight = "bold";
              } else {
                awayTextColor = "black";
                homeColor = "transparent";
                awayColor = "#000000";
                awayWeight = "bold";
              }

              let textColor = 'black';
              if(match.userTeamId in this.props.activatedTeams) {
                textColor = Colors.appBlue;
              }

              return(
              <View>
              <TouchableHighlight onPress={ () => this.goToDetail(match, awayTextColor, homeTextColor)} >

                <View style={styles.parentContainer}>

                  <Text style={[styles.userTeamText, {color: textColor}]}>{this.props.fetchedMatches.matches.userTeams[match.userTeamId].teamName}</Text>


                  <View style={styles.matchContainer}>
                      <View style={styles.matchDateContainer}>
                        <Text style={styles.matchDateText}>{match.dateInMonth}</Text>
                        <Text style={styles.matchMonthText}>{match.month}</Text>
                      </View>

                      <View style={styles.scoreContainer}>


                        <View style={styles.teamContainer}>
                          <View style={styles.teamNameContainer}>
                            <Text style={[styles.teamNameText, {fontWeight: awayWeight, color: awayTextColor}]}>{awayTeamTxt}</Text>
                          </View>
                          <View style={styles.teamScoreContainer}>
                            <Text style={styles.teamScoreText}>{totalAwayWon}</Text>
                            <Icon name="triangle-left" size={20} color={awayColor} />
                          </View>
                        </View>
                        <View style={styles.teamContainer}>
                          <View style={styles.teamNameContainer}>
                            <Text style={[styles.teamNameText, {fontWeight: homeWeight, color: homeTextColor}]}>{homeTeamTxt}</Text>
                          </View>
                          <View style={styles.teamScoreContainer}>
                            <Text style={styles.teamScoreText}>{totalHomeWon}</Text>
                            <Icon name="triangle-left" size={20} color={homeColor} />
                          </View>
                        </View>

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
                <Icon2 name="ios-menu" />
              </Button>
            </Left>
            <Body>
              <Title>Results</Title>
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
    activatedTeams: state.activatedTeams,

  };
}


export default connect(mapStateToProps)(ResultList);
