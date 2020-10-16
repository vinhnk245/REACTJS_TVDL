import {
  GET_LIST_MEMBER,
  DELETE_MEMBER,
  ADD_MEMBER,
  UPDATE_MEMBER,
} from './type'

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
