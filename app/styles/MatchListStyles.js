import { StyleSheet } from 'react-native'
//styles for list view used by schedule and result
const styles = StyleSheet.create({
  //schedule section
  parentContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    //paddingBottom: 8,
    //paddingTop: 8
  },
  userTeamText: {
    paddingTop: 10,
    fontSize: 10
  },
  matchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  matchTeamsContainer: {
    flex: 1,
    paddingBottom: 8,
    paddingTop: 8
},
  matchDateContainer: {
    margin: 8,
    justifyContent: 'space-between',
  },
  matchDateText: {
    textAlign: 'center'
  },
  matchMonthText: {
    textAlign: 'center',
    color: 'red'
  },
  matchIconContainer: {
    margin: 8,
    paddingRight: 20
  },
  sectionHeaderText: {
    textAlign: 'center',
    color: '#0076FF'
  },
  separator: {
    backgroundColor: '#eeeeee',
    height: 1,
  },

//results section
  scoreContainer: {
    flex: 1,
    paddingBottom: 8,
    paddingTop: 8
},

teamContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingBottom: 8,
  paddingTop: 8
},
teamScoreContainer: {
  flex: 1,
  flexDirection: 'row',
  justifyContent: 'flex-end'
},
teamNameContainer: {
  flex: 4,
  flexWrap: 'wrap'
},
teamNameText: {
  //color: 'black',
  fontSize: 16
},
teamScoreText: {
  color: 'black',
  fontSize: 16,
  fontWeight: 'bold'
},
noDataText: {
  textAlign: 'center',
  padding: 16,
  fontSize: 16
},

sectionHeader: {
  backgroundColor: 'lightgray'
},
sectionHeaderText: {
  textAlign: 'center',
  color: '#0076FF'
},
separator: {
  backgroundColor: '#eeeeee',
  height: 1,
},
});
export default styles
