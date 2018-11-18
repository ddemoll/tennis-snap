import * as types from './types'
import Api from '../lib/api'
import Parser from '../lib/parser'
import Tennislink from '../lib/tennislink'
import { DOMParser } from 'xmldom'
import async from 'async'

import React from 'react'
import {
  AsyncStorage,
  Platform
} from 'react-native'

export function fetchMatches(ustaNum, isCaptain) {
  //converts arr to format that can be read by ListViewDataSource with sections
  function convertArrToListDatablob(state, arr, sectionDelimiter, rowDelimiter) {
    let sectionIDs = [], rowIDs = [];
    let length = arr.length;
    let prevYear = arr[0][sectionDelimiter];
    sectionIDs.push(prevYear);
    //key == value
    //state.dataBlob[prevYear] = prevYear;
    rowIDs[0] = [];
    let sectionIndex = 0;
    for(let i=0; i<length; ++i) {
      let currentYear = arr[i][sectionDelimiter];
      if(prevYear !== currentYear) {
        prevYear = currentYear;
        sectionIDs.push(prevYear);
        sectionIndex++;
        rowIDs[sectionIndex] = [];
      }
      rowIDs[sectionIndex].push(i);
      state.dataBlob[prevYear+':'+i] = arr[i];
    }
    state.sectionIDs = sectionIDs;
    state.rowIDs = rowIDs;
  }

  let parser = new DOMParser();

  let teamMap = {};
  //teams user is the captain of
  let captainMap = {};
  //activated teams for player that have captain functionality
  let activatedMap = {};
  //teams the player is subscribed to
  let subscriptionMap = {};
  let userStatusMap = {};
  let resultsArr = [], scheduleArr = [], teamsForStandingsArr = [];
  //used by ScheduleDetail for find match info
  let scheduleMap = {};
  //used to check if teams are activated by a captain
  let dynamoTeams = [];
  let output = {userData: {playerName: '', ustaNum: '', ntrp: '', numTeams: 0, teamsInProgress: 0}, userTeams: {}, schedule: {dataBlob: {}}, results: {dataBlob: {}}, standings: {dataBlob: {}}};
  let i = 0;
  //get matches for team
  function lookUpTeam(team, callback) {

    var id = team.teamId, userTeamName = team.teamName;
    let opponentTeamIdsToFetch = [];
    var fetchedSubflight = false;
    let totalUnplayedMatches = 0;
    async.series([
        //Load user to get `userId` first
        function(callback2) {
          Api.get(`<API_ENDPOINT>?iTeamID=${encodeURIComponent(id)}`).then(resp => {
            let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');

            let teamName = doc.getElementsByTagName('teamname')[0].childNodes[0].nodeValue;
            let matches = doc.getElementsByTagName('match');
            //let matchArr = [];
            for(let i=0; i<matches.length; ++i) {
              //determine if match exists
              let opponentTeam = matches[i].getElementsByTagName('opponentteam')[0];
              let opponentTeamId = opponentTeam.getElementsByTagName('teamid')[0].childNodes[0].nodeValue;

              if(opponentTeamId !== "0") {

                let opponentTeamName = opponentTeam.getElementsByTagName('teamname')[0].childNodes[0].nodeValue;

                let matchId = matches[i].getElementsByTagName('matchid')[0].childNodes[0].nodeValue;

                let matchDate = matches[i].getElementsByTagName('matchdate')[0].childNodes[0].nodeValue;
                let matchDate2 = matchDate.slice(0, matchDate.indexOf(" "));
                let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                let date = new Date(matchDate2);
                let year = date.getFullYear();
                let month = months[date.getMonth()];
                let dateInMonth = date.getDate();
                let days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
                let day = days[date.getDay()];

                let time = matchDate.slice(matchDate.indexOf(" ")+1);
                let firstColon = time.indexOf(":"), secondColon = time.lastIndexOf(":");
                let suffix = time.slice(time.indexOf(" ")+1);
                let timeSplitter = time.slice(firstColon+1, firstColon+3) === "00" ? firstColon : secondColon;
                let time2 =  time.slice(0, timeSplitter);
                time = `${time2} ${suffix}`;

                //If facilityname is null default to teamname
                let facilityName = null;
                if(matches[i].getElementsByTagName('facilityname')[0].childNodes[0] != null) {
                  facilityName = matches[i].getElementsByTagName('facilityname')[0].childNodes[0].nodeValue;
                }

                let facilityAddress = null;
                if(matches[i].getElementsByTagName('facilityaddress')[0].childNodes[0] != null) {
                  facilityAddress = matches[i].getElementsByTagName('facilityaddress')[0].childNodes[0].nodeValue;
                }

                let totalHomeWin = matches[i].getElementsByTagName('totalhomewin')[0].childNodes[0].nodeValue;
                let totalHomeLost = matches[i].getElementsByTagName('totalhomelost')[0].childNodes[0].nodeValue;
                let isHome = matches[i].getElementsByTagName('homeind')[0].childNodes[0].nodeValue;
                let isCompleted = matches[i].getElementsByTagName('iscompleted')[0].childNodes[0].nodeValue;
                let homeTeamDidWin = matches[i].getElementsByTagName('HomeTeamMatchWon')[0].childNodes[0].nodeValue;

                //used to get price if exists
                let price = "", moneyIndex;
                if(isHome === "True") {
                  moneyIndex = userTeamName.indexOf("$");
                  price = moneyIndex === -1 ? 0 : userTeamName.slice(moneyIndex, moneyIndex+3);

                  //preload all facility names to display on results tab
                  //some teams may play each other mulitple times
                  teamMap[id] = {facilityName: facilityName || teamName};
                  opponentTeamIdsToFetch.push(opponentTeamId)

                } else {
                  let opponentTeamName = opponentTeam.getElementsByTagName('teamname')[0].childNodes[0].nodeValue;
                  moneyIndex = opponentTeamName.indexOf("$");

                  price = moneyIndex === -1 ? 0 : opponentTeamName.slice(moneyIndex, moneyIndex+3);

                  //some teams have no facilityName
                  teamMap[opponentTeamId] = {facilityName: facilityName || opponentTeamName};

                }
                ////console.log("after fetch")

                let data = {
                  userTeamId: id,
                  teamName,
                  opponentTeamName,
                  matchId,
                  //used for sorting
                  date,
                  year,
                  day,
                  month,
                  dateInMonth,
                  time,
                  dateString: matchDate,
                  facilityName,
                  facilityAddress,
                  totalHomeWin,
                  totalHomeLost,
                  isHome,
                  isCompleted,
                  opponentTeamId,
                  price,
                  homeTeamDidWin
                };
                if(isCompleted === "True") {

                  resultsArr.push(data);
                } else {
                  totalUnplayedMatches++;
                  scheduleArr.push(data);
                  //scheduleMap[matchId] = data;
                }
              }

            }
            output.userTeams[id].unplayedMatches = totalUnplayedMatches;
            if(totalUnplayedMatches > 0) {
              output.userData.teamsInProgress++;
            }
            callback2();

          }).catch( (ex) => {
            console.log(id, ex);
             callback2(ex);
          });
        },
        //get facility names that were not picked up at away matches
        function(callback3) {

          if(opponentTeamIdsToFetch.length > 0) {

            async.forEach(opponentTeamIdsToFetch, function(opponentTeamId, callback2) {

              if(teamMap[opponentTeamId] === undefined) {


                Tennislink.getTeamInfo(opponentTeamId).then(resp => {

                  teamMap[opponentTeamId] = {facilityName: resp.facilityname}

                  for(let i=0; i<teamsForStandingsArr.length && !fetchedSubflight; ++i) {
                    if(teamsForStandingsArr[i].teamId === id) {

                      teamsForStandingsArr[i].subflightId = resp.subflightid;
                      output.userTeams[id].subflightId = resp.subflightid;
                      teamsForStandingsArr[i].subflightName = resp.subflightname;
                      fetchedSubflight = true;
                    }
                  }
                  callback2();
                }).catch( (ex) => {

                  //console.log(ex, teamId);
                  return callback2(ex);
                })
              } else {
                callback2();

              }

            }, function(err) {
                if (err) {
                  //console.log(err);
                }
                callback3();

            });
          } else {
            //if for some reason team has zero home matches
            Tennislink.getTeamInfo(id).then(resp => {

              teamMap[id] = {facilityName: resp.facilityname}

              for(let i=0; i<teamsForStandingsArr.length && !fetchedSubflight; ++i) {
                if(teamsForStandingsArr[i].teamId === id) {
                  teamsForStandingsArr[i].subflightId = resp.subflightid;
                  output.userTeams[id].subflightId = resp.subflightid;
                  teamsForStandingsArr[i].subflightName = resp.subflightname;
                  fetchedSubflight = true;
                }
              }
              callback3();
            }).catch( (ex) => {

              //console.log(ex, teamId);
              return callback3(ex);
            })

          }

        },
        function(callback2) {
          //if subflight was not picked up in opponent team

          if(!fetchedSubflight || (isCaptain && (totalUnplayedMatches > 0))) {
            Tennislink.getTeamInfo(id).then(resp => {

              for(let i=0; i<teamsForStandingsArr.length && !fetchedSubflight; ++i) {
                if(teamsForStandingsArr[i].teamId === id) {

                  teamsForStandingsArr[i].subflightId = resp.subflightid;
                  output.userTeams[id].subflightId = resp.subflightid;
                  teamsForStandingsArr[i].subflightName = resp.subflightname;

                  fetchedSubflight = true;
                }
              }
              console.log(id, resp.captainustanumber)
              //might want to put captain part on teammager to decrease load time
              output.userTeams[id].isCaptain = ustaNum === resp.captainustanumber || ustaNum === resp.cocaptainustanumber;

              if(output.userTeams[id].isCaptain && totalUnplayedMatches > 0) captainMap[id] = false;

              callback2();
            }).catch( (ex) => {

              //console.log(ex, teamId);
              callback2(ex);
            })
          } else callback2();
        }
    ], function(err) { //This function gets called after the two tasks have called their "task callbacks"
        if (err) {
          //console.log(err)
        }

        callback();

    });


  }

  return (dispatch, getState) => {
    dispatch(requestMatches());

    //get teams for player
    Api.get(`<API_ENDPOINT>?iUSTANumber=${encodeURIComponent(ustaNum)}`).then(resp => {

      let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');

      output.userData.playerName = doc.getElementsByTagName('name')[0].childNodes[0].nodeValue;
      output.userData.ustaNum = ustaNum;
      output.userData.ntrp = doc.getElementsByTagName('ntrprating')[0].childNodes[0].nodeValue;
      output.userData.isCaptain = isCaptain;

      let teams = doc.getElementsByTagName('team');
      let teamsArr = [];

      let numTeams = 0;
      if(teams.length > 0) {

        for(let i=0; i<teams.length; ++i) {

          let teamName = teams[i].getElementsByTagName('teamname')[0].childNodes[0].nodeValue;
          let flightName = teams[i].getElementsByTagName('flightname')[0].childNodes[0].nodeValue;
          let flightId = teams[i].getElementsByTagName('flightid')[0].childNodes[0].nodeValue;
          let teamId = teams[i].getElementsByTagName('teamid')[0].childNodes[0].nodeValue;
          let cYear = teams[i].getElementsByTagName('cyear')[0].childNodes[0].nodeValue;
          let teamYear = new Date();
          teamYear.setFullYear(cYear);
          let currentYear = new Date();

          //dont fetch old teams
          if(teamYear.getFullYear() >= currentYear.getFullYear()) {
            numTeams++;


            output.userTeams[teamId] = {
              teamName,
              flightId,
              flightName,
              cYear
            }

            dynamoTeams.push(teamId);
            //teamName used to extract price if exists
            teamsArr.push({teamId, teamName, flightName});

            teamsForStandingsArr.push({flightId, flightName, cYear, teamId, subflightId: '', subflightName: ''});
          }
          output.userData.numTeams = numTeams;
        }
      }

      if(numTeams > 0) {

        async.parallel([
            function(callback) {
              async.forEach(teamsArr, lookUpTeam, function(err) {
                  if (err) {
                    //console.log(err);
                  }

                  //check to make sure all matches have not been played
                  if(scheduleArr.length > 0) {
                    //increasing
                    scheduleArr.sort((a, b) => a.date.getTime() - b.date.getTime());
                    convertArrToListDatablob(output.schedule, scheduleArr, 'year', 'matchId');

                  }
                  //check if no matches have been played
                  if(resultsArr.length > 0) {
                    //decreasing
                    resultsArr.sort((a, b) => b.date.getTime() - a.date.getTime());
                    convertArrToListDatablob(output.results, resultsArr, 'year', 'matchId');
                  }

                  teamsForStandingsArr.sort((a, b) => b.cYear - a.cYear);
                  convertArrToListDatablob(output.standings, teamsForStandingsArr, 'cYear', 'flightId');

                  if(isCaptain) {


                    Api.post('<API_ENDPOINT>', {isCaptain, ustaNum}).then(resp => {
                      //merge teams the captain activated
                      captainMap = {...captainMap, ...resp.teams}
                      output.userData['unusedTeams'] = resp.unusedTeams
                      callback();
                    }).catch( (ex) => {
                      console.log(ex);
                      callback();
                    });
                  } else {

                    callback();
                  }

              });

            },
            //combine these endpoints
            function(callback) {
              Api.post('<API_ENDPOINT>', {teamIds: dynamoTeams}).then(resp => {

                for(team of resp) {
                  //figure out which of the players teams have been activated by a captain
                  //list of all teams available for players to subscribe to
                  activatedMap[team.id] = true
                }
                callback();
              }).catch( (ex) => {
                console.log(ex);
              });
            },
            function(callback) {
              //find teams the player has subscribed to
              Api.post('<API_ENDPOINT>', {isCaptain: false, ustaNum}).then(resp => {

                subscriptionMap = resp.teams;
                callback();
              }).catch( (ex) => {
                console.log(ex);
              });
            },
            function(callback) {
              Api.getAWS(`<API_ENDPOINT>/${ustaNum}`).then(resp => {

                for(match of resp) {
                  //get availability for all matches for ScheduleList
                  userStatusMap[match.match_id] = match.avail;
                }
                callback();
              }).catch( (ex) => {
                console.log(ex);
              });
            }
        ], function(err) { //This is the final callback

          //autosubscribe player to all teams activated by captain
          const {isCaptain, ustaNum} = output.userData;
          if(!isCaptain) {


              let ChannelType = (Platform.OS === 'ios') ? 'APNS' : 'GCM';


                Object.keys(activatedMap).forEach(function(teamID) {

                      if(!(teamID in subscriptionMap)) {
                        AsyncStorage.getItem("token").then((token) => {
                          if(token != null) {
                            console.log('teamID',teamID)

                             let data = {
                               isCaptain,
                               ustaNum,
                               teamID,
                               address: token,
                               ChannelType
                             }
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
                          } else {
                            dispatch(subscribeFailure({msg: 'noToken'}));

                          }


                        }).done();


                      }

                });


              }




            //set activated teams for player
            dispatch(setUserScheduleStatus(userStatusMap));
            dispatch(setActivatedTeams(activatedMap));
            dispatch(setSubscribedTeams(subscriptionMap));
            dispatch(setCaptainTeams(captainMap));
            dispatch(setFetchedTeams({teams: teamMap}));
            dispatch(receiveMatches({matches: output}));
            //dispatch(setScheduleMap(scheduleMap));

        });

      } else {
        //user has no teams
        dispatch(setUserScheduleStatus(userStatusMap));
        dispatch(setActivatedTeams(activatedMap));
        dispatch(setSubscribedTeams(subscriptionMap));
        dispatch(setCaptainTeams(captainMap));
        dispatch(setFetchedTeams({teams: teamMap}));
        dispatch(receiveMatches({matches: output}));
        //dispatch(setScheduleMap(scheduleMap));
      }

    }).catch( (ex) => {
      //console.log(ex);
    });
  }
}

export function requestMatches() {
  return {
    type: types.REQUEST_MATCHES,
  }
}
export function receiveMatches({ matches }) {
  return {
    type: types.RECEIVE_MATCHES,
    matches
  }
}
export function setFetchedTeams({ teams }) {
  return {
    type: types.SET_FETCHED_TEAMS,
    teams,
  }
}
export function setCaptainTeams(teams) {
  return {
    type: types.CAPTAIN_TEAMS,
    teams,
  }
}
export function setActivatedTeams(teams) {
  return {
    type: types.ACTIVATED_TEAMS,
    teams,
  }
}
export function setUserScheduleStatus(status) {
  return {
    type: types.USER_SCHEDULE_STATUS,
    status,
  }
}
export function setSubscribedTeams(teams) {
  return {
    type: types.RECEIVE_SUBSCRIPTIONS,
    teams,
  }
}
export function setScheduleMap(scheduleMap) {
  return {
    type: types.SCHEDULE_MAP,
    scheduleMap
  }
}
////////////////////////////////////
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
