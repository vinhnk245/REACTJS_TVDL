import {
  GET_LIST_MEMBER,
  DELETE_MEMBER,
  ADD_MEMBER,
  UPDATE_MEMBER,
  GET_LIST_READER,
  DELETE_READER,
  ADD_READER,
  UPDATE_READER,
} from './type'


// ============= member ============= 
export const getListMember = (payload) => ({
  type: GET_LIST_MEMBER,
  payload: payload,
})

export const deleteUserAction = (payload) => ({
  type: DELETE_MEMBER,
  payload: payload,
})

export const addUser = (payload) => ({
  type: ADD_MEMBER,
  payload: payload,
})

export const updateUser = (payload) => ({
  type: UPDATE_MEMBER,
  payload: payload,
})



// ============= reader ============= 
export const getListReader = (payload) => ({
  type: GET_LIST_READER,
  payload: payload,
})

export const deleteReader = (payload) => ({
  type: DELETE_READER,
  payload: payload,
})

export const addReader = (payload) => ({
  type: ADD_READER,
  payload: payload,
})

export const updateReader = (payload) => ({
  type: UPDATE_READER,
  payload: payload,
})
