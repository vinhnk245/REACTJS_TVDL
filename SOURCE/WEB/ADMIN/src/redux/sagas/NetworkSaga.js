import { put, takeEvery, call } from 'redux-saga/effects'
import {
  GET_MEMBER,
  GET_MEMBER_SUCCESS,
  GET_MEMBER_FAIL,
  GET_LIST_MEMBER,
  GET_LIST_MEMBER_SUCCESS,
  GET_LIST_MEMBER_FAIL,
  ADD_MEMBER,
  ADD_MEMBER_SUCCESS,
  ADD_MEMBER_FAIL,
  UPDATE_MEMBER,
  UPDATE_MEMBER_SUCCESS,
  UPDATE_MEMBER_FAIL,
  GET_READER,
  GET_READER_SUCCESS,
  GET_READER_FAIL,
  GET_LIST_READER,
  GET_LIST_READER_SUCCESS,
  GET_LIST_READER_FAIL,
  ADD_READER,
  ADD_READER_SUCCESS,
  ADD_READER_FAIL,
  UPDATE_READER,
  UPDATE_READER_SUCCESS,
  UPDATE_READER_FAIL,
} from '../actions/type'
import * as API from '../../constants/Api'


// ============ member =================
export function* getUserInfo(payload) {
  try {
    const response = yield call(API.requestGetUserInfo)
    yield put({ type: GET_MEMBER_SUCCESS, payload: response })
  } catch (err) {
    yield put({ type: GET_MEMBER_FAIL, payload: err })
  }
}

export function* getListMember(action) {
  try {
    const response = yield call(API.getListMember, action.payload)
    yield put({
      type: GET_LIST_MEMBER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: GET_LIST_MEMBER_FAIL,
      payload: error,
    })
  }
}

export function* addMember(action) {
  try {
    const response = yield call(API.createMember, action.payload)
    console.log(action.payload)
    yield put({
      type: ADD_MEMBER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: ADD_MEMBER_FAIL,
      payload: error,
    })
  }
}

export function* updateMember(action) {
  try {
    const response = yield call(API.updateMember, action.payload)
    yield put({
      type: UPDATE_MEMBER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: UPDATE_MEMBER_FAIL,
      payload: error,
    })
  }
}

// ============ reader =================
export function* getReaderInfo(payload) {
  try {
    const response = yield call(API.getReaderInfo)
    yield put({ type: GET_READER_SUCCESS, payload: response })
  } catch (err) {
    yield put({ type: GET_READER_FAIL, payload: err })
  }
}

export function* getListReader(action) {
  try {
    const response = yield call(API.getListReader, action.payload)
    yield put({
      type: GET_LIST_READER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: GET_LIST_READER_FAIL,
      payload: error,
    })
  }
}

export function* addReader(action) {
  try {
    const response = yield call(API.createReader, action.payload)
    console.log(action.payload)
    yield put({
      type: ADD_READER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: ADD_READER_FAIL,
      payload: error,
    })
  }
}

export function* updateReader(action) {
  try {
    const response = yield call(API.updateReader, action.payload)
    yield put({
      type: UPDATE_READER_SUCCESS,
      payload: { response },
    })
  } catch (error) {
    yield put({
      type: UPDATE_READER_FAIL,
      payload: error,
    })
  }
}


export const watchGetMember = takeEvery(GET_MEMBER, getUserInfo)
export const watchGetListMember = takeEvery(GET_LIST_MEMBER, getListMember)
export const watchAddMember = takeEvery(ADD_MEMBER, addMember)
export const watchUpdateMember = takeEvery(UPDATE_MEMBER, updateMember)

export const watchGetReader = takeEvery(GET_MEMBER, getReaderInfo)
export const watchGetListReader = takeEvery(GET_LIST_MEMBER, getListReader)
export const watchAddReader = takeEvery(ADD_MEMBER, addReader)
export const watchUpdateReader = takeEvery(UPDATE_MEMBER, updateReader)
