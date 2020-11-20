import { combineReducers } from 'redux'
import { RESET } from '../actions/type'
import MemberReducer from './MemberReducer'
import ReaderReducer from './ReaderReducer'

let appReducer = combineReducers({
  MemberReducer,
  ReaderReducer,
})

const initialState = appReducer({}, {})

export default (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
