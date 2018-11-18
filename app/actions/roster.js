import * as types from './types'
import Api from '../lib/api'
import Tennislink from '../lib/tennislink'
import Parser from '../lib/parser'
import { DOMParser } from 'xmldom'
import async from 'async'

export function fetchRoster(teamId, matchId) {

  return (dispatch, getState) => {
    dispatch(requestRoster());

    let parser = new DOMParser();
    let output = {roster: {}, teamId};
    Api.get(`<API_ENDPOINT>?iTeamID=${encodeURIComponent(teamId)}`).then(resp => {

      let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');

      let players = doc.getElementsByTagName('player');
      for(let i=0; i<players.length; ++i) {
        let ustaNum = players[i].getElementsByTagName('ustanum')[0].childNodes[0].nodeValue;
        let name = players[i].getElementsByTagName('name')[0].childNodes[0].nodeValue;
        let wins = players[i].getElementsByTagName('wins')[0].childNodes[0].nodeValue;
        let losses = players[i].getElementsByTagName('losses')[0].childNodes[0].nodeValue;
        let ntrp = players[i].getElementsByTagName('ntrprating')[0].childNodes[0].nodeValue;

        output.roster[ustaNum] = {name, wins, losses, ntrp};
      }
      dispatch(receiveRoster(output));
    }).catch( (ex) => {
      console.log(ex);

    });

  }
}
export function requestRoster() {
  return {
    type: types.REQUEST_ROSTER,

  }
}
export function receiveRoster(output) {
  return {
    type: types.RECEIVE_ROSTER,
    output,
  }
}
