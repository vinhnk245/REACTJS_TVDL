import {
  GET_LIST_TRANSPORT,
  GET_LIST_TRANSPORT_SUCCESS,
  GET_LIST_TRANSPORT_FAIL,
  ADD_TRANSPORT,
  ADD_TRANSPORT_SUCCESS,
  ADD_TRANSPORT_FAIL,
  UPDATE_TRANSPORT,
  UPDATE_TRANSPORT_SUCCESS,
  UPDATE_TRANSPORT_FAIL,
  DELETE_TRANSPORT,
} from '../actions/type'

const initialState = {
  data: {},
  isLoading: true,
  isDataLoaded: true,
  error: null,
}

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LIST_TRANSPORT: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case GET_LIST_TRANSPORT_SUCCESS: {
      return {
        ...state,
        isLoading: false,
        isDataLoaded: false,
        error: null,
        data: action.payload.response.data,
      }
    }
    case GET_LIST_TRANSPORT_FAIL: {
      return {
        ...state,
        isLoading: false,
        error: action.payload,
        data: null,
      }
    }
    case ADD_TRANSPORT: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case ADD_TRANSPORT_SUCCESS: {
      let array = state.data.TRANSPORT_LIST
      array.unshift(action.payload.response.data)
      return {
        ...state,
        isLoading: false,
        error: null,
        data: {
          ...state.data,
          TRANSPORT_LIST: array,
        },
      }
    }
    case ADD_TRANSPORT_FAIL: {
      window.alert(action.payload.msg)
      return {
        ...state,
        isLoading: false,
      }
    }
    case UPDATE_TRANSPORT: {
      return {
        ...state,
        isLoading: true,
      }
    }
    case UPDATE_TRANSPORT_SUCCESS: {
      let array = state.data.TRANSPORT_LIST
      // let index = array.findIndex(
      //     (e) => e.ID == action.payload.response.data.ID
      // );
      let index = array.findIndex((e) => e.ID === action.payload.response.data.ID)
      array[index] = action.payload.response.data
      return {
        ...state,
        isLoading: false,
        error: null,
        data: {
          ...state.data,
          TRANSPORT_LIST: array,
        },
      }
    }
    case UPDATE_TRANSPORT_FAIL: {
      // window.alert(action.payload.msg)
      return {
        ...state,
        isLoading: false,
      }
    }
    case DELETE_TRANSPORT: {
      let array = state.data
      let index = array.TRANSPORT_LIST.findIndex((e) => {
        return e.TRANSPORT_ID === action.payload
      })
      array.TRANSPORT_LIST.splice(index, 1)
      return {
        ...state,
        data: array,
      }
    }
    default:
      return state
  }
}
