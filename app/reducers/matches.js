import createReducer from '../lib/createReducer'
import * as types from '../actions/types'

//name of state is fetchedMatches
export const fetchedMatches = createReducer({ isFetching: true}, {
  //(previousState, action) => newState
  [types.REQUEST_MATCHES](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_MATCHES](state, action) {

    return Object.assign({}, state, {
            isFetching: false,
            matches: action.matches,
            //teams: action.teams
          })
  },
  [types.UPDATE_UNUSED_TEAMS_SUCCESS](state, action) {

    return {
      ...state,
      matches: {
        ...state.matches,
        userData: {
          ...state.matches.userData,
          unusedTeams: action.unusedTeams
        }
      }
    }
  },

});

export const teams = createReducer({}, {
  [types.SET_FETCHED_TEAMS](state, action) {

    return action.teams;
  }
});



//Detail Views
export const fetchedScores = createReducer({isFetching: true}, {
  [types.REQUEST_SCORES](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_SCORES](state, action) {

    return {
        ...state,
        [action.scores.matchId]: action.scores,
        isFetching: false

      }
  },
});


export const fetchedStandings = createReducer({isFetching: true}, {
  [types.REQUEST_STANDINGS](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_STANDINGS](state, action) {

    return {
        ...state,
        [action.standings.flightId]: action.standings,
        isFetching: false

      }
  },
});

export const fetchedPlayers = createReducer({isFetching: true}, {
  [types.REQUEST_PLAYER](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_PLAYER](state, action) {

    return {
        ...state,
        [action.player.ustaNum]: action.player,
        isFetching: false

      }
  },
});

export const fetchedLineups = createReducer({isFetching: false, error: null, updated: null}, {
  [types.REQUEST_LINEUP](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_LINEUP](state, action) {
    return {
        ...state,
        [action.output.lineup.match_id]: action.output,
        isFetching: false

      }
  },
  [types.POST_NEW_LINEUP](state, action) {
    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.POST_NEW_LINEUP_SUCCESS](state, action) {
    return {
        ...state,
        [action.lineup.match_id]: {
          ...state[action.lineup.match_id],
          lineup: action.lineup
        },
        isFetching: false,
        error: null,
        updated: true

      }
  },
  [types.POST_NEW_LINEUP_DONE](state, action) {

    return Object.assign({}, state, {
            updated: null
          })
  },
  [types.POST_NEW_LINEUP_FAILURE](state, action) {

    return Object.assign({}, state, {
            isFetching: false,
            error: true
          })
  },
  [types.UPDATE_MATCH_STATUS](state, action) {
    return {
        ...state,
        [action.data.match_id]: {
          ...state[action.data.match_id],
          status: {
            ...state[action.data.match_id].status,
            [action.data.player_id]: {
              name: action.data.name,
              status: action.data.avail
            }

          }
        },
        isFetching: false

      }
  },
  [types.UPDATE_MATCH_STATUS_FAILURE](state, action) {

    return Object.assign({}, state, {
            isFetching: false,
            error: true
          })
  },
});
export const localLineup = createReducer({}, {
  [types.CREATE_LOCAL_LINEUP](state, action) {
    if(action.lineup.created) {
      return {
        updated: false,
        lineup: action.lineup
      }
    } else {
      return {
          updated: false,
          lineup: {
            created: true,
            published: false,
            match_id: action.lineup.match_id,
            positions: {
              "1 Singles": {
                selected: false
              },
              "2 Singles": {
                selected: false
              },
              "1 Doubles": {
                selected: false
              },
              "2 Doubles": {
                selected: false
              },
              "3 Doubles": {
                selected: false
              }
            }
          }
        }
    }
  },
  [types.UPDATE_LOCAL_LINEUP](state, action) {
      return {
          updated: true,
          lineup: {
            created: true,
            match_id: action.position.matchId,
            positions: {
              ...state.lineup.positions,
              [action.position.pos]: {
                ...state.lineup.positions[action.position.pos],
                selected: true,
                [action.position.playerNum]: {
                  name: action.position.name,
                  ustaNum: action.position.ustaNum
                }
              }
            }
          }

        }
  }
});

export const fetchedLogin = createReducer({}, {
  //(previousState, action) => newState
  [types.LOG_IN_PLAYER](state, action) {

    return action.data;
  }
});

export const captainTeams = createReducer({isFetching: false, error: null, created: null}, {
  [types.CAPTAIN_TEAMS](state, action) {
    return {
        ...state,
        teams: action.teams,
        isFetching: false

      }
  },
  [types.SUBSCRIBE_CAPTAIN](state, action) {
    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.SUBSCRIBE_CAPTAIN_SUCCESS](state, action) {
    return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamID]: true
        },
        isFetching: false,
        error: null,
        created: true

      }
  },
  [types.SUBSCRIBE_CAPTAIN_FAILURE](state, action) {

    return Object.assign({}, state, {
            isFetching: false,
            error: true
          })
  },
  [types.SUBSCRIBE_CAPTAIN_DONE](state, action) {

    return Object.assign({}, state, {
            created: null
          })
  },
});

export const roster = createReducer({isFetching: true, teams: {}}, {

  [types.REQUEST_ROSTER](state, action) {

    return Object.assign({}, state, {
            isFetching: true,

          })
  },
  [types.RECEIVE_ROSTER](state, action) {


    return {
        ...state,
        teams: {
          ...state.teams,
          [action.output.teamId]: action.output.roster

        },
        isFetching: false

      }
  },
});

export const activatedTeams = createReducer({}, {
  [types.ACTIVATED_TEAMS](state, action) {

    return action.teams;
  }
});

export const userScheduleStatus = createReducer({}, {
  [types.USER_SCHEDULE_STATUS](state, action) {

    return action.status;
  },
  [types.UPDATE_USER_SCHEDULE_STATUS](state, action) {
    return {
      ...state,
      [action.data.match_id]: action.data.avail
    }
  }
});

export const playerSubscriptions = createReducer({isFetching: true, error: null, errorMsg: null, teams: null, created: null}, {

  [types.RECEIVE_SUBSCRIPTIONS](state, action) {

    return {
        ...state,
        teams: action.teams,
        isFetching: false

      }
  },
  [types.REQUEST_SUBSCRIPTIONS](state, action) {

    return Object.assign({}, state, {
            isFetching: true,
          })
  },
  [types.SUBSCRIBE_PLAYER_SUCCESS](state, action) {

    return {
        ...state,
        teams: {
          ...state.teams,
          [action.teamID]: true
        },
        isFetching: false,
        error: null,
        created: true
      }
  },
  [types.SUBSCRIBE_PLAYER_FAILURE](state, action) {

    return Object.assign({}, state, {
            isFetching: false,
            error: true,
            errorMsg: action.msg
          })
  },
  [types.SUBSCRIBE_PLAYER_DONE](state, action) {

    return Object.assign({}, state, {
            created: null
          })
  },
});
/*
export const scheduleMap = createReducer({}, {

  [types.SCHEDULE_MAP](state, action) {

    return {
        ...state,
        scheduleMap: action.scheduleMap

      }
  }
});
*/
