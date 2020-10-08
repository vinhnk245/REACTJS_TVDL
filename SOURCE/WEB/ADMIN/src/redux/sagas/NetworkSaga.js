import { put, takeEvery, call } from 'redux-saga/effects'
import {
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAIL,
  GET_LIST_USER,
  GET_LIST_USER_SUCCESS,
  GET_LIST_USER_FAIL,
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAIL,
  UPDATE_USER,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAIL,
  GET_LIST_TRANSPORT,
  GET_LIST_TRANSPORT_SUCCESS,
  GET_LIST_TRANSPORT_FAIL,
  ADD_TRANSPORT,
  ADD_TRANSPORT_SUCCESS,
  ADD_TRANSPORT_FAIL,
  UPDATE_TRANSPORT,
  UPDATE_TRANSPORT_SUCCESS,
  UPDATE_TRANSPORT_FAIL,
} from '../actions/type'
import * as API from '../../constants/Api'

export function* getUserInfor(payload) {
  try {
    const response = yield call(API.requestGetUserInfo)
    yield put({ type: GET_USER_SUCCESS, payload: response })
  } catch (err) {
    yield put({ type: GET_USER_FAIL, payload: err })
  }
}

export function* getListUser(action) {
  try {
    const response = yield call(API.getListUser, action.payload)
    yield put({
      type: GET_LIST_USER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: GET_LIST_USER_FAIL,
      payload: error,
    })
  }
}

export function* addUser(action) {
  try {
    const response = yield call(API.postCreateUser, action.payload)
    console.log(action.payload)
    yield put({
      type: ADD_USER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: ADD_USER_FAIL,
      payload: error,
    })
  }
}

export function* updateUser(action) {
  try {
    const response = yield call(API.updateUser, action.payload)
    yield put({
      type: UPDATE_USER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: UPDATE_USER_FAIL,
      payload: error,
    })
  }
}

export function* getListTransport(action) {
  try {
    const response = yield call(API.getListTransport, action.payload)
    yield put({
      type: GET_LIST_TRANSPORT_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: GET_LIST_TRANSPORT_FAIL,
      payload: error,
    })
  }
}

export function* addTransport(action) {
  try {
    const response = yield call(API.addTransport, action.payload)
    yield put({
      type: ADD_TRANSPORT_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: ADD_TRANSPORT_FAIL,
      payload: error,
    })
  }
}

export function* updateTransport(action) {
  try {
    const response = yield call(API.updateTransport, action.payload)
    yield put({
      type: UPDATE_TRANSPORT_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: UPDATE_TRANSPORT_FAIL,
      payload: error,
    })
  }
}

export const watchGetUser = takeEvery(GET_USER, getUserInfor)
export const watchGetListUser = takeEvery(GET_LIST_USER, getListUser)
export const watchAddUser = takeEvery(ADD_USER, addUser)
export const watchUpdateUser = takeEvery(UPDATE_USER, updateUser)
export const watchGetListTransport = takeEvery(GET_LIST_TRANSPORT, getListTransport)
export const watchAddTransport = takeEvery(ADD_TRANSPORT, addTransport)
export const watchUpdateTransport = takeEvery(UPDATE_TRANSPORT, updateTransport)
