import React, { Component } from "react";
import { View, StatusBar, Platform, PushNotificationIOS, AsyncStorage } from "react-native";
//import ReduxNavigation from "../Navigation/ReduxNavigation";
import NavigationDrawer from "../Navigation/NavigationDrawer";
import { Root, StyleProvider } from "native-base";
import { connect } from 'react-redux'


import Amplify from 'aws-amplify';
import { PushNotification } from 'aws-amplify-react-native';
import aws_exports from '../aws-exports';

// PushNotification need to work with Analytics
Amplify.configure(aws_exports);
PushNotification.configure(aws_exports);

import NavigatorService from '../Services/Navigator';

// Styles
import styles from "./Styles/RootContainerStyles";

import getTheme from '../../native-base-theme/components';
import commonColor from '../../native-base-theme/variables/commonColor';

class RootContainer extends Component {

	componentDidMount() {

  		// get the notification data
  		PushNotification.onNotification((notification) => {
  			// Note that the notification object structure is different from Android and IOS
  			console.log('in app notification', notification);


  			// required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
  			if(Platform.OS === 'ios') {
  				notification.finish(PushNotificationIOS.FetchResult.NoData);
  			}

  		});

  		// get the registration token
  		PushNotification.onRegister((token) => {
  			console.log('in app registration', token);
				AsyncStorage.setItem('token', token);
  		});


  	}


	render() {
		return (
			<View style={styles.applicationView}>
				<StatusBar barStyle="light-content" />
				<Root>
				 <StyleProvider style={getTheme(commonColor)}>
				<NavigationDrawer
					ref={navigatorRef => {
	          NavigatorService.setContainer(navigatorRef);
	        }}
				/>
				</StyleProvider>
				</Root>

			</View>
		);
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
}

export default connect(null, mapDispatchToProps)(RootContainer)
