import * as types from './types'
import Api from '../lib/api'

export function buyCaptainTeams(data) {

  return (dispatch, getState) => {
    dispatch(buyTeams());

    Api.post('<API_ENDPOINT>', data).then(resp => {
      dispatch(updateUnusedTeamsSuccess({unusedTeams: resp.unusedTeams}));
    }).catch( (ex) => {
      console.log(ex)
      dispatch(updateUnusedTeamsFailure());
    });

  }
}

export function buyTeams() {
  return {
    type: types.BUY_TEAMS,

  }
}
export function updateUnusedTeamsSuccess({unusedTeams}) {
  return {
    type: types.UPDATE_UNUSED_TEAMS_SUCCESS,
    unusedTeams,
  }
}
export function updateUnusedTeamsFailure() {
  return {
    type: types.UPDATE_UNUSED_TEAMS_FAILURE,
  }
}
