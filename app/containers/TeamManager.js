import React, { Component } from 'react';
import ReactNative from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ActionCreators } from '../actions';

import { Title, Container, Header, Icon, Left, Right, Body, Button } from 'native-base';


import {detailScrollContainerStyle} from '../styles/ListStyles';
const {
  View,
  ScrollView,
  ListView,
  Switch,
  Text,
  ActivityIndicator,
  TouchableHighlight,
  StyleSheet,
  AsyncStorage
} = ReactNative;

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class TeamManager extends Component {

  constructor(props) {
    super(props);
    this.onTeams = [];
    this.offTeams = [];

    this.state = {
      dataSource: ds.cloneWithRows(this.generateTeamArr(this.props.captainTeams.teams))
    };

  }
/*
  componentWillMount() {

    Actions.refresh({
      rightTitle: "Done",
      onRight: () => {
        Actions.pop()
        console.log(this.onTeams)
        console.log(this.offTeams)
      }

    })
  }
  */

  componentWillReceiveProps(nextProps) {
    this.setState({
      dataSource: ds.cloneWithRows(this.generateTeamArr(nextProps.captainTeams.teams))
    })
  }

  generateTeamArr(teams) {
    let teamsArr = [];
    for (var id in teams) {
      if (teams.hasOwnProperty(id)) {
        let team = teams[id];
        teamsArr.push({id, active: team.active})
      }
    }
    return teamsArr;
  }
  updateTeams(team) {
    if(team.active) {
      this.onTeams.push(team.id)
      let index = this.offTeams.indexOf(team.id);
      if(index > -1) {
        this.offTeams.splice(index, 1);
      }
    } else {
      this.offTeams.push(team.id)
      let index = this.onTeams.indexOf(team.id);
      if(index > -1) {
        this.onTeams.splice(index, 1);
      }
    }
    this.props.updateCaptainTeams(team);

  }

  render() {

    return (
      <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body style={{ flex: 3 }}>
              <Title>Manage Teams</Title>
            </Body>
            <Right/>

          </Header>

          <View style={styles.matchElementContainer}>
            <Text style={styles.matchElementText}>Select teams to captain</Text>
          </View>
          <View style={styles.matchElementContainer}>
            <ListView
              dataSource={this.state.dataSource}
              renderRow={(team) =>
                  <View>
                    <Text>{team.id}</Text>
                    <Switch
                      onValueChange={(value) => this.updateTeams({id: team.id, active: value})}
                      value={team.active} />
                  </View>


              }
            />
          </View>

        </Container>

    );
  }
}

const styles = StyleSheet.create({
  ...detailScrollContainerStyle,
  matchElementContainer: {
    backgroundColor: 'white',
    paddingTop: 16,
    paddingHorizontal: 16
  },
  matchElementText: {
    color: 'black',
    fontSize: 16
  },

});

function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches,
    captainTeams: state.captainTeams

  };
}
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamManager);
