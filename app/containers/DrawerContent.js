import React, { Component } from "react";
import { ScrollView, Image, AsyncStorage } from "react-native";
import { List, ListItem, Text, View, Content } from "native-base";
import { connect } from "react-redux";
import { DrawerActions } from 'react-navigation';
//import LoginActions from "../Redux/LoginRedux";
import styles from "./Styles/DrawerContentStyles";
import { Images } from "../Themes";

class DrawerContent extends Component {

	render() {

		const navigation = this.props.navigation;
		const items = this.props.items;

		return (
			<View style={styles.container}>
				<View style={styles.header}>
    			<Image source={Images.logo} style={styles.logo} />
					<Text style={styles.logoTxt}>Tennis Snap</Text>
		    </View>

				<Content>
					<List>
						<ListItem onPress={() => {
							this.props.navigation.navigate('Schedule');
							this.props.navigation.dispatch(DrawerActions.closeDrawer());
						}}>
							<Text>Upcoming Matches</Text>
						</ListItem>
						<ListItem onPress={() => {
							this.props.navigation.navigate('Results');
							this.props.navigation.dispatch(DrawerActions.closeDrawer());
						}}>
							<Text>Results</Text>
						</ListItem>
						<ListItem onPress={() => {
							this.props.navigation.navigate('Standings');
							this.props.navigation.dispatch(DrawerActions.closeDrawer());
						}}>
							<Text>Standings</Text>
						</ListItem>
						<ListItem onPress={() => {
							this.props.navigation.navigate('User');
							this.props.navigation.dispatch(DrawerActions.closeDrawer());
						}}>
							<Text>My Account</Text>
						</ListItem>


					</List>
				</Content>
			</View>
		);
	}
}

const mapStateToProps = state => {
	return {
		fetchedMatches: state.fetchedMatches,

	};
};

export default connect(mapStateToProps, null)(DrawerContent);
