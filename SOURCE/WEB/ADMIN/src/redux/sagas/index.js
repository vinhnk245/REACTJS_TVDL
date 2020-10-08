import {
  watchGetUser,
  watchGetListUser,
  watchAddUser,
  watchUpdateUser,
  watchGetListTransport,
  watchAddTransport,
  watchUpdateTransport,
} from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetUser
  yield watchGetListUser
  yield watchAddUser
  yield watchUpdateUser
  yield watchGetListTransport
  yield watchAddTransport
  yield watchUpdateTransport
}
