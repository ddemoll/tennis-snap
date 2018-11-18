import * as types from './types'
import Api from '../lib/api'
import Tennislink from '../lib/tennislink'
import Parser from '../lib/parser'
import { DOMParser } from 'xmldom'
import async from 'async'

//scores
export function fetchScores(matchId, userTeamId, opponentTeamId) {

  return (dispatch, getState) => {
    dispatch(requestScores())
    let output = {scoresReported: true, matchId, matchScores: []};
    let parser = new DOMParser();
    Api.get(`<API_ENDPOINT>?iMatchID=${encodeURIComponent(matchId)}`).then(resp => {

      let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');


      let scores = doc.getElementsByTagName('score');
      let totalDoubleDefaults = 0;
      for(let i=0; i<scores.length; i+=2) {
        let score = "";
        let matchFormat = scores[i].getElementsByTagName('MatchFormat')[0].childNodes[0].nodeValue;
        let position = scores[i].getElementsByTagName('Num')[0].childNodes[0].nodeValue;

        let winningTeam = scores[i].getElementsByTagName('winningteam')[0];
        let winningTeamId = winningTeam.getElementsByTagName('teamid')[0].childNodes[0].nodeValue;
        let losingTeam = scores[i].getElementsByTagName('losingteam')[0];
        let losingTeamId = losingTeam.getElementsByTagName('teamid')[0].childNodes[0].nodeValue;

        let winningPlayer1, winningPlayer1USTANumber, winningPlayer1Name, winningPlayer2, winningPlayer2USTANumber, winningPlayer2Name;
        let losingPlayer1, losingPlayer1USTANumber, losingPlayer1Name, losingPlayer2, losingPlayer2USTANumber, losingPlayer2Name;

        let status = scores[i].getElementsByTagName('status')[0].childNodes[0].nodeValue;
        if(status === "4") {
          //double default
          totalDoubleDefaults++;
          score = "0,0,0,0";
          winningPlayer1Name = winningPlayer1USTANumber = winningPlayer2Name = winningPlayer2USTANumber = losingPlayer1Name = losingPlayer1USTANumber = losingPlayer2Name = losingPlayer2USTANumber = "0";
        } else {
          score = scores[i].getElementsByTagName('score')[0].childNodes[0].nodeValue

          winningPlayer1 = scores[i].getElementsByTagName('winningplayer1')[0];
          winningPlayer1USTANumber = winningPlayer1.getElementsByTagName('ustanum')[0].childNodes[0].nodeValue;
          winningPlayer1Name = winningPlayer1.getElementsByTagName('name')[0].childNodes[0].nodeValue;
          winningPlayer2 = scores[i].getElementsByTagName('winningplayer2')[0];
          winningPlayer2USTANumber = winningPlayer2.getElementsByTagName('ustanum')[0].childNodes[0].nodeValue;
          winningPlayer2Name = winningPlayer2.getElementsByTagName('name')[0].childNodes[0];
          winningPlayer2Name = Parser.assignValue(winningPlayer2Name);


          losingPlayer1 = scores[i].getElementsByTagName('losingplayer1')[0];
          losingPlayer1USTANumber = losingPlayer1.getElementsByTagName('ustanum')[0].childNodes[0].nodeValue;
          losingPlayer1Name = losingPlayer1.getElementsByTagName('name')[0].childNodes[0];
          losingPlayer1Name = Parser.assignValue(losingPlayer1Name);
          losingPlayer2 = scores[i].getElementsByTagName('losingplayer2')[0];
          losingPlayer2USTANumber = losingPlayer2.getElementsByTagName('ustanum')[0].childNodes[0].nodeValue;
          losingPlayer2Name = losingPlayer2.getElementsByTagName('name')[0].childNodes[0];
          losingPlayer2Name = Parser.assignValue(losingPlayer2Name);
        }
        if(totalDoubleDefaults === scores.length/2) output.scoresReported = false;
        output.matchScores.push({
          score, status, matchFormat, position, winningTeamId, winningPlayer1USTANumber,
          winningPlayer1Name, winningPlayer2USTANumber, winningPlayer2Name, losingTeamId,
          losingPlayer1USTANumber, losingPlayer1Name, losingPlayer2USTANumber, losingPlayer2Name
        });
      }
      dispatch(receiveScores({scores: output}))
      //dispatch(setFetchedScores({scores: output}));

    }).catch( (ex) => {
      //console.log(ex);

    });

  }
}
export function requestScores() {
  return {
    type: types.REQUEST_SCORES,

  }
}
export function receiveScores({ scores }) {
  return {
    type: types.RECEIVE_SCORES,
    scores,
  }
}
