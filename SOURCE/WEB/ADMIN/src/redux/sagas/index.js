import { watchGetListMember, watchGetListReader, watchGetListBook } from './NetworkSaga'

export default function* rootSaga() {
  yield watchGetListMember
  yield watchGetListReader
  yield watchGetListBook
}
