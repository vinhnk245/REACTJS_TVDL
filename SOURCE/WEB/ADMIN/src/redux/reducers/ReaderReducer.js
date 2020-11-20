import {
  GET_READER,
  GET_READER_SUCCESS,
  GET_READER_FAIL,
  GET_LIST_READER,
  GET_LIST_READER_SUCCESS,
  GET_LIST_READER_FAIL,
} from '../actions/type'

const initialState = {
  data: {},
  isLoading: false,
  error: null,
}
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_READER: {
      return { ...state, isLoading: true }
    }
    case GET_READER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.response,
      }
    }
    case GET_READER_FAIL: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    }
    case GET_LIST_READER: {
      return { ...state, isLoading: true }
    }
    case GET_LIST_READER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.response,
      }
    }
    case GET_LIST_READER_FAIL: {
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
