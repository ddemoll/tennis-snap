import React, { Component } from 'react'
import { connect } from 'react-redux';
import { ActionCreators } from '../actions';
import { bindActionCreators } from 'redux';
import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight
} from 'react-native'

import { Title, Container, Header, Icon, Left, Right, Body, ActionSheet, Button as ButtonBase } from 'native-base';

import StatusIndicator from '../components/StatusIndicator'

import {standingsListStyles, scrollListStyles} from '../styles/ListStyles';

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  getSectionHeaderData: (dataBlob, sectionID) => dataBlob[sectionID],
  getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID+':'+rowID]
});

class PositionSelector extends Component {

  goToDetail(player) {
    //console.log(player)
    this.props.updateLocalLineup(player);
    this.props.navigation.pop();

  }

  render(){
    let {title, data, matchId, playerNum} = this.props.navigation.state.params;

    return (
      <Container>
          <Header>
              <Left>
            <ButtonBase transparent onPress={() => this.props.navigation.goBack()}>
              <Icon name="arrow-back" />
            </ButtonBase>
          </Left>
            <Body style={{ flex: 3 }}>
              <Title>Player Availability</Title>
            </Body>
            <Right/>

          </Header>

          <ListView
            ref={(input) => { this.list = input; }}
            enableEmptySections={true}
            dataSource={dataSource.cloneWithRowsAndSections(data.dataBlob, data.sectionIDs, data.rowIDs)}
             renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
            renderRow={(player, sectionID, rowID) => {
              ////console.log(match)
              return(
              <TouchableHighlight onPress={ () => this.goToDetail({pos: title, name: player.name, ustaNum: rowID, matchId, playerNum})} >
                <View style={styles.standingContainer}>
                    <View style={styles.playerContainer}>
                      <Text style={styles.flightText}>{player.name}</Text>
                      <StatusIndicator index={player.status.toString()} />
                    </View>
                    <View style={styles.matchIcon}>

                    </View>
                </View>
              </TouchableHighlight>);
            }}
            renderSectionHeader={(sectionData, sectionID) =>
              <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>{sectionData}</Text>
              </View>

            }
          />

      </Container>

    )
  }
}
function mapStateToProps(state) {
  return {
    captainTeams: state.captainTeams,

  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionSelector);
const styles = StyleSheet.create({
  ...scrollListStyles,
  ...standingsListStyles,
  playerContainer: {
    flex: 1,
    margin: 8,
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',


  },
});
