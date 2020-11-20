import { put, takeEvery, call } from 'redux-saga/effects'
import {
  GET_LIST_MEMBER,
  GET_LIST_MEMBER_SUCCESS,
  GET_LIST_MEMBER_FAIL,
  GET_LIST_READER,
  GET_LIST_READER_SUCCESS,
  GET_LIST_READER_FAIL,
} from '../actions/type'
import * as API from '../../constants/Api'

// ============ member =================
// export function* getUserInfo(payload) {
//   try {
//     const response = yield call(API.requestGetUserInfo)
//     yield put({ type: GET_MEMBER_SUCCESS, payload: response })
//   } catch (err) {
//     yield put({ type: GET_MEMBER_FAIL, payload: err })
//   }
// }

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

// ============ reader =================

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

export const watchGetListMember = takeEvery(GET_LIST_MEMBER, getListMember)

export const watchGetListReader = takeEvery(GET_LIST_READER, getListReader)
