import * as types from './types'
import Api from '../lib/api'
import Tennislink from '../lib/tennislink'
import Parser from '../lib/parser'
import { DOMParser } from 'xmldom'
import async from 'async'

//scores
export function fetchStandings(flightId, subflightId) {

  function compare(a, b) {
    if (a < b) {
        return -1;
    } else if (a > b) {
        return 1;
    }
    return 0;
  }

  return (dispatch, getState) => {
    dispatch(requestStandings());
    let output = {flightId, teams: []};
    let parser = new DOMParser();

    Api.get(`<API_ENDPOINT>?iFlightID=${encodeURIComponent(flightId)}&iSub_FlightID=${encodeURIComponent(subflightId)}`).then(resp => {

      let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');


      let teams = doc.getElementsByTagName('team');
      for(let i=0; i<teams.length; ++i) {

        let teamId = teams[i].getElementsByTagName('teamid')[0].childNodes[0].nodeValue;
        let wins = teams[i].getElementsByTagName('wins')[0].childNodes[0].nodeValue;
        let losses = teams[i].getElementsByTagName('losses')[0].childNodes[0].nodeValue;
        let indwins = teams[i].getElementsByTagName('individualwins')[0].childNodes[0].nodeValue;
        let indlosses = teams[i].getElementsByTagName('individuallosses')[0].childNodes[0].nodeValue;
        let setslost = teams[i].getElementsByTagName('teamsetslost')[0].childNodes[0].nodeValue;
        let gameslost = teams[i].getElementsByTagName('teamgameslost')[0].childNodes[0].nodeValue;


        output.teams.push({
          teamId, teamName: "", wins, losses, indwins, indlosses, setslost, gameslost, tiebreaker: "0"
        });
      }
      output.teams.sort((a, b) => {
        let c;
        c = compare(parseInt(b.wins), parseInt(a.wins));
        if(c === 0) {
          c = compare(parseInt(b.indwins), parseInt(a.indwins));
          b.tiebreaker = "indwins";
          a.tiebreaker = "indwins";
        } if(c === 0) {
          c = compare(parseInt(a.setslost), parseInt(b.setslost));
          b.tiebreaker = "setslost";
          a.tiebreaker = "setslost";
        }if(c === 0) {
          c = compare(parseInt(a.gameslost), parseInt(b.gameslost));
          b.tiebreaker = "gameslost";
          a.tiebreaker = "gameslost";
        }
        return c;
      });

      dispatch(receiveStandings({standings: output}));

    }).catch( (ex) => {
      //console.log(ex);

    });

  }
}
export function requestStandings() {
  return {
    type: types.REQUEST_STANDINGS,

  }
}
export function receiveStandings({ standings }) {
  return {
    type: types.RECEIVE_STANDINGS,
    standings,
  }
}
