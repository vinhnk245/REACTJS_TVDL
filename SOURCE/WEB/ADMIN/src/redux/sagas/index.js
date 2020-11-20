import { watchGetListMember, watchGetListReader } from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetListMember
  yield watchGetListReader
}
