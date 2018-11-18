import React from "react";
import { createDrawerNavigator, createStackNavigator } from "react-navigation";

import DrawerContent from "../containers/DrawerContent";

import WelcomePage from '../components/login/WelcomePage'
import RolePage from '../components/login/RolePage'
import Login from '../containers/Login'
import ActivateTeamsPage from '../containers/ActivateTeamsPage'

import ScheduleList from '../containers/ScheduleList'
import ScheduleDetail from '../containers/ScheduleDetail'
import FeaturePage from '../containers/FeaturePage'

import ResultList from '../containers/ResultList'
import ResultDetail from '../containers/ResultDetail'
import StandingsList from '../containers/StandingsList'
import StandingsDetail from '../containers/StandingsDetail'
import PlayerDetail from '../containers/PlayerDetail'
import User from '../containers/User'
import TeamManager from '../containers/TeamManager'
import LineupEditor from '../containers/LineupEditor'
import PositionSelector from '../components/PositionSelector'



const LoginNav = createStackNavigator(
	{
		Welcome: { screen: WelcomePage },
		Role: { screen: RolePage },
		Login: { screen: Login },
		ActivateTeamsPage: {
			screen: ActivateTeamsPage,
			navigationOptions: {
        gesturesEnabled: false,
    	}
		},
		FeaturePage: { screen: FeaturePage },
	},
	{
		initialRouteName: "Welcome",
		headerMode: "none",
	}
);
LoginNav.navigationOptions = ({ navigation }) => {
  return {
    drawerLockMode: 'locked-closed',
  };
};

const ScheduleNav = createStackNavigator(
	{
		ScheduleList: { screen: ScheduleList },
		ScheduleDetail: { screen: ScheduleDetail },
		FeaturePage: { screen: FeaturePage },
		StandingsDetail: { screen: StandingsDetail },
		LineupEditor: { screen: LineupEditor },
		PositionSelector: { screen: PositionSelector },
		PlayerDetail: { screen: PlayerDetail },
	},
	{
		initialRouteName: "ScheduleList",
		headerMode: "none",
	}
);
ScheduleNav.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};


const ResultNav = createStackNavigator(
	{
		ResultList: { screen: ResultList },
		ResultDetail: { screen: ResultDetail },
		PlayerDetail: { screen: PlayerDetail },
		StandingsDetail: { screen: StandingsDetail },
	},
	{
		initialRouteName: "ResultList",
		headerMode: "none",
	}
);
ResultNav.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const StandingsNav = createStackNavigator(
	{
		StandingsList: { screen: StandingsList },
		StandingsDetail: { screen: StandingsDetail },
	},
	{
		initialRouteName: "StandingsList",
		headerMode: "none",
	}
);
StandingsNav.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const UserNav = createStackNavigator(
	{
		User: { screen: User },
		FeaturePage: { screen: FeaturePage },
	},
	{
		initialRouteName: "User",
		headerMode: "none",
	}
);
UserNav.navigationOptions = ({ navigation }) => {
  let drawerLockMode = 'unlocked';
  if (navigation.state.index > 0) {
    drawerLockMode = 'locked-closed';
  }

  return {
    drawerLockMode,
  };
};

const NavigationDrawer = createDrawerNavigator({

		Schedule: { screen: ScheduleNav },
		Results: { screen: ResultNav },
		Standings: { screen: StandingsNav },

		LoginNav: { screen: LoginNav },
		UserNav: { screen: UserNav },
		//TeamManager: { screen: TeamManager },

	},
	{

		contentComponent: props => <DrawerContent {...props} />,
	}
);



export default NavigationDrawer;
