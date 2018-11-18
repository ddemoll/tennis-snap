class Parser {

  static decodeXml(string) {
      let escaped_one_to_xml_special_map = {
          '&amp;': '&',
          '&quot;': '"',
          '&lt;': '<',
          '&gt;': '>'
      };
      return string.replace(/(&quot;|&lt;|&gt;|&amp;)/g,
          function(str, item) {
              return escaped_one_to_xml_special_map[item];
      });
  }
  //used to parse optional values like cocaptain
  static assignValue(playerName) {
    if(playerName == null)
      return "0";
    return playerName.nodeValue;
  }
}
export default Parser
