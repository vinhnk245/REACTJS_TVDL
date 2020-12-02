import { GET_LIST_MEMBER, GET_LIST_READER, GET_LIST_BOOK } from './type'

// ============= member =============
export const getListMember = (payload) => ({
  type: GET_LIST_MEMBER,
  payload: payload,
})

// ============= reader =============
export const getListReader = (payload) => ({
  type: GET_LIST_READER,
  payload: payload,
})

// ============= book =============
export const getListBook = (payload) => ({
  type: GET_LIST_BOOK,
  payload: payload,
})
