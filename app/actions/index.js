import * as MatchActions from './matches'
import * as ScoreActions from './scores'
import * as StandingsActions from './standings'
import * as PlayerActions from './player'
import * as LoginActions from './login'
import * as LogoutActions from './logout'
import * as TeamManagerActions from './team_manager'
import * as RosterActions from './roster'
import * as LineupActions from './lineup'
import * as SubscribeActions from './subscribe'
import * as BuyTeamsActions from './buy_teams'

export const ActionCreators = Object.assign({},
  MatchActions,
  ScoreActions,
  StandingsActions,
  PlayerActions,
  LoginActions,
  LogoutActions,
  TeamManagerActions,
  RosterActions,
  LineupActions,
  SubscribeActions,
  BuyTeamsActions
);
