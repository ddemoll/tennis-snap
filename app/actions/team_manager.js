import * as types from './types'
import Api from '../lib/api'
import async from 'async'

export function activateTeam(data) {

  return (dispatch, getState) => {

    dispatch(subscribeCaptain());

    async.parallel([
        function(callback) {
          Api.post('<API_ENDPOINT>', data).then(resp => {
            callback();
          }).catch( (ex) => {
            callback(ex)

          });
        },
        function(callback) {
          let data2 = {
            isCaptain: true,
            teamID: data.teamID,
            ustaNum: data.ustaNum
          }
          Api.post('<API_ENDPOINT>', data2).then(resp => {
            callback();
          }).catch( (ex) => {
            callback(ex)

          });
        }
      ], function(err) {
          if (err) {
            console.log(err);
            dispatch(subscribeFailure());
          } else {
            dispatch(updateCaptainTeams({teamID: data.teamID}))
            //decrement unused team count
            dispatch(updateUnusedTeamsSuccess({unusedTeams: getState().fetchedMatches.matches.userData.unusedTeams-1}));
          }

      });



  }

}

export function subscribeCaptain() {
  return {
    type: types.SUBSCRIBE_CAPTAIN,

  }
}
export function updateCaptainTeams({teamID}) {
  return {
    type: types.SUBSCRIBE_CAPTAIN_SUCCESS,
    teamID,
  }
}
export function subscribeCaptainDone() {
  return {
    type: types.SUBSCRIBE_CAPTAIN_DONE,

  }
}

export function subscribeFailure() {
  return {
    type: types.SUBSCRIBE_CAPTAIN_FAILURE,
  }
}


export function setCaptainTeams(teams) {
  return {
    type: types.CAPTAIN_TEAMS,
    teams,
  }
}
export function updateUnusedTeamsSuccess({unusedTeams}) {
  return {
    type: types.UPDATE_UNUSED_TEAMS_SUCCESS,
    unusedTeams,
  }
}
