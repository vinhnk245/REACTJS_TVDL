import {
  watchGetMember,
  watchGetListMember,
  watchAddMember,
  watchUpdateMember,
  watchGetReader,
  watchGetListReader,
  watchAddReader,
  watchUpdateReader,
} from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetMember
  yield watchGetListMember
  yield watchAddMember
  yield watchUpdateMember
  yield watchGetReader
  yield watchGetListReader
  yield watchAddReader
  yield watchUpdateReader
}
