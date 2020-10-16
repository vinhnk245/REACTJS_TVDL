import {
  GET_LIST_MEMBER,
  DELETE_MEMBER,
  ADD_MEMBER,
  UPDATE_MEMBER,
  GET_LIST_TRANSPORT,
  ADD_TRANSPORT,
  UPDATE_TRANSPORT,
  DELETE_TRANSPORT,
} from './type'

export const getListUser = (payload) => ({
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

export const getListTransportAction = (payload) => ({
  type: GET_LIST_TRANSPORT,
  payload: payload,
})

export const addTransport = (payload) => ({
  type: ADD_TRANSPORT,
  payload: payload,
})

export const updateTransport = (payload) => ({
  type: UPDATE_TRANSPORT,
  payload: payload,
})

export const deleteTransportAction = (payload) => ({
  type: DELETE_TRANSPORT,
  payload: payload,
})
