import {
  GET_LIST_USER,
  DELETE_USER,
  ADD_USER,
  UPDATE_USER,
  GET_LIST_TRANSPORT,
  ADD_TRANSPORT,
  UPDATE_TRANSPORT,
  DELETE_TRANSPORT,
} from './type'

export const getListUser = (payload) => ({
  type: GET_LIST_USER,
  payload: payload,
})

export const deleteUserAction = (payload) => ({
  type: DELETE_USER,
  payload: payload,
})

export const addUser = (payload) => ({
  type: ADD_USER,
  payload: payload,
})

export const updateUser = (payload) => ({
  type: UPDATE_USER,
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
