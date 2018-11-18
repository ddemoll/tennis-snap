import * as types from './types'
import Api from '../lib/api'
import async from 'async'

//everything to do with dynamodb lineup and status tables
export function requestSubscription(data) {

  return (dispatch, getState) => {
    dispatch(subscribePlayer());

    async.parallel([
        function(callback) {
          Api.post('<API_ENDPOINT>', data).then(resp => {
            callback();
          }).catch( (ex) => {
            console.log(ex)
            callback(ex)

          });
        },
        function(callback) {
          let data2 = {
            isCaptain: false,
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

            dispatch(subscribeFailure({msg: null}));
          } else {
            dispatch(updatePlayerTeams({teamID: data.teamID}));
          }

      });

  }
}

export function subscribePlayer() {
  return {
    type: types.SUBSCRIBE_PLAYER,

  }
}
export function updatePlayerTeams({teamID}) {
  return {
    type: types.SUBSCRIBE_PLAYER_SUCCESS,
    teamID,
  }
}
export function subscribeFailure({msg}) {
  return {
    type: types.SUBSCRIBE_PLAYER_FAILURE,
    msg
  }
}
export function subscribePlayerDone() {
  return {
    type: types.SUBSCRIBE_PLAYER_DONE,
  }
}
