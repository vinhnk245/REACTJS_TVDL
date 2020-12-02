import { combineReducers } from 'redux'
import { RESET } from '../actions/type'
import MemberReducer from './MemberReducer'
import ReaderReducer from './ReaderReducer'
import BookReducer from './BookReducer'

let appReducer = combineReducers({
  MemberReducer,
  ReaderReducer,
  BookReducer,
})

const initialState = appReducer({}, {})

export default (state, action) => {
  if (action.type === RESET) {
    state = initialState
  }

  return appReducer(state, action)
}
