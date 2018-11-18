import * as types from './types'
import Api from '../lib/api'
import Tennislink from '../lib/tennislink'
import Parser from '../lib/parser'
import { DOMParser } from 'xmldom'
import async from 'async'

//scores
export function fetchPlayer(playerName, ustaNum, year) {

  return (dispatch, getState) => {
    dispatch(requestPlayer())

    let output = {playerName, ustaNum, year, matches: []};

    async.parallel([
        function(callback) {
          let parser = new DOMParser();
          Api.get(`<API_ENDPOINT>?iustaMemberNum=${encodeURIComponent(ustaNum)}&iYear=${encodeURIComponent(year)}`).then(resp => {

            let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');

            let totalDoubleDefaults = 0;
            let matches = doc.getElementsByTagName('match');

            for(let i=0; i<matches.length; ++i) {
              let matchDate = matches[i].getElementsByTagName('date')[0].childNodes[0].nodeValue;
              let matchDate2 = matchDate.slice(0, matchDate.indexOf(" "));
              let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
              let date = new Date(matchDate2);
              let dateString = `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;

              let position = matches[i].getElementsByTagName('positionid')[0].childNodes[0].nodeValue.slice(1);
              let isSingles = matches[i].getElementsByTagName('issinglesmatch')[0].childNodes[0].nodeValue;
              let playerDQ = matches[i].getElementsByTagName('playerdq')[0].childNodes[0].nodeValue;
              let status = matches[i].getElementsByTagName('matchresult')[0].childNodes[0].nodeValue;

              //optionals
              let parterUstaNum = "0", partnerName = "0", partnerDQ = "0";
              let opponent1UstaNum = "0", opponent1Name = "0", opponent1DQ = "0", opponent2UstaNum = "0", opponent2Name = "0", opponent2DQ = "0";
              if(isSingles === "False") {
                parterUstaNum = matches[i].getElementsByTagName('playerpartnerid')[0].childNodes[0].nodeValue.trim();
                partnerName = matches[i].getElementsByTagName('playerpartnername')[0].childNodes[0].nodeValue;
                partnerDQ = matches[i].getElementsByTagName('playerpartnerdq')[0].childNodes[0].nodeValue;
              }

              //not default

              let opponents = matches[i].getElementsByTagName('opponent');

              opponent1Name = opponents[0].getElementsByTagName('opponentplayername')[0].childNodes[0].nodeValue;
              if(opponent1Name === "Default") {
                //0 === default
                opponent1Name = "0";
              } else {
                opponent1UstaNum = opponents[0].getElementsByTagName('opponentplayerid')[0].childNodes[0].nodeValue.trim();
                opponent1DQ = opponents[0].getElementsByTagName('opponentplayerdq');

                if(opponent1DQ.length > 0) {
                  opponent1DQ = opponent1DQ[0].childNodes[0].nodeValue;
                } else {
                  opponent1DQ = opponents[0].getElementsByTagName('playerdq');
                  if(opponent1DQ.length > 0) {
                    opponent1DQ = opponent1DQ[0].childNodes[0].nodeValue;
                  }
                }

                if(isSingles === "False") {

                  opponent2UstaNum = opponents[1].getElementsByTagName('opponentplayerid')[0].childNodes[0].nodeValue.trim();
                  opponent2Name = opponents[1].getElementsByTagName('opponentplayername')[0].childNodes[0].nodeValue;
                  opponent2DQ = opponents[1].getElementsByTagName('opponentplayerdq')[0].childNodes[0].nodeValue;

                }
              }

              let winLossIndicator = matches[i].getElementsByTagName('winlossindicator')[0].childNodes[0].nodeValue;
              let set1GamesWon = Parser.assignValue(matches[i].getElementsByTagName('setonegameswon')[0].childNodes[0]).trim();
              let set1GamesLost = Parser.assignValue(matches[i].getElementsByTagName('setonegameslost')[0].childNodes[0]).trim();
              let set2GamesWon = Parser.assignValue(matches[i].getElementsByTagName('settwogameswon')[0].childNodes[0]).trim();
              let set2GamesLost = Parser.assignValue(matches[i].getElementsByTagName('settwogameslost')[0].childNodes[0]).trim();
              let set3GamesWon = Parser.assignValue(matches[i].getElementsByTagName('setthreegameswon')[0].childNodes[0]).trim();
              let set3GamesLost = Parser.assignValue(matches[i].getElementsByTagName('setthreegameslost')[0].childNodes[0]).trim();



              output.matches.push({
                matchDate, dateString, position, isSingles, playerDQ, parterUstaNum, partnerName,
                partnerDQ, opponent1UstaNum, opponent1Name, opponent1DQ,
                opponent2UstaNum, opponent2Name, opponent2DQ, winLossIndicator,
                set1GamesWon, set1GamesLost, set2GamesWon, set2GamesLost, set3GamesWon, set3GamesLost,
              });
            }

            callback();

          }).catch( (ex) => {
            callback(ex);

          });
        },
        function(callback) {
          Api.get(`<API_ENDPOINT>?iustaMemberNum=${encodeURIComponent(ustaNum)}&iYear=${encodeURIComponent(year)}`).then(resp => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');


            output['city'] = doc.getElementsByTagName('city')[0].childNodes[0].nodeValue;
            output['state'] = doc.getElementsByTagName('state')[0].childNodes[0].nodeValue;
            output['ntrp'] = doc.getElementsByTagName('ntrp')[0].childNodes[0].nodeValue;
            output['wins'] = doc.getElementsByTagName('wins')[0].childNodes[0].nodeValue;
            output['losses'] = doc.getElementsByTagName('losses')[0].childNodes[0].nodeValue;
            output['ties'] = doc.getElementsByTagName('ties')[0].childNodes[0].nodeValue;

            callback();

          })
          .catch( (ex) => {
            callback(ex);

          })
        }
      ], function(err) {
          if (err) {

            callback(err)
          } else {
            dispatch(receivePlayer({player: output}))
          }

      });





  }
}
export function requestPlayer() {
  return {
    type: types.REQUEST_PLAYER,

  }
}
export function receivePlayer({ player }) {
  return {
    type: types.RECEIVE_PLAYER,
    player,
  }
}
