import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import '@styles/Header.css'
import Cookie from 'js-cookie'
import { connect } from 'react-redux'
import { requestGetUserInfo, updateUser } from '@constants/Api'
import { getListUser } from '@src/redux/actions'
import { Button, Modal, Col, Row, FormControl } from 'react-bootstrap'
import { STRING, ROUTER } from '@constants/Constant'
import reactotron from 'reactotron-react-js'
import MultiSelect from 'react-multi-select-component'
import Notification from '@src/components/Notification'
import { validateForm } from '@src/utils/helper'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import { toDateString } from '@src/utils/helper'

class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      [STRING.changePassword]: '',
      [STRING.changeRole]: '',
      user: {},
      showModal: false,
      showModalNoti: false,
      show: false,
      editPassword: false,
      editUser: false,
      isOpenNotify: false,
      selected: [],
      notification: [],
      countBadge: 0,
      modal: {
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        [STRING.username]: '',
        [STRING.fullname]: '',
        [STRING.phoneNumber]: '',
        [STRING.email]: '',
        [STRING.address]: '',
        [STRING.userType]: [],
      },
      userId: '',
      USER_ID: '',
      roles: '',
      validateError: {
        [STRING.fullname]: '',
        [STRING.phoneNumber]: '',
        [STRING.email]: '',
        [STRING.address]: '',
        [STRING.userType]: [],
        loadingAction: false,
      },
    }
  }

  async componentDidMount() {
    // this.getUserInfo(),
    // this.getListNotification()
    // this.getUser()
  }

  async getUser() {
    const res = await requestGetUserInfo()
    this.setState({
      USER_ID: res?.data?.USER_ID,
      user: res?.data,
    })
  }

  async updateUserInfo(userId) {
    const user = this.props.user
    this.setState({
      ...this.state.modal,
      USER_ID: user?.USER_ID,
      modal: {
        [STRING.fullname]: user?.NAME,
        [STRING.phoneNumber]: user?.USERNAME,
        [STRING.email]: user?.EMAIL,
        [STRING.address]: user?.ADDRESS,
        [STRING.userType]: user?.ROLE?.map((e) => ({
          label: e.ROLE_NAME,
          value: e.ROLE_ID,
        })),
      },
    })
  }

  refreshPage() {
    window.location.reload(false)
  }

  checkValueEmpty = () => {
    const { currentPassword, newPassword, confirmNewPassword } = this.state.modal
    if (currentPassword === '' || newPassword === '' || confirmNewPassword === '') {
      return true
    }
    return false
  }

  async updateUser(fullname, phoneNumber, email, address, userType) {
    try {
      const user = {
        USER_ID: this.props.user?.ID,
        ROLE_ID: userType,
        NAME: fullname.trim(),
        PHONE: phoneNumber,
        EMAIL: email,
        ADDRESS: address.trim(),
      }
      await updateUser(user)
      // this.setShow(false)
      this.refreshPage()
    } catch (error) {
      reactotron.log(error)
    }
  }

  setShowModal = (bool) => {
    this.setState({
      showModal: bool,
    })
  }

  async setShow(bool, user = {}) {
    let res = user

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

  logout() {
    Cookie.remove('SESSION_ID')
    window.location.href = '/login'
  }

  changePassword = () => {
    const { showModal } = this.state
    return (
      <Modal show={showModal} onHide={() => this.setShowModal(false)} dialogClassName="modal-90w" centered>
        <Modal.Header closeButton>
          <h5 style={{ color: 'white' }}>{STRING.changePassword}</h5>
        </Modal.Header>

        <Modal.Body className="custom-body">
          <Row>
            <Col className="modal-field" sm={4}>
              <span>Nhập {STRING.password}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                type="password"
                id="oldPassword"
                maxLength={20}
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    modal: {
                      ...this.state.modal,
                      currentPassword: e.target.value,
                    },
                  })
                }}
                value={this.state.modal.currentPassword}
              ></FormControl>
            </Col>
          </Row>

          <Row>
            <Col className="modal-field" sm={4}>
              <span>Nhập {STRING.newPassword}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                maxLength={20}
                type="password"
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    modal: {
                      ...this.state.modal,
                      newPassword: e.target.value,
                    },
                  })
                }}
                value={this.state.modal.newPassword}
              ></FormControl>
            </Col>
          </Row>
          <Row>
            <Col className="modal-field" sm={4}>
              <span>Xác nhận {STRING.newPassword}</span>
            </Col>
            <Col sm={8}>
              <FormControl
                maxLength={20}
                type="password"
                onChange={(e) => {
                  this.setState({
                    ...this.state,
                    modal: {
                      ...this.state.modal,
                      confirmNewPassword: e.target.value,
                    },
                  })
                }}
                value={this.state.modal.confirmNewPassword}
              ></FormControl>
            </Col>
          </Row>
          <Row sm={4} style={{ justifyContent: 'center', marginLeft: 30 }}>
            <Button variant="success" onClick={() => this.saveAndChangePass()} disabled={this.checkValueEmpty()}>
              Lưu
            </Button>
          </Row>
        </Modal.Body>
      </Modal>
    )
  }

  checkValidationErrors() {
    const { [STRING.phoneNumber]: phoneNumberError, [STRING.email]: emailError } = this.state.validateError
    const {
      [STRING.phoneNumber]: phoneNumber,
      [STRING.email]: email,
      [STRING.address]: address,
      [STRING.userType]: userType,
      [STRING.fullname]: fullname,
    } = this.state.modal
    return phoneNumberError || emailError || !(phoneNumber && email && address && userType.length !== 0 && fullname)
  }

  renderModalButton() {
    const {
      [STRING.username]: username,
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
              this.updateUser(
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
              disabled={true}
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
            {fieldError && <span className="validation-error">{fieldError}</span>}
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
                validateForm(this, field, fieldName)
              }}
            />
            {fieldError && <span className="validation-error">{fieldError}</span>}
          </Col>
        </Row>
      )
    }
  }
  // hiển thị modal cập nhật
  renderModalChangeInfor = () => {
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
          <h5 style={{ color: 'white' }}>Cập nhật thông tin</h5>
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

  handleRouterNoti = (TYPE_NOTI, data) => {
    switch (TYPE_NOTI) {
      case 1:
        return ROUTER.HOME
      case 2:
        return ROUTER.INFOR
      case 3:
        return ROUTER.intro
      case 6:
        return ROUTER.TRANSPORT + '/' + data?.TRANSPORT?.ID
      case 13:
        return ROUTER.DRIVER + '/' + data?.DRIVER?.USER_ID
      default:
        return ROUTER.OVERVIEW
    }
  }

  //modal notification
  renderModalNotification = () => {
    const { showModalNoti, notification } = this.state
    if (notification) {
      return (
        <Modal
          show={showModalNoti}
          onHide={() => {
            this.setState({ showModalNoti: false })
          }}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Header closeButton>
            <h5 style={{ color: 'white' }}>{STRING.noti}</h5>
          </Modal.Header>
          <Modal.Body className="custom-body pt-0 px-4" style={{ overflow: 'auto', height: '500px' }}>
            {notification?.map((item, index) =>
              item?.IS_READ == 0 ? (
                <Link
                  to={this.handleRouterNoti(item.DF_NOTI_TYPE_ID, item.DATA)}
                  style={{ textDecoration: 'none', color: 'black' }}
                  key={index}
                >
                  <div
                    key={index}
                    style={{
                      borderBottom: '1.5px solid #dcdfe3',
                      cursor: 'pointer',
                      backgroundColor: '#ECF3FF',
                    }}
                    className="row px-2 py-2 hover-noti"
                    onClick={() => {
                      this.readNoti(item.ID)
                      this.setState({ showModalNoti: false })
                    }}
                  >
                    <div className="col-1 d-flex justify-content-between px-0" style={{ flexDirection: 'column' }}>
                      <i className="fas fa-bell float-left" style={{ fontSize: '20px', color: '#ff9f43' }}></i>
                      <i className="far fa-clock" style={{ paddingBottom: '4px' }}></i>
                    </div>
                    <div
                      className="col-11 text-left px-0  d-flex justify-content-between ml-0"
                      style={{ flexDirection: 'column' }}
                    >
                      <span>{item.CONTENT}</span>
                      <span>
                        {`${new Date(item.CREATED_DATE).toLocaleTimeString('en-US')} ${'-'} ${toDateString(
                          item.CREATED_DATE
                        )}` || '--'}
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <Link
                  key={index}
                  to={this.handleRouterNoti(item.DF_NOTI_TYPE_ID, item.DATA)}
                  style={{
                    textDecoration: 'none',
                    color: 'black',
                  }}
                >
                  <div
                    key={index}
                    style={{
                      borderBottom: '1.5px solid #dcdfe3',
                      cursor: 'pointer',
                      backgroundColor: 'white',
                    }}
                    className="row px-2 py-2 hover-noti"
                    onClick={() => this.setState({ showModalNoti: false })}
                  >
                    <div className="col-1 d-flex justify-content-between px-0 " style={{ flexDirection: 'column' }}>
                      <i className="fas fa-bell float-left" style={{ fontSize: '20px', color: '#ff9f43' }}></i>
                      <i className="far fa-clock" style={{ paddingBottom: '4px' }}></i>
                    </div>
                    <div
                      className="col-11 text-left px-0  d-flex justify-content-between ml-0"
                      style={{ flexDirection: 'column' }}
                    >
                      <span>{item.CONTENT}</span>
                      <span>
                        {`${new Date(item.CREATED_DATE).toLocaleTimeString('en-US')} ${'-'} ${toDateString(
                          item.CREATED_DATE
                        )}` || '--'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            )}

            {notification.length == 0 && <p className="mt-3">Chưa có thông báo!</p>}
          </Modal.Body>
        </Modal>
      )
    }
  }
  render() {
    const { userId, show, loadingAction, countBadge } = this.state
    const user = this.props.user
    return (
      <>
        {loadingAction && <LoadingAction />}
        {this.changePassword()}
        {this.renderModalNotification()}
        {this.renderModalChangeInfor()}
        <nav className="main-header navbar navbar-expand navbar-light me-header">
          {/* Left navbar links */}
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link cursor" data-widget="pushmenu">
                <i className="fas fa-bars" />
              </a>
            </li>
          </ul>
          {/* Right navbar links */}
          <ul className="navbar-nav ml-auto">
            {/* Notifications Dropdown Menu */}
            <li className="nav-item dropdown" onClick={() => this.setState({ showModalNoti: true })}>
              {/* <a className="nav-link" href="#">
                {countBadge !== 0 ? (
                  <Badge badgeContent={countBadge} color="error">
                    <i className="fas fa-bell " style={{ fontSize: '20px' }} />
                  </Badge>
                ) : (
                  <i className="fas fa-bell" style={{ fontSize: '20px' }} />
                )}
              </a> */}
            </li>
            {/* Dropdown Admin Menu */}
            <li className="nav-item dropdown">
              <a className="nav-link" data-toggle="dropdown" href="#">
                <p className="me-txt-menu">Xin chào {user?.NAME} !</p>
              </a>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{ width: '110%' }}>
                {user?.ROLE?.length == 2 ? (
                  <div>
                    {user?.CURRENT_ROLE_ID == 10 ? (
                      <Link to={ROUTER.OVERVIEW} className="text-decoration-none menu-hover">
                        <span className="dropdown-item cursor menu-hover" onClick={this.saveChangeRole}>
                          <div className="dropdown-admin-item">
                            <p className="me-txt-admin-drop">Quyền admin</p>
                          </div>
                        </span>
                      </Link>
                    ) : (
                      <Link to={ROUTER.OVERVIEW} className="text-decoration-none ">
                        <span className="dropdown-item cursor menu-hover" onClick={this.saveChangeRole}>
                          <div className="dropdown-admin-item">
                            <p className="me-txt-admin-drop">Quyền CSKH</p>
                          </div>
                        </span>
                      </Link>
                    )}
                  </div>
                ) : (
                  ''
                )}
                <a
                  className="dropdown-item cursor menu-hover"
                  onClick={() => this.setShow(true) && this.updateUserInfo(userId)}
                >
                  <div className="dropdown-admin-item ">
                    <p className="me-txt-admin-drop">Cập nhật thông tin</p>
                  </div>
                </a>
                <a className="dropdown-item cursor menu-hover" onClick={() => this.setShowModal(true)}>
                  <div className="dropdown-admin-item">
                    <p className="me-txt-admin-drop">Đổi mật khẩu</p>
                  </div>
                </a>
                <a className="dropdown-item cursor menu-hover" onClick={this.logout}>
                  <div className="dropdown-admin-item">
                    <p className="me-txt-admin-drop">Đăng xuất</p>
                  </div>
                </a>
              </div>
            </li>
          </ul>
        </nav>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  // listUserState: state.listUserReducer,
})

const mapDispatchToProps = {
  getListUser,
  // deleteUserAction,
  // addUser,
  // updateUser,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
