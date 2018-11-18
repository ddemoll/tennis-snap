import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

export default PlayerDetailHeader = ({year, ntrp, wins, losses, ties}) => {
  return (
    <View>
    <View style={styles.headerContainer}>
      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>Record</Text>
      </View>

      <View style={styles.matchTeamContainer}>
        <Text style={{textAlign: 'center'}}>NTRP</Text>
      </View>
    </View>
    <View style={styles.matchContainer}>
        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{`Wins/Ties/Losses ${wins}-${ties}-${losses}`}</Text>
        </View>

        <View style={styles.matchTeamContainer}>
          <Text style={styles.matchTeamText}>{ntrp}</Text>
        </View>
    </View>
  </View>
  )
}

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
