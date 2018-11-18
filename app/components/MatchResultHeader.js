import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

const MatchResultHeader = ({awayTeam, homeTeam, date, month, awayGamesW, homeGamesW, awayTextColor, homeTextColor}) => {
  return (
    <View>
    <View style={styles.headerContainer}>
      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>Away</Text>
      </View>
      <View style={styles.matchDateContainer}>

        <Text style={styles.matchDateText}>{month} {date}</Text>

      </View>
      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>Home</Text>
      </View>
    </View>
    <View style={styles.matchContainer}>
        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{awayTeam}</Text>
        </View>
        <View style={styles.matchDateContainer}>
          <Text style={styles.matchScoreText}><Text style={{color: awayTextColor}}>{awayGamesW}</Text>   <Text style={{color: homeTextColor}}>{homeGamesW}</Text></Text>
        </View>
        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{homeTeam}</Text>
        </View>
    </View>
  </View>
  )
}

export default MatchResultHeader

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  matchContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,

  },
  matchDateContainer: {
      flex: 2,
  },
  matchDateText: {
    //fontSize: 16,
    textAlign: 'center',
    //color: 'black'
  },
  matchScoreText: {
    fontSize: 32,
    textAlign: 'center',
  },
  matchTeamContainer: {
    flex: 4,
    flexWrap: 'wrap',
  },
  matchTeamText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'center',
  },

});
