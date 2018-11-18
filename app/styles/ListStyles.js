import {
  Platform

} from 'react-native'

export const scrollListStyles = {
  scrollContainer: {
    flex: 1,
    backgroundColor: '#cecece',
    ...Platform.select({
      ios: {
        paddingTop: 64,
      },
      android: {
        paddingTop: 64//Navigator.NavigationBar.Styles.General.NavBarHeight,
      },
    }),

  }
}
export const detailScrollContainerStyle = {
  scrollContainer: {
    flex: 1,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        paddingTop: 64,
      },
      android: {
        paddingTop: 64//Navigator.NavigationBar.Styles.General.NavBarHeight,
      },
    }),
  }
}
export const standingsListStyles = {
  standingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    paddingBottom: 8,
    paddingTop: 8
  },
  flightContainer: {
    flex: 1,
    margin: 8,
    flexWrap: 'wrap'
  },
  flightText: {
    fontSize: 16,
    color: 'black'
  },
  matchIcon: {
    margin: 8,
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
}
