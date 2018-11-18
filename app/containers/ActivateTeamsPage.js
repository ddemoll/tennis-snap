import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactNative from 'react-native';
import { ActionCreators } from '../actions';

const {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  BackHandler
} = ReactNative;

import { Text as NBText, Title, Subtitle, Container, Content, Header, Left, Right, Body, Button } from 'native-base';
import { Images, Fonts, Colors } from "../Themes";

import UserTeamList from './UserTeamList'

class ActivateTeamsPage extends Component {


  componentWillReceiveProps(nextProps) {

    if(!nextProps.fetchedMatches.isFetching && nextProps.fetchedMatches.matches.userData.teamsInProgress == 0) {
      this.props.navigation.navigate('ScheduleList', {shouldFetchMatches: false})
    }
  }


  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', () => true);

    const {ustaNum} = this.props.navigation.state.params;

    this.props.fetchMatches(ustaNum, true);
  }
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', () => true);
  }

  render() {
    let content = false;
    let fetching = this.props.fetchedMatches.isFetching
    if(fetching) {
      content = <Content><ActivityIndicator style={{alignItems: 'center', justifyContent: 'center', padding: 8, height: 80}} size="large" /></Content>
    } else {
      content = <View style={styles.outerContainer}>
                  <Content>
                      <View style={styles.headerContainer}>
                        <Text style={{fontSize: 18, textAlign: 'center', marginHorizontal: 8, color: 'black'}}>Press Activate for each team you want to manage. Try your first team for free.</Text>
                      </View>

                      <UserTeamList ustaNum={this.props.fetchedMatches.matches.userData.ustaNum} navigate={this.props.navigation.navigate}/>

                  </Content>
                  <View style={styles.footerContainer}>
                    <View style={styles.footerBtnCtnr}>
                      <Button rounded block onPress={() => this.props.navigation.navigate('ScheduleList', {shouldFetchMatches: false})}>
                        <NBText>CONTINUE</NBText>
                      </Button>
                  </View>
                  </View>
              </View>





    }

    return (
      <Container>
        <Header>
            <Left/>
          <Body style={{ flex: 3 }}>
            <Title>My Teams</Title>
          </Body>
          <Right/>
        </Header>

        {content}
      </Container>


    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    flexDirection: 'column',

  },
  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20
  },
  footerContainer: {
    //flex: 1,
    marginVertical: 20,
    justifyContent: 'flex-end',
    alignItems: 'center',

  },
  footerBtnCtnr: {
    width: '75%',

  },


});

function mapStateToProps(state) {
  return {
    fetchedMatches: state.fetchedMatches

  };
}
//actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ActivateTeamsPage);
