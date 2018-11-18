import React, { Component } from 'react'

import {
   View,
   Text,
   TextInput,
   StyleSheet,
   Platform,
   Linking
} from 'react-native'

import { Text as NBText, Button, Container, Header, Content, Form, Item, Input, Label } from 'native-base';
import { Colors } from "../../Themes";

class LoginBox extends Component {
  constructor(props) {
   super(props);
   this.state = {ustaNumber: '', emailAddress: '', errorMsg: ''};
 }

 componentWillReceiveProps(nextProps) {

   if(nextProps.errorMsg != '') {
     this.setState({errorMsg: nextProps.errorMsg})
   }
 }

 validateEmail = () => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(re.test(String(this.state.emailAddress).toLowerCase())) {
      this.props.submit(this.state.ustaNumber, this.state.emailAddress)
    } else {
      this.setState({errorMsg: 'Invalid email address. Try again.'})
    }

 }

  render() {
     return (
        <View style = {styles.container}>

            <Text style={styles.headerText}>Use your USTA Number to log into your account.</Text>

            <Form>
              <Item stackedLabel>
                <Label>USTA Number</Label>
                <Input
                  style={{fontSize: 24}}
                  keyboardType="numeric"
                  onChangeText = {(text) =>
                    this.setState({ustaNumber: text})
                  } />
              </Item>
              <Item stackedLabel last>
                <Label>Email Address</Label>
                <Input
                  style={{fontSize: 24}}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  onChangeText = {(text) =>
                    this.setState({emailAddress: text})
                  } />
              </Item>
            </Form>

             <Text style={styles.errorText}>{this.state.errorMsg}</Text>

             <View style={styles.submitContainer}>
               <View style={styles.submitBtnCtnr}>
                 <Button rounded block disabled={this.state.ustaNumber.length == 0 || this.state.emailAddress.length == 0} onPress={this.validateEmail} >
                   <NBText style={styles.btnText}>LOG IN</NBText>
                 </Button>
              </View>
             </View>
             <Text style={styles.footerText} onPress={() => Linking.openURL('https://www.usta.com/en/home/search-profile/searchprofile.html?redirecturl=http%3a%2f%2ftennislink.usta.com%2fDashboard%2fMain%2fLogin.aspx')}>Forgot USTA number?</Text>

        </View>
     )
  }
}
export default LoginBox
const styles = StyleSheet.create ({
   container: {
     flex: 1,
      flexDirection: 'column',

   },
   headerText: {
    marginTop: 16,
    marginHorizontal: 8,
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold'
   },
   errorText: {
     marginLeft: 16,
     marginTop: 16,
     color: 'red'
   },
   footerText: {
     marginLeft: 16,
     marginTop: 16,
     color: Colors.linkText
   },
   input: {
      fontSize: 24,
      marginLeft: 16,
      marginTop: 16

   },
   submitContainer: {
     marginTop: 16,
     justifyContent: 'center',
     alignItems: 'center',

   },
   submitBtnCtnr: {
     width: '75%'
   },


})
