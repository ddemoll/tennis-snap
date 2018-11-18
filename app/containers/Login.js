import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactNative from 'react-native';
import { ActionCreators } from '../actions';

import LoginBox from '../components/login/LoginBox'
const {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  AsyncStorage,
  Platform,
  ScrollView
} = ReactNative;

import { Text as NBText, Title, Subtitle, Container, Header, Left, Right, Body, Button, Icon } from 'native-base';
import { Images, Fonts, Colors } from "../Themes";

class Login extends Component {
  constructor() {
    super()
    this.signIn = this.signIn.bind(this);
    this.state = {
      errorMsg: ''
    };

   }

  componentWillReceiveProps(nextProps) {

    const {success, ustaNum, isCaptain, email} = nextProps.fetchedLogin

    if(success) {
      let isC = isCaptain ? "1" : "0";

      //log analytics to db and start free trial if this is the first login
      this.props.logUserSignIn(ustaNum, isCaptain, email)

      AsyncStorage.setItem('isLoggedIn', "1");
      AsyncStorage.setItem('ustaNum', ustaNum);


      AsyncStorage.setItem('isCaptain', isC).then(() => {
        if(isCaptain) {
          this.props.navigation.navigate('ActivateTeamsPage', {ustaNum})
        } else {
          this.props.navigation.navigate('ScheduleList', {shouldFetchMatches: true})
        }
      }).done();


    } else {
      this.setState({errorMsg: "Invalid USTA number. Try again."})
    }
  }
  signIn(ustaNum, email) {

    const {title} = this.props.navigation.state.params;
    if(title === "Player") {
      this.props.login(ustaNum, false, email);
    } else if(title === "Captain") {
      this.props.login(ustaNum, true, email);
    }
  }

  render() {
    const {title} = this.props.navigation.state.params;

    return (
      <Container>
        <Header>
            <Left>
          <Button transparent onPress={() => this.props.navigation.goBack()}>
            <Icon name="arrow-back" />
          </Button>
        </Left>
          <Body style={{ flex: 3 }}>
            <Title>{title} Log In</Title>
          </Body>
          <Right/>
        </Header>
        <ScrollView style={styles.outerContainer} keyboardShouldPersistTaps="always">
          <KeyboardAvoidingView behavior="padding" >
          <LoginBox submit={this.signIn} errorMsg={this.state.errorMsg}/>
          </KeyboardAvoidingView>
        </ScrollView>
      </Container>


    );
  }
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 3,
    flexDirection: 'column',
    backgroundColor: Colors.ricePaper
  },
  questionsBtnCtnr: {
    flex: 1,
    marginLeft: 16
  }
});

function mapStateToProps(state) {
  return {
    fetchedLogin: state.fetchedLogin

  };
}
//actions
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
