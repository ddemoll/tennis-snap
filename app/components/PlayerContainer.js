import React, { Component } from 'react'

import {
  View,
  TouchableHighlight,
  Text,
  StyleSheet
} from 'react-native'

class PlayerContainer extends Component {

  goToPlayer(name, id) {
    this.props.navigation.push("PlayerDetail", {title: name, id});
  }

  render() {


    let {player1Name, player1Id, player2Name, player2Id, isDoubles, fontWeight} = this.props;

    let player1 = null, player2 = null;
    if(player1Name === "0") {
      player1 = <Text style={{alignSelf: 'flex-start', color: 'black', fontSize: 16, fontWeight: fontWeight}}>Default</Text>
    } else {
      player1 = <Text onPress={() => this.goToPlayer(player1Name, player1Id)} style={{alignSelf: 'flex-start', color: "black", fontSize: 16, fontWeight: fontWeight}}>{player1Name}</Text>
    }
    if(isDoubles) {
      if(player2Name === "0") {
        player2 = <Text style={{alignSelf: 'flex-start', color: 'black', fontSize: 16, fontWeight: fontWeight}}>Default</Text>
      } else {
        player2 = <Text onPress={() => this.goToPlayer(player2Name, player2Id)} style={{alignSelf: 'flex-start', color: "black", fontSize: 16, fontWeight: fontWeight}}>{player2Name}</Text>
      }
    }

    return (
    <View>
        {player1}
        {player2}

    </View>
    );
  }
}

const styles = StyleSheet.create({
  matchElementContainer: {
    backgroundColor: 'white',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16
  },
  matchElementText: {
    color: 'black',
    fontSize: 16
  },
  matchElementSubText: {
    fontSize: 14
  },
});

export default PlayerContainer
