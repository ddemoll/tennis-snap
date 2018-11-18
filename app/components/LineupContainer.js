import React, { Component } from 'react'
import {
  View,
  Text,
  StyleSheet
} from 'react-native'

export default class PlayerContainer extends Component {

  goToPlayer(player) {
    this.props.navigation.push("PlayerDetail", {title: player.name, id: player.ustaNum});
  }
  render() {
    let posMap = {0: "1 Singles", 1: "2 Singles", 2: "1 Doubles", 3: "2 Doubles", 4: "3 Doubles"};
    return (
      <View style={styles.parentContainer}>
      <View style={styles.lineupTitleContainer}>
        <Text style={styles.lineupTitleText}>Lineup</Text>
      </View>
      <View style={styles.linupContainer}>

        {this.props.lineup.map((p, index) => {
            if(p.selected) {
              if(p.player2 != undefined) {
                return (
                  <View style={styles.scoreContainer} key={index}>
                    <View style={styles.posContainer}>
                      <Text style={styles.lineupText}>{posMap[index]}</Text>
                    </View>

                    <View style={styles.playerContainer}>
                        <Text style={styles.playerText} onPress={() => this.goToPlayer(p.player1)}>{p.player1.name}</Text>
                    </View>
                    <View style={styles.playerContainer}>
                        <Text style={styles.playerText} onPress={() => this.goToPlayer(p.player2)}>{p.player2.name}</Text>
                    </View>

                  </View>
                )
              } else {
                return (
                  <View style={styles.scoreContainer} key={index}>
                    <View style={styles.posContainer}>
                      <Text style={styles.lineupText}>{posMap[index]}</Text>
                    </View>

                    <View style={styles.playerContainer}>

                        <Text style={styles.playerText} onPress={() => this.goToPlayer(p.player1)}>{p.player1.name}</Text>

                    </View>

                  </View>
                )
              }
            }

        })}
      </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  parentContainer: {
    marginVertical: 4,

    backgroundColor: 'white',

  },
  linupContainer: {
    marginVertical: 4,
    paddingVertical: 8,

  },
  lineupTitleContainer: {
    paddingVertical: 8,
    borderBottomColor: '#cecece',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  lineupTitleText: {
    fontSize: 16,
    paddingLeft: 16,
    color: 'black'
  },
  lineupText: {
    fontSize: 16

  },
  playerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black'
  },
  scoreContainer: {

    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'white',

  },
  posContainer: {
    //paddingTop: 8
  },
  playerContainer: {
    marginTop: 8,
    marginLeft: 8,
    width: 200,

  },

});
