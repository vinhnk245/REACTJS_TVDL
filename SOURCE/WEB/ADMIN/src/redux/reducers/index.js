import { combineReducers } from 'redux'
import { RESET } from '../actions/type'
import UserReducer from './UserReducer'
import TransportReducer from './TransportReducer'

let appReducer = combineReducers({
  userReducer: UserReducer,
  transportReducer: TransportReducer,
})

const initialState = appReducer({}, {})

export default (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
