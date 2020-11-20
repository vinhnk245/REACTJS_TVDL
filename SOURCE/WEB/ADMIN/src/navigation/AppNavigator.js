import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { ROUTER } from '@constants/Constant'
import MemberScreen from '@screens/MemberScreen'
import ReaderScreen from '@screens/ReaderScreen'
import LoginScreen from '@screens/Auth/LoginScreen'
import PrivateRoute from './PrivateRoute'
import Header from '@src/components/Header'
import Sidebar from '@src/components/Sidebar'
// import TransportDetailScreen from '@screens/Transport/TransportDetailScreen'
import OverViewScreen from '@screens/OverView/OverViewScreen'
// import reactotron from 'reactotron-react-js'

export class AppNavigator extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/Login" exact component={LoginScreen} />
          <PrivateRoute path="/" Component={MainNavigator} />
        </Switch>
      </Router>
    )
  }
}

class MainNavigator extends Component {
  render() {
    return (
      <>
        <Header />
        <Sidebar />
        <Switch>
          <PrivateRoute path={ROUTER.OVERVIEW} exact Component={OverViewScreen} />
          <PrivateRoute path={ROUTER.MEMBER} exact Component={MemberScreen} />
          <PrivateRoute path={ROUTER.READER} exact Component={ReaderScreen} />
          <Route render={() => <Redirect to={ROUTER.OVERVIEW} />} />
        </Switch>
      </>
    )
  }
}

export default AppNavigator
