import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Icon, Button, Text as NBText } from 'native-base';
import { Colors } from "../Themes";

import {
  View,
  StyleSheet,
  Text
} from 'react-native'


class UserTeamList extends Component {

  render() {

    return (
      <View style={styles.scoreContainer} >

      { this.props.fetchedMatches.matches.userData.teamsInProgress > 0 ?
        Object.keys(this.props.fetchedMatches.matches.userTeams).map((teamID, index) => {
          const {userTeams} = this.props.fetchedMatches.matches;
          if(userTeams[teamID].unplayedMatches > 0) {
            let btn = null
            if(this.props.captainTeams.teams[teamID] || (teamID in this.props.playerSubscriptions.teams)) {
              btn = <Button iconLeft rounded success bordered style={{width: 140}}>
                <Icon name="ios-checkmark-circle-outline" />
                <NBText>Activated</NBText>
              </Button>
            } else {
              let isUSTACaptain = (teamID in this.props.captainTeams.teams);
              let featuresData = {
                isUSTACaptain,
                ustaNum: this.props.ustaNum,
                userTeamId: teamID
              }
              btn = <Button iconLeft style={{backgroundColor: Colors.appBlue, width: 140}} rounded
                onPress={() => this.props.navigate('FeaturePage', {data: featuresData, onComplete: () => {/*do nothing*/} })}
              >
                <Icon name="ios-add-circle-outline" />
                <NBText>Activate</NBText>
              </Button>
            }

              return (
                <View style={styles.teamContainer} key={index}>
                  <View style={styles.teamNameContainer}>
                    <Text style={styles.elementText}>{userTeams[teamID].teamName}</Text>
                  </View>
                  <View>
                    {btn}
                  </View>
                </View>
              )

          }

        }) : <Text style={styles.noDataText}>No active teams.</Text>
      }
      </View>
    )
  }


}
function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches,
    captainTeams: state.captainTeams,
    playerSubscriptions: state.playerSubscriptions
  };
}

export default connect(mapStateToProps, null)(UserTeamList);

const styles = StyleSheet.create({
  scoreContainer: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8
  },
  teamNameContainer: {
    flex: 4,
    flexWrap: 'wrap',
    justifyContent: 'center'

  },
  elementText: {
    color: 'black',
    fontSize: 16
  },
  noDataText: {
    textAlign: 'center',
    padding: 16,
    fontSize: 16
  },

});
