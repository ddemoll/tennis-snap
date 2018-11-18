import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';

import PlayerDetailHeader from '../components/PlayerDetailHeader';
import PlayerContainer from '../components/PlayerContainer';

import Icon from 'react-native-vector-icons/Entypo';
import { Title, Subtitle, Container, Header, Icon as Icon2, Left, Right, Body, Button } from 'native-base';


import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  StyleSheet,
  ActivityIndicator
} from 'react-native'

import {detailScrollContainerStyle} from '../styles/ListStyles';

class PlayerDetail extends Component {

  constructor(props) {
    super(props);
    this.currentYear = new Date().getFullYear();
  }

  componentDidMount() {
    let {title, id} = this.props.navigation.state.params;

    if(this.props.fetchedPlayers.isFetching || this.props.fetchedPlayers[this.props.id] === undefined) {
      this.props.fetchPlayer(title, id, this.currentYear);

    }
  }


  render() {
    let {title, id} = this.props.navigation.state.params;

    let myLoader = true;
    let matches;

    if(!this.props.fetchedPlayers.isFetching && this.props.fetchedPlayers[id] !== undefined) {
      myLoader = false;
      matches = this.props.fetchedPlayers[id].matches;
      var {year, ntrp, wins, losses, ties} = this.props.fetchedPlayers[id];
    }

    return (
      <Container>
          <Header>
              <Left>
            <Button transparent onPress={() => this.props.navigation.goBack()}>
              <Icon2 name="arrow-back" />
            </Button>
          </Left>
            <Body style={{ flex: 3 }}>
              <Title>{title}</Title>
              <Subtitle>{!myLoader ? `${this.props.fetchedPlayers[id].city}, ${this.props.fetchedPlayers[id].state}` : ""}</Subtitle>
            </Body>
            <Right/>
          </Header>

            {!myLoader &&
              <ScrollView>
                <PlayerDetailHeader year={year} ntrp={ntrp} wins={wins} losses={losses} ties={ties} />

                  {matches.length > 0 ? matches.map((match, index) => {

                    //let player1, player1Id, partner, homePlayer2Id, awayPlayer1, awayPlayer1Id, awayPlayer2, awayPlayer2Id;
                    let searchedPlayerWeight, opponentPlayerWeight, searchedPlayerColor = "transparent", opponentPlayerColor = "transparent";
                    if(match.winLossIndicator === "win") {
                      searchedPlayerWeight = "bold";
                      searchedPlayerColor = "#000000";
                    } else {
                      opponentPlayerWeight = "bold";
                      opponentPlayerColor = "#000000";
                    }
                    let noThirdSet = match.set3GamesWon === "0" && match.set3GamesLost === "0";
                    let gamesWon = `${match.set1GamesWon} ${match.set2GamesWon}${noThirdSet ? "" : ` ${match.set3GamesWon}`}`
                    let gamesLost = `${match.set1GamesLost} ${match.set2GamesLost}${noThirdSet ? "" : ` ${match.set3GamesLost}`}`

                    return (
                      <View style={styles.scoreContainer} key={index}>
                        <View style={styles.posContainer}>
                          <Text style={styles.matchElementSubText}>{match.dateString}</Text>
                          <Text style={styles.matchElementSubText}>{match.position}</Text>
                        </View>

                        <View style={styles.playerContainer}>

                          <View style={styles.playerNameContainer}>
                            <PlayerContainer player1Name={title} player1Id={id} player2Name={match.partnerName} player2Id={match.parterUstaNum} isDoubles={match.isSingles === "False"} fontWeight={searchedPlayerWeight} navigation={this.props.navigation}/>
                          </View>
                          <View style={styles.playerScoreContainer}>
                            <Text style={styles.playerScoreText}>{gamesWon}</Text>
                            <Icon name="triangle-left" size={20} color={searchedPlayerColor} />
                          </View>
                        </View>
                        <View style={styles.playerContainer}>
                          <View style={styles.playerNameContainer}>
                            <PlayerContainer player1Name={match.opponent1Name} player1Id={match.opponent1UstaNum} player2Name={match.opponent2Name} player2Id={match.opponent2UstaNum} isDoubles={match.isSingles === "False"} fontWeight={opponentPlayerWeight} navigation={this.props.navigation}/>
                          </View>
                          <View style={styles.playerScoreContainer}>
                            <Text style={styles.playerScoreText}>{gamesLost}</Text>
                            <Icon name="triangle-left" size={20} color={opponentPlayerColor} />
                          </View>
                        </View>

                      </View>
                    );
                  }) : <Text>No matches on record for {this.currentYear} season</Text>}

              </ScrollView>}
              {myLoader && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}


      </Container>
    );
  }


}

function mapStateToProps(state) {
  return {
    fetchedPlayers: state.fetchedPlayers

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerDetail);

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
