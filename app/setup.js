import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware} from 'redux'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import reducer from './reducers'

import codePush from "react-native-code-push";

import RootContainer from './containers/RootContainer'

const middleware = []
middleware.push(thunkMiddleware)

if (__DEV__) {
    const { logger } = require(`redux-logger`);
    middleware.push(logger)
}

const store = createStore(
  reducer,
  applyMiddleware(...middleware)
)

class App extends Component {
  render () {
      return (
    <Provider store={store}>
      <RootContainer />
    </Provider>
    )
  }
}
App = codePush(App);
export default App

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    flexDirection: 'row',


  },

});
