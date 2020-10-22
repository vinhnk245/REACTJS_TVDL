import {
  GET_MEMBER, GET_MEMBER_SUCCESS, GET_MEMBER_FAIL,
  GET_LIST_MEMBER, GET_LIST_MEMBER_SUCCESS, GET_LIST_MEMBER_FAIL,
} from '../actions/type'

const initialState = {
  data: {},
  isLoading: true,
  error: null,
}
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_MEMBER: {
      return { ...state, isLoading: true }
    }
    case GET_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.response,
      }
    }
    case GET_MEMBER_FAIL: {
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    }
    case GET_LIST_MEMBER: {
      return { ...state, isLoading: true }
    }
    case GET_LIST_MEMBER_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        error: null,
        data: action.payload.response,
      }
    }
    case GET_LIST_MEMBER_FAIL: {
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
