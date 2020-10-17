import { combineReducers } from 'redux'
import { RESET } from '../actions/type'
import MemberReducer from './MemberReducer'

let appReducer = combineReducers({
  MemberReducer,
})

const initialState = appReducer({}, {})

export default (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
