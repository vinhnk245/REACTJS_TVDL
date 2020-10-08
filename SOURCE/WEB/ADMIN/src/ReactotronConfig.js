import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'
import apisaucePlugin from 'reactotron-apisauce'
let scriptHostname = 'localhost'

var reactotron = Reactotron.configure({ host: scriptHostname })
  .use(reactotronRedux())
  .use(sagaPlugin())
  .use(apisaucePlugin())
  .connect()

export default reactotron
