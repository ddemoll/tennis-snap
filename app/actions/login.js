import * as types from './types'
import Api from '../lib/api'
import Parser from '../lib/parser'
import { DOMParser } from 'xmldom'

export function login(ustaNum, checkCaptain, email) {

  return (dispatch, getState) => {

    let output = {success: false, isCaptain: false, name: '', ustaNum, email};
    let parser = new DOMParser();

    if(checkCaptain) {
      Api.get(`<API_ENDPOINT>?sID=${encodeURIComponent(ustaNum)}`).then(resp => {

        let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');
        let isCaptain = doc.getElementsByTagName('IsCaptain')[0].childNodes[0].nodeValue;
        if(isCaptain === "1") {
          output.isCaptain = true;
          output.success = true;
          dispatch(setLoggedInPlayer({data: output}));

        } else {
          //not Captain
          dispatch(setLoggedInPlayer({data: output}));
        }

      }).catch( (ex) => {
        //console.log(ex);
      });
    } else {

      Api.get(`<API_ENDPOINT>iUSTANumber=${encodeURIComponent(ustaNum)}`).then(resp => {

        let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');
        let name = doc.getElementsByTagName('name');
        if(name.length !== 0) {
          output.name = name[0].childNodes[0].nodeValue;
          output.success = true;
        }
        dispatch(setLoggedInPlayer({data: output}));

      }).catch( (ex) => {
        //console.log(ex);

      });

    }
  }

}

//analytics to log all users to db
export function logUserSignIn(ustaNum, isCaptain, email) {

  return (dispatch, getState) => {
    Api.post('<API_ENDPOINT>', {ustaNum, isCaptain, email}).then(resp => {

    }).catch( (ex) => {
      console.log(ex)
    });
  }

}


export function setLoggedInPlayer({ data }) {
  return {
    type: types.LOG_IN_PLAYER,
    data,
  }
}
