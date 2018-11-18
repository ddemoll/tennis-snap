import React, { Component } from 'react'

import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight,
  ActivityIndicator
} from 'react-native'

import { Title, Container, Header, Icon, Left, Right, Body, ActionSheet, Button } from 'native-base';

import { connect } from 'react-redux';

import {standingsListStyles} from '../styles/ListStyles';

import {AdMobBanner} from 'react-native-admob';
import AdMobConfig from '../lib/AdMobConfig'

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
  getSectionHeaderData: (dataBlob, sectionID) => sectionID,
  getRowData: (dataBlob, sectionID, rowID) => dataBlob[sectionID+':'+rowID]
});

class StandingsList extends Component {
  constructor(props) {
    super(props);

    this.adCount = 0;
  }

  goToDetail(flight) {

    this.props.navigation.navigate("StandingsDetail", {

      title: flight.flightName,
      meta: flight
    })

  }

  componentDidMount () {
    //reset addCount on page refresh
    this.adCount = 0;
  }

  render(){

    let list;
    let fetching = this.props.fetchedMatches.isFetching
    if(fetching) {
      list = false;

    } else if(!fetching) {
      if(this.props.fetchedMatches.matches.userData.numTeams > 0) {

        let {standings} = this.props.fetchedMatches.matches

        list = <ListView
          ref={(input) => { this.list = input; }}
          dataSource={dataSource.cloneWithRowsAndSections(standings.dataBlob, standings.sectionIDs, standings.rowIDs)}
           renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          renderRow={(flight, sectionID, rowID) => {
            ////console.log(match)
            return(
            <View>
              <TouchableHighlight onPress={ () => this.goToDetail(flight)} >
                <View style={styles.standingContainer}>
                    <View style={styles.flightContainer}>
                      <Text style={styles.flightText}>{flight.flightName}</Text>
                    </View>
                    <View style={styles.matchIcon}>

                    </View>
                </View>
              </TouchableHighlight>
            </View>
          );
          }}
          renderSectionHeader={(sectionData, sectionID) =>
            <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{sectionID}</Text>
            </View>

          }
        />
      } else {
        list = <Text style={{textAlign: 'center',
        padding: 16,
        fontSize: 16}}>No teams on record for {this.props.fetchedMatches.matches.userData.playerName}</Text>;
      }
    }


    return (
      <Container>
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.openDrawer()}>
                <Icon name="ios-menu" />
              </Button>
            </Left>
            <Body>
              <Title>Standings</Title>
            </Body>
            <Right/>

          </Header>

          {fetching && <ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" />}
          {!fetching && list}

          <AdMobBanner
            adSize="smartBannerPortrait"
            adUnitID={AdMobConfig.getAdUnitID(0)}
            testDevices={[AdMobBanner.simulatorId]}
            onAdFailedToLoad={error => console.log(error)}
            style={{alignSelf:'center'}}
          />

        </Container>
    )
  }
}

const styles = StyleSheet.create(
  standingsListStyles

);

function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches
  };
}
export default connect(mapStateToProps, null)(StandingsList);
