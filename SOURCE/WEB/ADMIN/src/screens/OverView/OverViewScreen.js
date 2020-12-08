import React, { Component } from 'react'
import { Row, Col, Button, FormControl } from 'react-bootstrap'
import { ROUTER, STRING } from '@constants/Constant'
import { requestGetOverviews } from '@constants/Api'
import { connect } from 'react-redux'
import '@styles/OverViewScreen.css'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
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
      activeMember: 0,
      totalMember: 0,
      totalBook: 0,
      totalReader: 0,
      totalRentedThisMonth: 0
    }
  }
  componentDidMount() {
    this.getOverviews()
  }

  async getOverviews() {
    this.setState({ loadingAction: true })
    const res = await requestGetOverviews({})
    this.setState({
      activeMember: res?.data?.activeMember,
      totalMember: res?.data?.totalMember,
      totalBook: res?.data?.totalBook,
      totalReader: res?.data?.totalReader,
      totalRentedThisMonth: res?.data?.totalRentedThisMonth,
    })
    this.setState({ loadingAction: false })
  }

  handleChange = (fieldName, value) => {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  renderBody = () => {
    const { push } = this.props.history
    const { activeMember, totalMember, totalReader, totalBook, totalRentedThisMonth } = this.state
    return (
      <div className="content-wrapper">
        <div className="content-header mx-0">
          {/* <div className="row mb-2 mx-0">
            <div className="col-sm-6">
              <h2 className="header">{STRING.System_overView}</h2>
            </div>
          </div> */}
          <div className="container-fluid">
            <div className="row my-2">
              <div className="col-md-12">
                <h1 className="text-header-screen">Tổng quan
                </h1>
              </div>
            </div>
            {/* <div className="col-md-12"> */}
            <div className="row mt-4">
              <div className="col-xl-3 col-lg-6">
                <div className="card hvr-float">
                  <div className="card-body card-type-3" onClick={() => push(ROUTER.RENTED)}>
                    <div className="row">
                      <div className="col">
                        <h6 className="text-muted mb-0">Mượn sách</h6>
                        <span className="font-weight-bold mb-0">{totalRentedThisMonth}</span>
                      </div>
                      <div className="col-auto">
                        <div className="card-circle l-bg-cyan text-white">
                          <i className="fa fa-chart-area"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card hvr-float">
                  <div className="card-body card-type-3" onClick={() => push(ROUTER.READER)}>
                    <div className="row">
                      <div className="col">
                        <h6 className="text-muted mb-0">Bạn đọc</h6>
                        <span className="font-weight-bold mb-0">{totalReader}</span>
                      </div>
                      <div className="col-auto">
                        <div className="card-circle l-bg-green text-white">
                          <i className="fa fa-address-card"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card hvr-float">
                  <div className="card-body card-type-3" onClick={() => push(ROUTER.BOOK)}>
                    <div className="row">
                      <div className="col">
                        <h6 className="text-muted mb-0">Sách</h6>
                        <span className="font-weight-bold mb-0">{totalBook}</span>
                      </div>
                      <div className="col-auto">
                        <div className="card-circle l-bg-orange text-white">
                          <i className="fa fa-book-open"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card hvr-float">
                  <div className="card-body card-type-3 card-member" onClick={() => push(ROUTER.MEMBER)}>
                    <div className="row">
                      <div className="col">
                        <h6 className="text-muted mb-0">{STRING.member}</h6>
                        <span className="font-weight-bold mb-0">{activeMember} / {totalMember}</span>
                      </div>
                      <div className="col-auto">
                        <div className="card-circle l-bg-purple text-white">
                          <i className="fa fa-users"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-5">

            </div>

            {/* </div> */}
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
