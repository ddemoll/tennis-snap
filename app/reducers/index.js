import { combineReducers } from 'redux';
import * as matchesReducer from './matches'

const appReducer = combineReducers(Object.assign(
  matchesReducer,
));

//wipeout state on logout
export default rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
