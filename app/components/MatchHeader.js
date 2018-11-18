import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

const MatchHeader = ({awayTeam, homeTeam, date, month}) => {
  return (
    <View style={{marginVertical: 4}}>
    <View style={styles.headerContainer}>
      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>Away</Text>
      </View>
      <View style={styles.matchDateContainer}></View>
      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>Home</Text>
      </View>
    </View>
    <View style={styles.matchContainer}>
        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{awayTeam}</Text>
        </View>
        <View style={styles.matchDateContainer}>
          <Text style={styles.matchDateText}>{date}</Text>
          <Text style={styles.matchMonthText}>{month}</Text>
        </View>
        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{homeTeam}</Text>
        </View>
    </View>

  </View>
  )
}

export default MatchHeader

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
      flex: 2
  },
  matchDateText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'black'
  },
  matchMonthText: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red'
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
