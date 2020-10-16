import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import '@styles/Header.css'
import Cookie from 'js-cookie'
import { connect } from 'react-redux'
import { getMemberInfo, updateMember } from '@constants/Api'
import { getListMember } from '@src/redux/actions'
import { Button, Modal, Col, Row, FormControl } from 'react-bootstrap'
import { STRING, ROUTER } from '@constants/Constant'
import reactotron from 'reactotron-react-js'
import MultiSelect from 'react-multi-select-component'
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
        [STRING.name]: '',
        [STRING.phone]: '',
        [STRING.email]: '',
        [STRING.address]: '',
        [STRING.userType]: [],
      },
      memberId: '',
      USER_ID: '',
      roles: '',
      validateError: {
        [STRING.name]: '',
        [STRING.phone]: '',
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
    const res = await getMemberInfo()
    this.setState({
      USER_ID: res?.data?.USER_ID,
      user: res?.data,
    })
  }

  async updateMember(memberId) {
    const user = this.props.user
    this.setState({
      ...this.state.modal,
      USER_ID: user?.USER_ID,
      modal: {
        [STRING.name]: user?.NAME,
        [STRING.phone]: user?.USERNAME,
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

  async updateMember(fullname, phoneNumber, email, address, userType) {
    try {
      const user = {
        USER_ID: this.props.user?.ID,
        ROLE_ID: userType,
        NAME: fullname.trim(),
        PHONE: phoneNumber,
        EMAIL: email,
        ADDRESS: address.trim(),
      }
      await updateMember(user)
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
        [STRING.name]: res.NAME || '',
        [STRING.phone]: res.PHONE || '',
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
      memberId: user.USER_ID,
    })
  }

  logout() {
    Cookie.remove('SESSION_ID')
    window.location.href = '/Login'
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
    const { [STRING.phone]: phoneNumberError, [STRING.email]: emailError } = this.state.validateError
    const {
      [STRING.phone]: phoneNumber,
      [STRING.email]: email,
      [STRING.address]: address,
      [STRING.userType]: userType,
      [STRING.name]: fullname,
    } = this.state.modal
    return phoneNumberError || emailError || !(phoneNumber && email && address && userType.length !== 0 && fullname)
  }

  renderModalButton() {
    const {
      [STRING.username]: username,
      [STRING.phone]: phoneNumber,
      [STRING.email]: email,
      [STRING.address]: address,
      [STRING.userType]: userType,
      [STRING.name]: fullname,
    } = this.state.modal
    return (
      <Row>
        <Col className="button-wrapper">
          <Button
            variant="success"
            disabled={this.checkValidationErrors()}
            onClick={() => {
              this.updateMember(
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
    } else if (fieldName === STRING.phone) {
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
              [STRING.name]: null,
              [STRING.phone]: null,
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
          <h5 style={{ color: 'white' }}>Sửa thông tin</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          {/* {editUser == false &&
                    this.renderModalField(STRING.username)} */}
          {this.renderModalField(STRING.phone)}
          {this.renderModalField(STRING.name)}
          {this.renderModalField(STRING.email)}
          {this.renderModalField(STRING.address)}
          {this.renderModalField(STRING.userType)}
          {this.renderModalButton()}
        </Modal.Body>
      </Modal>
    )
  }

  render() {
    const { memberId, show, loadingAction, countBadge } = this.state
    const member = this.props.member
    return (
      <>
        {loadingAction && <LoadingAction />}
        {this.changePassword()}
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
            </li>
            {/* Dropdown Admin Menu */}
            <li className="nav-item dropdown">
              <a className="nav-link" data-toggle="dropdown" href="#">
                <p className="me-txt-menu">Xin chào {member?.name}</p>
              </a>
              <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right" style={{ width: '110%' }}>
                <a
                  className="dropdown-item cursor menu-hover"
                  onClick={() => this.setShow(true) && this.updateMember(memberId)}
                >
                  <div className="dropdown-admin-item ">
                    <p className="me-txt-admin-drop">Sửa thông tin</p>
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
  getListMember,
  // deleteMemberAction,
  // addMember,
  // updateMember,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
