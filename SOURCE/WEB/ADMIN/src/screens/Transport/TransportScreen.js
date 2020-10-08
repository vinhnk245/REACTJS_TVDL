import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import { validateForm, toDateString } from '@src/utils/helper'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import { STRING, NUMBER, ROUTER } from '@constants/Constant'
import '@styles/UserScreen.css'
// import {
//   getListTransportAction,
//   getListTransportType,
//   deleteTransportAction,
//   getListTransportProvider,
//   getUserInfoAction,
// } from '@src/redux/actions'
import {
  deleteTransport,
  getListTransportRoute,
  rejectTransport,
  confirmTransport,
  addTransport,
  updateTransport,
  getListTransport,
  getTransportInfo,
} from '@constants/Api'
import Pagination from 'react-js-pagination'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import ToastCustom from '@src/components/ToastCustom'
import reactotron from 'reactotron-react-js'
import LoadingAction from '@src/components/LoadingAction'

class TransportScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [STRING.license]: '',
      [STRING.transportProviderName]: '',
      [STRING.transportType]: '',
      [STRING.fromDate]: '',
      [STRING.toDate]: '',
      [STRING.status]: 1,
      activePage: 1,
      show: false,
      confirmModal: false,
      loadingAction: false,
      err: null,
      selected: [],
      modal: {
        [STRING.licensePlate]: '',
        [STRING.brand]: '',
        [STRING.productionYear]: '',
        [STRING.transportType]: '',
        [STRING.weight]: '',
        [STRING.volume]: '',
        [STRING.transportProvider]: '',
        [STRING.route]: '',
      },
      validateError: {
        [STRING.licensePlate]: '',
        [STRING.brand]: '',
        [STRING.productionYear]: '',
        [STRING.transportType]: '',
        [STRING.weight]: '',
        [STRING.volume]: '',
        [STRING.transportProvider]: '',
        [STRING.route]: '',
      },
      editTransport: false,
      transportID: '',
      transportRoute: [],
      checkedItems: [],
      transportInfo: {},
      transportProviderInfo: {},
      disable: false,
      transportProviderRoute: [],
      transportProviderId: '',
      transport_reset_pass: false,
    }
    this.setShow = this.setShow.bind(this)
    this.renderTableData = this.renderTableData.bind(this)
    this.renderPagination = this.renderPagination.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {}

  async getTransportRoute(id) {
    const res = await getListTransportRoute(id)
    this.setState({
      transportRoute: res.data.LIST_ROUTE,
    })
  }

  async rejectTransport() {
    const {
      [STRING.licensePlate]: licensePlate,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
      activePage,
    } = this.state
    try {
      await rejectTransport({
        TRANSPORT_ID: this.state.checkedItems,
      })
      this.getData(licensePlate, transportProviderName, activePage, fromDate || 0, toDate || Date.now() / 1000)
    } catch (err) {
      console.log(err)
    }
  }

  async confirmTransport() {
    const {
      [STRING.licensePlate]: licensePlate,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
      activePage,
    } = this.state
    try {
      await confirmTransport({
        TRANSPORT_ID: this.state.checkedItems,
      })
      this.getData(licensePlate, transportProviderName, activePage, fromDate || 0, toDate || Date.now() / 1000)
    } catch (err) {
      console.log(err)
    }
  }

  // async getTransportProviderInfo(tpID) {
  //   const res = await getTransportProviderInfo(tpID)
  //   this.setState({
  //     ...this.state,
  //     [STRING.transportProviderName]: res.data.NAME,
  //     modal: {
  //       [STRING.licensePlate]: '',
  //       [STRING.transportType]: '',
  //       [STRING.transportProvider]: parseInt(this.props.tpID),
  //       [STRING.brand]: '',
  //       [STRING.weight]: '',
  //       [STRING.volume]: '',
  //       [STRING.route]: '',
  //     },
  //     transportProviderRoute: res.data.TRANSPORT_ROUTE,
  //     transportRoute: res.data.TRANSPORT_ROUTE,
  //   })
  // }

  setShow(bool, value = {}) {
    if (!value) {
      this.setState({
        transportRoute: [],
      })
    }

    this.setState({
      ...this.state,
      show: bool,
      modal: {
        [STRING.licensePlate]: value.LICENSE_PLATE || '',
        [STRING.brand]: value.BRAND || '',
        [STRING.weight]: value.WEIGHT || '',
        [STRING.volume]: value.VOLUME || '',
      },
      transportID: value.TRANSPORT_ID,
      editTransport: value.LICENSE_PLATE ? true : false,
    })
  }

  async createTransport(transport) {
    const { activePage } = this.state
    const createObj = {
      LICENSE_PLATE: transport.licensePlate,
      BRAND: transport.brand.trim(),
      DF_CAR_TYPE_ID: parseInt(transport.transportType),
      WEIGHT: parseInt(transport.weight),
      VOLUME: parseInt(transport.volume),
      TRANSPORT_PROVIDER_ID: parseInt(transport.transportProvider),
      ROUTE_ID: transport.route,
    }
    const updateObj = {
      TRANSPORT_ID: parseInt(transport.transportID),
      BRAND: transport.brand.trim(),
      DF_CAR_TYPE_ID: parseInt(transport.transportType),
      WEIGHT: parseInt(transport.weight),
      VOLUME: parseInt(transport.volume),
      TRANSPORT_PROVIDER_ID: parseInt(transport.transportProvider),
      ROUTE_ID: transport.route,
    }
    this.setState({
      loadingAction: true,
    })
    try {
      if (this.state.editTransport) {
        await updateTransport(updateObj)
      } else {
        await addTransport(createObj)
      }
      this.setShow(false)
      {
        !this.props.tpID
          ? this.props.getListTransportAction({
              SEARCH: '',
              TRANSPORT_PROVIDER_ID: '',
              SEARCH: '',
              PAGE: activePage,
              FROM_DATE: 0,
              TO_DATE: Date.now() / 1000,
            })
          : this.props.getListTransportAction({
              SEARCH: '',
              TRANSPORT_PROVIDER_ID: parseInt(this.props.tpID) || '',
              PAGE: 1,
              FROM_DATE: 0,
              TO_DATE: Date.now() / 1000,
            })
      }
      this.setState(
        {
          loadingAction: false,
        },
        () => notifySuccess(STRING.notifySuccess)
      )
    } catch (error) {
      this.setState(
        {
          loadingAction: false,
          err: error,
        },
        () => notifyFail(STRING.notifyFail)
      )
    }
  }
  //reset password
  // async resetPassword(phoneNumber) {
  //   const { activePage } = this.state
  //   this.setState({
  //     loadingAction: true,
  //   })
  //   try {
  //     await resetPassword({ PHONE: phoneNumber })
  //     this.setState({ confirmModal: false, loadingAction: false, show: false }, () =>
  //       notifySuccess(STRING.notifySuccess)
  //     )
  //     this.props.getListStaff({
  //       SEARCH: '',
  //       PAGE: activePage,
  //       FROM_DATE: 0,
  //       TO_DATE: Date.now() / 1000,
  //     })
  //   } catch (error) {
  //     this.setState(
  //       {
  //         confirmModal: false,
  //         loadingAction: false,
  //         err: error,
  //       },
  //       () => notifyFail(STRING.notifyFail)
  //     )
  //   }
  // }

  async deleteTransport() {
    const { activePage } = this.state
    this.setState({
      loadingAction: true,
    })
    try {
      await deleteTransport({
        TRANSPORT_ID: this.state.transportID,
      })
      {
        !this.props.tpID
          ? this.props.getListTransportAction({
              TRANSPORT_PROVIDER_ID: '',
              SEARCH: '',
              PAGE: activePage,
              FROM_DATE: 0,
              TO_DATE: Date.now() / 1000,
            })
          : this.props.getListTransportAction({
              TRANSPORT_PROVIDER_ID: parseInt(this.props.tpID) || '',
              SEARCH: '',
              PAGE: 1,
              FROM_DATE: 0,
              TO_DATE: Date.now() / 1000,
            })
      }
      this.setState(
        {
          loadingAction: false,
          confirmModal: false,
        },
        () => {
          this.props.deleteTransportAction(this.state.transportID)
          notifySuccess(STRING.notifySuccess)
        }
      )
    } catch (err) {
      console.log(err)
      this.setState(
        {
          loadingAction: false,
          confirmModal: false,
          err: err,
        },
        () => notifyFail(STRING.notifyFail)
      )
    }
  }

  handleChange(fieldName, value) {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber })
  }

  handleChangeFieldModal(fieldName, value) {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        [fieldName]: value || '',
      },
    })
  }

  handleKeyPress = (e) => {
    const {
      [STRING.license]: license,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      // [STRING.startPoint]: startPoint,
      // [STRING.endPoint]: endPoint
      [STRING.toDate]: toDate,
    } = this.state
    if (e.charCode === 13) {
      this.props.getListTransportAction({
        SEARCH: license.trim(),
        TRANSPORT_PROVIDER_ID: transportProviderName,
        PAGE: 1,
        FROM_DATE: new Date(fromDate).valueOf() / 1000 || 0,
        TO_DATE: new Date(toDate).setHours(24, 0, 0, 0) / 1000 || Date.now() / 1000,
      })
    }
  }

  renderField() {
    const {
      [STRING.license]: license,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
    } = this.state
    return (
      <Row className="m-0 p-0">
        <Col sm>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder={STRING.licensePlate}
            value={license}
            onChange={(e) => this.handleChange(STRING.license, e.target.value)}
            onKeyPress={this.handleKeyPress}
          />
        </Col>
        <Col sm>
          <FormControl
            as="select"
            aria-describedby="basic-addon1"
            value={transportProviderName}
            onChange={(e) => this.handleChange(STRING.transportProviderName, e.target.value)}
          >
            <option defaultValue value="">
              {STRING.all}
            </option>

            {this.props.transportProviderState?.data?.TRANSPORT_PROVIDER_LIST?.map((e, index) => (
              <option value={e.ID} key={index}>
                {e.NAME}
              </option>
            ))}
          </FormControl>
        </Col>

        <Col sm>
          <DatePickerCustom
            className={`date-picker form-control`}
            dateFormat="dd/MM/yyyy"
            placeholderText={STRING.fromDate}
            handleChange={this.handleChange}
            selected={fromDate}
            maxDate={toDate === null ? '' : new Date(toDate)}
          />
        </Col>
        <Col sm>
          <DatePickerCustom
            className={`date-picker form-control`}
            dateFormat="dd/MM/yyyy"
            placeholderText={STRING.toDate}
            handleChange={this.handleChange}
            selected={toDate}
            minDate={new Date(fromDate)}
          />
        </Col>
      </Row>
    )
  }

  renderBody() {
    return (
      <div className={!this.props.tpID ? 'content-wrapper' : ''}>
        {/* content Header */}
        <ToastCustom
          delay={2000}
          message={this.state.msg}
          clear={() => {
            this.setState({
              msg: '',
            })
          }}
        />
        <div className="content-header">
          {/* <div className="container"> */}
          {!this.props.tpID && <h2 className="header">Xe</h2>}
          {!this.props.tpID && this.renderField()}
          {this.renderButton()}
          {this.renderTable()}
          {this.renderModal()}
          {this.renderConfirmModal()}
          {/* </div> */}
        </div>
      </div>
    )
  }

  renderButton() {
    const user = this.props.userInfoState?.data?.data?.CURRENT_ROLE_ID
    const {
      [STRING.license]: license,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
      activePage,
      checkedItems,
    } = this.state
    return (
      <Row className="m-0 p-0">
        <Col className="button-wrapper">
          <Button
            variant="success"
            onClick={() => {
              //  function()
            }}
          >
            {STRING.search}
          </Button>
          <Button variant="primary" onClick={() => this.setShow(true)}>
            {STRING.add}
          </Button>
          <Button
            variant="danger"
            onClick={() => (!checkedItems.length ? alert(STRING.alertRequest) : this.rejectTransport())}
          >
            {STRING.reject}
          </Button>
          <Button
            variant="warning"
            onClick={() => (!checkedItems.length ? alert(STRING.alertRequest) : this.confirmTransport())}
          >
            {STRING.allow}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              // function()
              this.setState({
                [STRING.license]: '',
                [STRING.transportProviderName]: '',
                [STRING.fromDate]: '',
                [STRING.toDate]: '',
                checkedItems: [],
              })
            }
          >
            {STRING.clearSearch}
          </Button>
        </Col>
      </Row>
    )
  }

  renderTable() {
    const user = this.props.userInfoState?.data?.data?.CURRENT_ROLE_ID
    return (
      <table id="example2" className="table table-bordered table-striped table-responsive-sm table-responsive-md">
        <thead className="text-center bg-thead">
          <tr>
            <th>STT</th>
            <th>{STRING.licensePlate}</th>
            <th>{STRING.transportProviderName}</th>
            <th>{STRING.brand}</th>
            <th>{STRING.payloadCapacity}</th>
            <th>{STRING.route}</th>
            <th>{STRING.status}</th>
            <th>{STRING.createdDate}</th>
            {user == 2 && !this.props.tpID ? <th></th> : ''}
            <th></th>
          </tr>
        </thead>
        {this.renderTableData()}
      </table>
    )
  }

  renderTableData() {
    const user = this.props.userInfoState?.data?.data?.CURRENT_ROLE_ID
    // const { isLoading } = this.props.transportState
    // const { [STRING.transportProvider]: tpId } = this.state.modal
    // if (isLoading) {
    //   return (
    //     <tbody>
    //       <tr>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //         <td>Loading...</td>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //         <td></td>
    //       </tr>
    //     </tbody>
    //   )
    // }

    return (
      <tbody>
        {this.props.transportState.data?.TRANSPORT_LIST?.length ? (
          this.props.transportState.data?.TRANSPORT_LIST?.map((value, index) => (
            <tr key={index}>
              <td>{index + NUMBER.page_limit * (this.state.activePage - 1) + 1}</td>
              <td>{value.LICENSE_PLATE || '--'}</td>
              <td>{value.TRANSPORT_PROVIDER_NAME || '--'}</td>
              <td>{value.BRAND || '--'}</td>
              <td>{`${value.WEIGHT}kg (${value.VOLUME} ${STRING.standard})`}</td>
              <td>{`${value.START_POINT_NAME} - ${value.END_POINT_NAME}`}</td>
              <td>{value.STATUS}</td>
              <td>{toDateString(value.CREATED_DATE) || '--'}</td>
              {user == 2 && !this.props.tpID && value.STATUS_TYPE == 0 ? (
                <td>
                  {this.state.checkedItems.includes(value.TRANSPORT_ID) ? (
                    <i
                      className={!this.props.tpID && 'checkbox fas fa-check-square'}
                      onClick={() => {
                        let items = this.state.checkedItems
                        let index = items.indexOf(value.TRANSPORT_ID)
                        items.splice(index, 1)
                        this.setState({
                          ...this.state,
                          checkedItems: items,
                        })
                      }}
                    />
                  ) : (
                    <i
                      className={!this.props.tpID && 'checkbox far fa-square'}
                      onClick={() => {
                        let items = this.state.checkedItems
                        items.push(value.TRANSPORT_ID)
                        this.setState({
                          ...this.state,
                          checkedItems: items,
                        })
                      }}
                    />
                  )}
                </td>
              ) : user == 2 && !this.props.tpID ? (
                <td></td>
              ) : (
                ''
              )}
              <td className="with2btn">
                <Link to={ROUTER.TRANSPORT + '/' + value.TRANSPORT_ID}>
                  <i className="btnInfo fa fa-info-circle" />
                </Link>
                {user == 2 ? (
                  <i
                    className="btnEdit fa fa-fw fa-edit"
                    onClick={() => {
                      this.getTransportInfo(value.TRANSPORT_ID, value.TRANSPORT_PROVIDER_ID)
                      this.setShow(true, value)
                      this.setState({
                        disable: true,
                        transport_reset_pass: true,
                      })
                    }}
                  />
                ) : (
                  ''
                )}
                {user == 2 ? (
                  <i
                    className="btnDelete far fa-trash-alt"
                    onClick={async () => {
                      await this.setState({
                        transportID: value.TRANSPORT_ID,
                        confirmModal: true,
                        transport_reset_pass: false,
                      })
                    }}
                  />
                ) : (
                  ''
                )}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10">{STRING.emptyData}</td>
          </tr>
        )}
      </tbody>
    )
  }

  renderPagination() {
    const TOTAL_PAGE = this.props.transportState.data?.TOTAL_PAGE
    const {
      [STRING.license]: license,
      [STRING.transportProviderName]: transportProviderName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
    } = this.state
    return (
      <Pagination
        itemClass="page-item"
        linkClass="page-link"
        hideDisabled
        activePage={this.state.activePage}
        totalItemsCount={TOTAL_PAGE * NUMBER.page_limit}
        itemsCountPerPage={NUMBER.page_limit}
        pageRangeDisplayed={TOTAL_PAGE}
        hideNavigation
        onChange={(page) => {
          this.setState(
            {
              ...this.state,
              activePage: page,
            },
            () => {
              this.props.tpID
                ? this.getData(
                    '',
                    this.props.tpID,
                    page,
                    new Date(fromDate).valueOf() / 1000 || 0,
                    new Date(toDate).setHours(24, 0, 0, 0) / 1000 || new Date().setHours(24, 0, 0, 0) / 1000
                  )
                : this.props.getListTransportAction({
                    SEARCH: license.trim(),
                    TRANSPORT_PROVIDER_ID: parseInt(transportProviderName),
                    PAGE: page,
                    FROM_DATE: new Date(fromDate).valueOf() / 1000 || 0,
                    TO_DATE: new Date(toDate).setHours(24, 0, 0, 0) / 1000 || Date.now() / 1000,
                  })
            }
          )
        }}
      />
    )
  }

  checkValidationErrors() {
    const {
      [STRING.brand]: brandError,
      [STRING.licensePlate]: licensePlateError,
      [STRING.volume]: volumeError,
    } = this.state.validateError
    const {
      [STRING.licensePlate]: licensePlate,
      [STRING.brand]: brand,
      [STRING.transportType]: transportType,
      [STRING.weight]: weight,
      [STRING.volume]: volume,
      [STRING.transportProvider]: transportProvider,
      [STRING.route]: route,
    } = this.state.modal
    return (
      brandError ||
      licensePlateError ||
      volumeError ||
      !(licensePlate && brand && transportType && weight && volume && transportProvider && route)
    )
  }

  renderModal() {
    const { show, editTransport } = this.state
    return (
      <Modal
        show={show}
        onHide={() => this.setState({ disable: false, show: false, validateError: {} })}
        dialogClassName="modal-90w"
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <h5 style={{ color: 'white' }}>{!editTransport ? 'Thêm xe' : 'Sửa xe'}</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          {this.renderModalField(STRING.licensePlate)}
          {this.renderModalField(STRING.brand)}
          {this.renderModalField(STRING.transportType)}
          {this.renderModalField(STRING.weight)}
          {this.renderModalField(STRING.volume)}
          {this.renderModalField(STRING.transportProvider)}
          {this.renderModalField(STRING.route)}
          {this.renderModalButton()}
        </Modal.Body>
      </Modal>
    )
  }

  renderModalButton() {
    const {
      [STRING.licensePlate]: licensePlate,
      [STRING.brand]: brand,
      [STRING.transportType]: transportType,
      [STRING.weight]: weight,
      [STRING.volume]: volume,
      [STRING.transportProvider]: transportProvider,
      [STRING.route]: route,
    } = this.state.modal
    return (
      <Row>
        <Col className="button-wrapper">
          {this.state.editTransport && (
            <Button
              variant="warning"
              onClick={() => {
                this.setState({
                  confirmModal: true,
                })
              }}
            >
              Reset Mật khẩu
            </Button>
          )}
          <Button
            variant="success"
            disabled={this.checkValidationErrors()}
            onClick={() => {
              if (licensePlate == '') {
                notifyFail('Vui lòng nhập biển số xe')
              } else if (brand == '') {
                notifyFail('Vui lòng nhập hãng xe')
              } else if (transportType == '') {
                notifyFail('Vui lòng chọn loại vận chuyển')
              } else if (weight == '') {
                notifyFail('Vui lòng nhập khối lượng')
              } else if (volume == '') {
                notifyFail('Vui lòng nhập số kiện')
              } else if (transportProvider == '') {
                notifyFail('Vui lòng chọn nhà xe')
              } else if (route == '') {
                notifyFail('Vui lòng chọn tuyến xe')
              } else {
                this.createTransport({
                  transportID: this.state.transportID,
                  licensePlate,
                  brand,
                  // productionYear,
                  transportType,
                  weight,
                  volume,
                  transportProvider,
                  route,
                })
              }
            }}
          >
            {STRING.save}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              this.setShow(false)
            }}
          >
            {STRING.exit}
          </Button>
        </Col>
      </Row>
    )
  }

  renderModalField(fieldName) {
    const isEditable = this.state.editTransport
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    switch (fieldName) {
      case STRING.licensePlate:
        return (
          <Row>
            <Col className="modal-field" sm={4}>
              <span>{fieldName}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                disabled={isEditable}
                aria-describedby="basic-addon1"
                placeholder={`Nhập ${fieldName.toLowerCase()}`}
                onChange={(e) => this.handleChangeFieldModal(fieldName, e.target.value)}
                value={field}
                onBlur={() => {
                  validateForm(this, field, fieldName)
                }}
              />
              {fieldError && <span className="validation-error">{fieldError}</span>}
            </Col>
          </Row>
        )
      case STRING.transportType:
        return (
          <Row>
            <Col className="modal-field" sm={4}>
              <span>{fieldName}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                as="select"
                aria-describedby="basic-addon1"
                value={field}
                onChange={(e) => {
                  this.handleChangeFieldModal(STRING.transportType, e.target.value)
                }}
              >
                <option defaultValue value="">
                  {STRING.transportType}
                </option>
                {this.props.transportTypeState?.data?.map((carType, index) => (
                  <option value={carType.ID} key={index}>
                    {carType.CONTENT}
                  </option>
                ))}
              </FormControl>
            </Col>
          </Row>
        )
      case STRING.transportProvider:
        const { editTransport } = this.state
        return (
          <Row>
            <Col className="modal-field" sm={4}>
              <span>{fieldName}</span>
            </Col>
            <Col sm={8}>
              {!this.props.tpID ? (
                <FormControl
                  disabled={editTransport}
                  as="select"
                  aria-describedby="basic-addon1"
                  value={field}
                  onChange={(e) => {
                    this.handleChangeFieldModal(STRING.transportProvider, e.target.value)
                    this.getTransportRoute(e.target.value)
                  }}
                >
                  <option defaultValue value="">
                    {STRING.transportProvider}
                  </option>
                  {this.props.transportProviderState?.data?.TRANSPORT_PROVIDER_LIST?.map((provider, index) => (
                    <option value={provider.ID} key={index}>
                      {provider.NAME}
                    </option>
                  ))}
                </FormControl>
              ) : (
                <FormControl disabled as="select" aria-describedby="basic-addon1" value={this.props.tpID}>
                  {this.props.transportProviderState?.data?.TRANSPORT_PROVIDER_LIST?.map((provider, index) => (
                    <option value={provider.ID} key={index}>
                      {provider.NAME}
                    </option>
                  ))}
                </FormControl>
              )}
            </Col>
          </Row>
        )
      case STRING.route:
        return (
          <Row>
            <Col className="modal-field" sm={4}>
              <span>{fieldName}</span>
            </Col>
            <Col sm={8}>
              {!this.props.tpID ? (
                <FormControl
                  as="select"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    this.handleChangeFieldModal(STRING.route, e.target.value)
                  }}
                  value={field}
                >
                  <option value="" selected>
                    {STRING.route}
                  </option>
                  {this.state.transportRoute?.map((route) => (
                    <option value={route.ROUTE_ID}>
                      {route.START_POINT_NAME} - {route.END_POINT_NAME}
                    </option>
                  ))}
                </FormControl>
              ) : this.state.transportID ? (
                <FormControl
                  as="select"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    this.handleChangeFieldModal(STRING.route, e.target.value)
                  }}
                  value={field}
                >
                  <option value="" selected>
                    {STRING.route}
                  </option>
                  {this.state.transportRoute?.map((route) => (
                    <option value={route.ROUTE_ID}>
                      {route.START_POINT_NAME} - {route.END_POINT_NAME}
                    </option>
                  ))}
                </FormControl>
              ) : (
                <FormControl
                  as="select"
                  aria-describedby="basic-addon1"
                  onChange={(e) => {
                    this.handleChangeFieldModal(STRING.route, e.target.value)
                  }}
                  value={field}
                >
                  <option value="" selected>
                    {STRING.route}
                  </option>
                  {this.state.transportProviderRoute?.map((route) => (
                    <option value={route.ROUTE_ID}>
                      {route.ROUTE.START_POINT?.NAME} - {route.ROUTE.END_POINT?.NAME}
                    </option>
                  ))}
                </FormControl>
              )}
            </Col>
          </Row>
        )
      default:
        return (
          <Row>
            <Col className="modal-field" sm={4}>
              <span>{fieldName}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                aria-describedby="basic-addon1"
                placeholder={`Nhập ${fieldName.toLowerCase()}`}
                onChange={(e) => this.handleChangeFieldModal(fieldName, e.target.value)}
                value={field}
                onBlur={() => {
                  validateForm(this, field, fieldName)
                }}
              />
              {fieldError && <span className="validation-error">{fieldError}</span>}
            </Col>
          </Row>
        )
    }
  }

  renderConfirmModal() {
    const { confirmModal, transport_reset_pass } = this.state
    return (
      <Modal
        show={confirmModal}
        onHide={() =>
          this.setState({
            confirmModal: false,
          })
        }
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <h5 style={{ color: 'white' }}>Bạn chắc chắn muốn {!transport_reset_pass ? 'Xóa' : 'reset mật khẩu'} ?</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <Row>
            <Col className="button-wrapper">
              <Button
                variant="success"
                onClick={() => {
                  this.deleteTransport(this.state.transportID)
                }}
              >
                OK
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({
                    confirmModal: false,
                  })
                }}
              >
                {STRING.exit}
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    )
  }

  render() {
    const { isLoading, error, isDataLoaded } = this.props.transportState
    const { loadingAction } = this.state
    return (
      <>
        {/* {isDataLoaded && <Loading />}
        {isLoading && (!isDataLoaded ? <LoadingAction /> : null)}
        <Error isOpen={error} /> */}
        {this.renderBody()}
        {this.renderPagination()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  transportState: state.transportReducer,
  userInfoState: state.userReducer,
})

const mapDispatchToProps = {
  // getListTransportAction,
  // deleteTransportAction,
  // getListTransportProvider,
  // getListTransportType,
  // getUserInfoAction,
}

export default connect(mapStateToProps, mapDispatchToProps)(TransportScreen)
