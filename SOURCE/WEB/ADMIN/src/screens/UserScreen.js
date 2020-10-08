import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/UserScreen.css'
import { STRING, NUMBER } from '@constants/Constant'
import Pagination from 'react-js-pagination'
import MultiSelect from 'react-multi-select-component'
import { getListUser } from '@src/redux/actions'
import { connect } from 'react-redux'
import reactotron from 'reactotron-react-js'
import { toDateString } from '@src/utils/helper'
import { getUserRole, deleteUser, postCreateUser, updateUser, getUserDetail, requestGetUserInfo } from '@constants/Api'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'

class UserScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      USER_ID: '',
      [STRING.username]: '',
      [STRING.status]: '',
      [STRING.fromDate]: '',
      [STRING.toDate]: '',
      [STRING.status]: 1,
      activePage: 1,
      show: false,
      confirmModal: false,
      loadingAction: false,
      // isLoading: false,
      selected: [],
      modal: {
        [STRING.username]: '',
        [STRING.fullname]: '',
        [STRING.phoneNumber]: '',
        [STRING.email]: '',
        [STRING.address]: '',
        [STRING.userType]: [],
      },
      validateError: {
        [STRING.fullname]: '',
        [STRING.phoneNumber]: '',
        [STRING.email]: '',
        [STRING.address]: '',
        [STRING.userType]: [],
      },
      editUser: false,
      userId: '',
      // isLoadingData: true,
      error: null,
    }
    this.getData = this.getData.bind(this)
    this.renderModalField = this.renderModalField.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getData('', 1)
    // this.getUserRole()
    // this.getUser()
  }

  async getUser() {
    const res = await requestGetUserInfo()
    this.setState({
      USER_ID: res?.data?.USER_ID,
    })
  }
  async getUserRole() {
    try {
      const res = await getUserRole()
      let option = res.data.map((e) => ({
        label: e.CONTENT,
        value: e.VALUE,
      }))
      this.setState({
        ...this.state,
        selected: option,
      })
    } catch (err) {
      console.log(err)
    }
  }

  getData(search, page, fromDate, toDate) {
    //api
  }

  // async createUser(fullname, phoneNumber, email, address, userType) {
  //   const user = {
  //     ROLE_ID: userType,
  //     NAME: fullname.trim(),
  //     PHONE: phoneNumber,
  //     EMAIL: email,
  //     ADDRESS: address.trim(),
  //   }
  //   this.setState({
  //     loadingAction: true,
  //   })
  //   try {
  //     if (this.state.editUser) {
  //       await updateUser(user)
  //     } else {
  //       await postCreateUser(user)
  //     }

  //     this.setState({ show: false, loadingAction: false }, () => {
  //       notifySuccess(STRING.notifySuccess)
  //       this.props.getListUser({
  //         SEARCH: '',
  //         PAGE: 1,
  //         FROM_DATE: 0,
  //         TO_DATE: Date.now() / 1000,
  //       })
  //     })
  //   } catch (error) {
  //     this.setState(
  //       {
  //         loadingAction: false,
  //         error: error,
  //       },
  //       () => notifyFail(STRING.notifyFail)
  //     )
  //   }
  // }

  // async deleteUser() {
  //   const { USER_ID } = this.state
  //   if (USER_ID !== this.state.userId) {
  //     this.setState({
  //       loadingAction: true,
  //     })
  //     try {
  //       await deleteUser({
  //         USER_ID: this.state.userId,
  //       })
  //       this.props.getListUser({
  //         SEARCH: '',
  //         PAGE: 1,
  //         FROM_DATE: 0,
  //         TO_DATE: Date.now() / 1000,
  //       })
  //       this.setState(
  //         {
  //           loadingAction: false,
  //           confirmModal: false,
  //         },
  //         () => notifySuccess(STRING.notifySuccess)
  //       )
  //     } catch (err) {
  //       this.setState(
  //         {
  //           loadingAction: false,
  //           confirmModal: false,
  //           error: err,
  //         },
  //         () => notifyFail(STRING.notifyFail)
  //       )
  //       console.log(err)
  //     }
  //   } else {
  //     alert('Tài khoản đang đăng nhập, không thể xóa !')
  //     this.setState({
  //       confirmModal: false,
  //     })
  //   }
  // }

  handleChange(fieldName, value) {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  handleKeyPress = (e) => {
    const { [STRING.username]: username, [STRING.fromDate]: fromDate, [STRING.toDate]: toDate } = this.state
    if (e.charCode === 13) {
      this.props.getListUser({
        SEARCH: username,
        PAGE: 1,
        FROM_DATE: new Date(fromDate).valueOf() / 1000 || 0,
        TO_DATE: new Date(toDate).setHours(24, 0, 0, 0) / 1000 || Date.now() / 1000,
      })
    }
  }

  async setShow(bool, user = {}) {
    let res = user
    if (user.ID) {
      const USER_ID = user.ID
      const rem = await getUserDetail({ USER_ID })
      res = rem.data
    }
    this.setState({
      ...this.state,
      show: bool,
      modal: {
        [STRING.fullname]: res.NAME || '',
        [STRING.phoneNumber]: res.PHONE || '',
        [STRING.email]: res.EMAIL || '',
        [STRING.address]: res.ADDRESS || '',
        [STRING.userType]: user.USER_ROLE
          ? user.USER_ROLE.map((e) => ({
              label: e.ROLE_NAME,
              value: e.ROLE_ID,
            }))
          : [],
      },
      editUser: user.PHONE ? true : false,
      userId: user.USER_ID,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ activePage: pageNumber })
  }
  renderField() {
    const { [STRING.username]: username, [STRING.fromDate]: fromDate, [STRING.toDate]: toDate } = this.state
    return (
      <Row className="mx-0">
        <Col sm>
          <input
            onKeyPress={this.handleKeyPress}
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            placeholder={STRING.username}
            value={username}
            onChange={(e) => this.handleChange(STRING.username, e.target.value)}
          />
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
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-2">
              <div className="col-sm-6">
                <h1 className="header">Người dùng</h1>
              </div>
            </div>
          </div>
          {this.renderField()}
          {this.renderButton()}
          {this.renderTable()}
          {/* {this.renderPagination()} */}
          {this.renderModal()}
          {this.renderConfirmModal()}
        </div>
      </div>
    )
  }

  renderButton() {
    const { [STRING.username]: username, [STRING.fromDate]: fromDate, [STRING.toDate]: toDate, activePage } = this.state
    return (
      <Row className="mx-0">
        <Col className="button-wrapper">
          <Button
            variant="success"
            onClick={() => {
              // function()
            }}
          >
            {STRING.search}
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              this.setShow(true)
            }}
          >
            {STRING.add}
          </Button>
          <Button
            variant="secondary"
            onClick={() =>
              // funtion()
              this.setState({
                [STRING.username]: '',
                [STRING.fromDate]: '',
                [STRING.toDate]: '',
              })
            }
          >
            {STRING.clearSearch}
          </Button>
        </Col>
      </Row>
    )
  }

  renderTableData() {
    // const { isLoading } = this.props?.listUserState
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
        {this.props.listUserState?.data?.LIST_USER?.length ? (
          this.props.listUserState?.data?.LIST_USER?.map((value, index) => (
            <tr key={index}>
              <td>{index + NUMBER.page_limit * (this.state.activePage - 1) + 1}</td>
              <td>{value.NAME || '--'}</td>
              <td>{value.PHONE || '--'}</td>
              <td>
                {value.USER_ROLE?.map((item, index) => (
                  <a key={index}>{`${item.ROLE_NAME}${value.USER_ROLE?.length - 1 !== index ? ', ' : ''}`}</a>
                )) || '--'}
              </td>
              <td>{toDateString(value.CREATED_DATE) || '--'}</td>
              <td className="width2btn">
                <i
                  className="btnEdit fa fa-fw fa-edit"
                  onClick={() => {
                    this.setShow(true, value)
                  }}
                />
                <i
                  className="btnDelete far fa-trash-alt"
                  onClick={() => {
                    this.setState({
                      userId: value.ID,
                      confirmModal: true,
                    })
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr className="text-center">
            <td colSpan={12}>{STRING.emptyData}</td>
          </tr>
        )}
      </tbody>
    )
  }

  renderTable() {
    return (
      <table id="example2" className="table table-bordered table-striped  table-responsive-sm table-responsive-md">
        <thead className="text-center">
          <tr>
            <th>STT</th>
            <th>{STRING.fullname}</th>
            <th>{STRING.phoneNumber}</th>
            <th>{STRING.group}</th>
            <th>{STRING.createdDate}</th>
            <th></th>
          </tr>
        </thead>
        {this.renderTableData()}
      </table>
    )
  }

  renderPagination() {
    const { TOTAL_PAGE } = this.props.listUserState.data
    const { [STRING.username]: username, [STRING.fromDate]: fromDate, [STRING.toDate]: toDate } = this.state
    return (
      <Pagination
        itemClass="page-item"
        linkClass="page-link"
        hideDisabled
        activePage={this.state.activePage}
        totalItemsCount={TOTAL_PAGE * NUMBER.page_limit}
        itemsCountPerPage={NUMBER.page_limit}
        pageRangeDisplayed={5}
        hideNavigation
        hideFirstLastPages
        onChange={(page) => {
          this.setState({
            ...this.state,
            activePage: page,
          })
          this.getData(
            username,
            page,
            new Date(fromDate).valueOf() / 1000 || 0,
            new Date(toDate).setHours(24, 0, 0, 0) / 1000 || Date.now() / 1000
          )
        }}
      />
    )
  }

  checkValidationErrors() {
    const {
      [STRING.phoneNumber]: phoneNumberError,
      [STRING.email]: emailError,
      [STRING.fullname]: fullNameError,
      [STRING.address]: addressError,
    } = this.state.validateError
    const {
      [STRING.phoneNumber]: phoneNumber,
      [STRING.email]: email,
      [STRING.address]: address,
      [STRING.userType]: userType,
      [STRING.fullname]: fullname,
    } = this.state.modal
    return (
      phoneNumberError ||
      emailError ||
      fullNameError ||
      addressError ||
      !(phoneNumber && email && address && userType.length !== 0 && fullname)
    )
  }

  renderModalButton() {
    const {
      [STRING.phoneNumber]: phoneNumber,
      [STRING.email]: email,
      [STRING.address]: address,
      [STRING.userType]: userType,
      [STRING.fullname]: fullname,
    } = this.state.modal
    return (
      <Row>
        <Col className="button-wrapper">
          <Button
            variant="success"
            disabled={this.checkValidationErrors()}
            onClick={() => {
              this.createUser(
                fullname,
                phoneNumber,
                email,
                address,
                userType.map((e) => e.value)
              )
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
    const isEditable = this.state.editUser
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.userType) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <MultiSelect
              options={this.state.selected}
              value={field}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  modal: {
                    ...this.state.modal,
                    [fieldName]: e,
                  },
                })
              }}
              hasSelectAll={false}
              disableSearch
              overrideStrings={{
                allItemsAreSelected: 'Tất cả',
                selectSomeItems: fieldName,
              }}
            />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.phoneNumber) {
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
              onChange={(e) => {
                validateForm(this, field, fieldName)
                this.setState({
                  ...this.state,
                  modal: {
                    ...this.state.modal,
                    [fieldName]: e.target.value.trim(),
                  },
                })
              }}
              value={field}
              onBlur={() => {
                validateForm(this, field, fieldName)
              }}
            />
            {fieldError && <span className="validation-error align-top">{fieldError}</span>}
          </Col>
        </Row>
      )
    } else {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <FormControl
              aria-describedby="basic-addon1"
              placeholder={`Nhập ${fieldName.toLowerCase()}`}
              onChange={(e) => {
                validateForm(this, field, fieldName)
                this.setState({
                  ...this.state,
                  modal: {
                    ...this.state.modal,
                    [fieldName]: e.target.value,
                  },
                })
              }}
              value={field}
              onBlur={() => {
                // console.log(this.state.validateError)
                validateForm(this, field.trim(), fieldName)
              }}
            />
            {fieldError && <span className="validation-error">{fieldError}</span>}
          </Col>
        </Row>
      )
    }
  }

  renderModal() {
    const { show, editUser } = this.state
    return (
      <Modal
        show={show}
        onHide={() => {
          this.setShow(false)
          this.setState({
            validateError: {
              // [STRING.username]: null,
              [STRING.fullname]: null,
              [STRING.phoneNumber]: null,
              [STRING.email]: null,
              [STRING.address]: null,
              [STRING.userType]: [],
            },
          })
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <h5 style={{ color: 'white' }}>{!editUser ? 'Thêm người dùng' : 'Sửa người dùng'}</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          {/* {editUser == false &&
                        this.renderModalField(STRING.username)} */}
          {this.renderModalField(STRING.phoneNumber)}
          {this.renderModalField(STRING.fullname)}
          {this.renderModalField(STRING.email)}
          {this.renderModalField(STRING.address)}
          {this.renderModalField(STRING.userType)}
          {this.renderModalButton()}
        </Modal.Body>
      </Modal>
    )
  }

  renderConfirmModal() {
    const { confirmModal } = this.state
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
          <h5 style={{ color: 'white' }}>Bạn chắc chắn muốn xóa ?</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <Row>
            <Col className="button-wrapper">
              <Button
                variant="success"
                onClick={() => {
                  this.deleteUser(this.state.userId)
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
    // const { error, isLoading, isDataLoaded } = this.props.listUserState
    const { loadingAction } = this.state
    return (
      <>
        {/* {isDataLoaded && <Loading />}
        {isLoading && (!isDataLoaded ? <LoadingAction /> : null)} */}
        {/* <Error isOpen={error} /> */}
        {this.renderBody()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  listUserState: state.listUserReducer,
})

const mapDispatchToProps = {
  // getListUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
