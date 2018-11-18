import * as types from './types'
import Api from '../lib/api'
import async from 'async'
//everything to do with dynamodb lineup and status tables
export function fetchLineup(matchId) {

  return (dispatch, getState) => {
    dispatch(requestLineup());

    let output = {status: {}};
    async.parallel([
        function(callback) {
          Api.getAWS(`<API_ENDPOINT>/${matchId}`).then(resp => {
            output.lineup = resp;
            callback();
          }).catch( (ex) => {
            //console.log(ex);
          });
        },
        function(callback) {
          Api.getAWS(`<API_ENDPOINT>/${matchId}`).then(resp => {
            for(let p of resp.Items) {
              output.status[p.player_id] = {
                name: p.name,
                status: p.avail
              }
            }


            callback();
          }).catch( (ex) => {
            //console.log(ex);
          });
        }
      ], function(err) {
          if (err) throw err;

          dispatch(receiveLineup(output));
      });

  }
}
export function requestLineup() {
  return {
    type: types.REQUEST_LINEUP,

  }
}
export function receiveLineup(output) {
  return {
    type: types.RECEIVE_LINEUP,
    output,
  }
}
export function createLocalLineup(lineup) {
  return {
    type: types.CREATE_LOCAL_LINEUP,
    lineup
  }
}
export function updateLocalLineup(position) {
  return {
    type: types.UPDATE_LOCAL_LINEUP,
    position
  }
}

export function postLineup(data) {

  return (dispatch, getState) => {
    dispatch(postNewLineup());

    let newLineup = {...getState().localLineup.lineup, team_id: data.db.teamId, published: data.db.published};

    let awsPayload = {
      dbPayload: newLineup
    }
    if(data.db.published) {
      console.log(data.notification)
      awsPayload['notification'] = data.notification
    }
    console.log(JSON.stringify(awsPayload))
    Api.post('/lineup', awsPayload).then(resp => {
      dispatch(postNewLineupSuccess(newLineup));
    }).catch( (ex) => {
      console.log(ex)
      dispatch(postNewLineupFailure());

    });
  }
}

export function postNewLineup() {
  return {
    type: types.POST_NEW_LINEUP,

  }
}
export function postNewLineupSuccess(lineup) {
  return {
    type: types.POST_NEW_LINEUP_SUCCESS,
    lineup,
  }
}
export function postNewLineupDone() {
  return {
    type: types.POST_NEW_LINEUP_DONE,

  }
}
export function postNewLineupFailure() {
  return {
    type: types.POST_NEW_LINEUP_FAILURE
  }
}
export function postStatus(data) {

  return (dispatch, getState) => {
    Api.post('/status', data);
    dispatch(updateMatchStatus(data));
    dispatch(updateUserScheduleStatus(data));
  }
}
export function updateMatchStatus(data) {
  return {
    type: types.UPDATE_MATCH_STATUS,
    data,
  }
}
export function updateUserScheduleStatus(data) {
  return {
    type: types.UPDATE_USER_SCHEDULE_STATUS,
    data,
  }
}
