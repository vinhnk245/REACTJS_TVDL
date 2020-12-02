import {
  GET_BOOK,
  GET_BOOK_SUCCESS,
  GET_BOOK_FAIL,
  GET_LIST_BOOK,
  GET_LIST_BOOK_SUCCESS,
  GET_LIST_BOOK_FAIL,
} from '../actions/type'

const initialState = {
  data: {},
  isLoading: false,
  error: null,
}
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_BOOK: {
      return { ...state, isLoading: true }
    }
    case GET_LIST_BOOK_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.response,
      }
    }
    case GET_LIST_BOOK_FAIL: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    }
    default:
      return state
  }
}
