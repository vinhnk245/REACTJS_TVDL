import {
  watchGetMember,
  watchGetListMember,
  watchAddMember,
  watchUpdateMember,
} from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetMember
  yield watchGetListMember
  yield watchAddMember
  yield watchUpdateMember
}
