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
} from '../actions/type'
import * as API from '../../constants/Api'

export function* getMemberInfo(payload) {
  try {
    const response = yield call(API.getMemberInfo)
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


export const watchGetMember = takeEvery(GET_MEMBER, getMemberInfo)
export const watchGetListMember = takeEvery(GET_LIST_MEMBER, getListMember)
export const watchAddMember = takeEvery(ADD_MEMBER, addMember)
export const watchUpdateMember = takeEvery(UPDATE_MEMBER, updateMember)
