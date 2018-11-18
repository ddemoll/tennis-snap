import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import { Title, Text as TextBase, Container, Header, Icon as IconBase, Left, Right, Body, ActionSheet, Button as ButtonBase, Footer, FooterTab } from 'native-base';
import Icon from 'react-native-vector-icons/Feather';

import {
  View,
  ScrollView,
  TouchableHighlight,
  Text,
  Button,
  StyleSheet,
  Platform,
  Linking,
  ActivityIndicator,
  Alert
} from 'react-native'


class LineupEditor extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props.navigation.state.params)
    let {teamId, matchId} = this.props.navigation.state.params;


    if(this.props.roster.teams[teamId] === undefined) {
      this.props.fetchRoster(teamId, matchId);
    }
    //create working lineup for captain to edit
    this.props.createLocalLineup(this.props.fetchedLineups[matchId].lineup);

  }

  getData(pos, playerNum) {
    let lin =  this.props.localLineup.lineup;
    if(lin.created && lin.positions[pos].selected && lin.positions[pos][playerNum] != undefined) {
      return {...lin.positions[pos][playerNum], pos, playerNum};
    } else {
      return {name: "Select Player", ustaNum: "0", pos, playerNum};
    }
  }

  render() {
    let {teamId, matchId, flightName, homeTeam, dateString } = this.props.navigation.state.params;

    let myLoader = true;

    if(this.props.fetchedLineups.updated !== null) {
      this.props.postNewLineupDone();
      this.props.navigation.pop();
      return null
    }

    if(!this.props.roster.isFetching ) {

      myLoader = false;

      //merge status and roster
      let dynamoMap = {0: 3, 1: 2, 2: 1, 3: 0};
      let sectionIDs = [], rowIDs = [];
      sectionIDs[0] = 0;
      sectionIDs[1] = 1;
      sectionIDs[2] = 2;
      sectionIDs[3] = 3;
      rowIDs[0] = [];
      rowIDs[1] = [];
      rowIDs[2] = [];
      rowIDs[3] = [];
      var data = {dataBlob: {}};
      let status = this.props.fetchedLineups[matchId].status;
      console.log(status)
      let roster = this.props.roster.teams[teamId];
      let mergedRoster = {};
      let player = {};
      if(roster != undefined) {
        for (var ustaNum in roster) {
          if (roster.hasOwnProperty(ustaNum)) {
            player = JSON.parse(JSON.stringify(roster[ustaNum]));
            player.status = (status[ustaNum] && status[ustaNum].status) ? parseInt(status[ustaNum].status) : 0;
            rowIDs[dynamoMap[player.status]].push(ustaNum);
            data.dataBlob[dynamoMap[player.status]+':'+ustaNum] = player;
          }
        }
        data.dataBlob[0] = `Available (${rowIDs[0].length})`;
        data.dataBlob[1] = `Maybe (${rowIDs[1].length})`;
        data.dataBlob[2] = `Not Available (${rowIDs[2].length})`;
        data.dataBlob[3] = `No Response (${rowIDs[3].length})`;
        data.sectionIDs = sectionIDs;
        data.rowIDs = rowIDs;
      }
      //console.log(data)


    }

    const Position = ({p}) => (
      <View style={styles.posContainer}>
        <View style={styles.posTextContainer}>
          <TextBase style={styles.posText}>{p.pos}</TextBase>
        </View>
        <View>
        <ButtonBase bordered iconLeft onPress={() => this.props.navigation.navigate("PositionSelector", {title: p.pos, data, matchId, playerNum: p.playerNum})}>
          <IconBase name='ios-create-outline'/>
          <TextBase>{p.name}</TextBase>
        </ButtonBase>
        </View>

      </View>
    );

    return (
      <Container style={{backgroundColor: 'white'}}>
          <Header>
              <Left style={{ flex: 1 }}>
            <ButtonBase transparent onPress={() => this.props.navigation.goBack()}>
              <IconBase name="arrow-back" />
            </ButtonBase>
          </Left>
            <Body style={{ flex: 1 }}>
              <Title>Lineup</Title>
            </Body>
            <Right style={{ flex: 1 }}>
            <ButtonBase transparent onPress={() => this.props.navigation.goBack()}>
              <TextBase>Cancel</TextBase>
            </ButtonBase>
            </Right>

          </Header>
          {this.props.fetchedLineups.error !== null && <Text style={{padding: 10, textAlign: 'center', color: 'red'}}>Failed to update lineup!</Text>}
          {(myLoader || this.props.fetchedLineups.isFetching) && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}
          {!myLoader &&
            <ScrollView>

                <Position p={this.getData("1 Singles", "player1")} />
                <Position p={this.getData("2 Singles", "player1")} />
                <Position p={this.getData("1 Doubles", "player1")} />
                <Position p={this.getData("1 Doubles", "player2")} />
                <Position p={this.getData("2 Doubles", "player1")} />
                <Position p={this.getData("2 Doubles", "player2")} />
                <Position p={this.getData("3 Doubles", "player1")} />
                <Position p={this.getData("3 Doubles", "player2")} />

            </ScrollView>


          }
          {!myLoader &&
          <Footer>
          {!this.props.fetchedLineups[matchId].lineup.published &&
          <FooterTab>
          <ButtonBase
             onPress={() => {
               if(!this.props.localLineup.updated) {
                 Alert.alert('No changes detected!', 'Please make a change to the lineup before saving.')
               } else {
                 let data = {
                   db: {
                     teamId,
                     matchId,
                     published: false,
                   }
                 }
                 this.props.postLineup(data);
               }

             }}
           >
           <TextBase>Save Draft</TextBase>
           </ButtonBase>
           </FooterTab>
         }
         <FooterTab>
         <ButtonBase
              onPress={() => {
                if(!this.props.localLineup.updated && (!this.props.fetchedLineups[matchId].lineup.created || this.props.fetchedLineups[matchId].lineup.published)) {
                  Alert.alert('No changes detected!', 'Please make a change to the lineup before publishing.')
                } else {
                  let data = {
                    db: {
                      teamId,
                      matchId,
                      published: true,
                    },
                    notification: {
                      flightName,
                      homeTeam,
                      dateString
                    }
                  }
                  this.props.postLineup(data);

                }
              }}
            >
            <TextBase>Publish</TextBase>
            </ButtonBase>
            </FooterTab>
            </Footer>}

      </Container>
    );
  }


}
function mapStateToProps(state) {
  return {
    roster: state.roster,
    fetchedLineups: state.fetchedLineups,
    localLineup: state.localLineup
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LineupEditor);

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  posContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 8,
    paddingLeft: 16,
    paddingRight: 8,
    backgroundColor: 'white',

  },
  posText: {
    fontSize: 20,
    marginBottom: 8
  },
  posTextContainer: {
    paddingTop: 8
  },
  playerContainer: {
    marginTop: 8,
    borderWidth : 1,
		width  : 200,
		padding : 10,
		borderColor : "black"
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }

});
