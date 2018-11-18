import Api from './api'
import Parser from './parser'
import { DOMParser } from 'xmldom'

class Tennislink {

  static getTeamInfo(teamId) {

    return Api.get(`/websrvc_get_team_info?iTeamID=${encodeURIComponent(teamId)}`).then(resp => {
      let parser = new DOMParser();
      let doc = parser.parseFromString(Parser.decodeXml(resp), 'text/xml');
      let i = teamId;

      //If facilityname is null default to teamname
      let facilityname = null;
      if(doc.getElementsByTagName('facilityname')[0].childNodes[0] == null) {
        facilityname = doc.getElementsByTagName('teamname')[0].childNodes[0].nodeValue;
      } else {
        facilityname = doc.getElementsByTagName('facilityname')[0].childNodes[0].nodeValue;
      }

      return {
        /*
        district: doc.getElementsByTagName('district')[0].childNodes[0].nodeValue,
        section: doc.getElementsByTagName('section')[0].childNodes[0].nodeValue,
        */
        captain: Parser.assignValue(doc.getElementsByTagName('captain')[0].childNodes[0]),
        captainustanumber: Parser.assignValue(doc.getElementsByTagName('captainustanumber')[0].childNodes[0]),
        cocaptain: Parser.assignValue(doc.getElementsByTagName('cocaptain')[0].childNodes[0]),
        cocaptainustanumber: Parser.assignValue(doc.getElementsByTagName('cocaptainustanumber')[0].childNodes[0]),

        facilityname,

        //facilitycity: doc.getElementsByTagName('facilitycity')[0].childNodes[0].nodeValue,
        //facilitystate: doc.getElementsByTagName('facilitystate')[0].childNodes[0].nodeValue,
        subflightid: doc.getElementsByTagName('subflightid')[0].childNodes[0].nodeValue,
        subflightname: doc.getElementsByTagName('subflightname')[0].childNodes[0].nodeValue
      }

    })
    .catch( (ex) => {
      //console.log(teamId, ex);

    })

  }



}
export default Tennislink
