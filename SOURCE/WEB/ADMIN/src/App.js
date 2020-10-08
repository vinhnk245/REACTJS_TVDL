import React from 'react'
import './App.css'
import store from './redux/store'
import { Provider } from 'react-redux'
import AppNavigator from './navigation/AppNavigator'
import 'bootstrap/dist/css/bootstrap.min.css'
import ToastCustom from '@src/components/ToastCustom'

function App() {
  return (
    <Provider store={store}>
      <ToastCustom />
      <AppNavigator />
    </Provider>
  )
}

export default App
