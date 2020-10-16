import {
  watchGetMember,
  // watchGetListMember,
  watchAddMember,
  watchUpdateMember,
  watchGetListTransport,
  watchAddTransport,
  watchUpdateTransport,
} from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetMember
  // yield watchGetListMember
  yield watchAddMember
  yield watchUpdateMember
  yield watchGetListTransport
  yield watchAddTransport
  yield watchUpdateTransport
}
