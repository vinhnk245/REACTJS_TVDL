import React, { Component } from 'react'
import { Row, Col, Button, FormControl } from 'react-bootstrap'
import { STRING, CONFIG_TYPE_OVERVIEW, CONFIG_TYPE } from '@constants/Constant'
import { getInforDashBoardOverViewSystem, getInforDashBoardOverViewStore, getStatisticAdmin } from '@constants/Api'
import { connect } from 'react-redux'
import '@styles/UserScreen.css'
import Pagination from 'react-js-pagination'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import EmptyData from '@src/components/EmptyData'
import DatePickerCustom from 'src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import reactotron from 'reactotron-react-js'

class OverViewScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      loadingAction: false,
      error: false,
      emptyData: false,
    }
  }
  componentDidMount() {}

  handleChange = (fieldName, value) => {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  renderBody = () => {
    return (
      <div className="content-wrapper">
        <div className="content-header mx-0">
          <div className="row mb-2 mx-0">
            <div className="col-sm-6">
              <h2 className="header">{STRING.System_overView}</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
  render = () => {
    const { isLoading, loadingAction, error } = this.state
    return (
      <>
        {loadingAction && <LoadingAction />}
        {isLoading && <Loading />}
        {error && <Error isOpen={error}></Error>}
        {this.renderBody()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(OverViewScreen)
