import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/ReaderScreen.css'
import '@styles/hover.css'
import {
  STRING,
  NUMBER,
  IS_ACTIVE,
  CONFIG,
  ROLE,
  STATUS,
  LIST_STATUS,
  LIST_DOB_MONTH,
  LIST_ORDER_BY_MEMBER,
} from '@constants/Constant'
import Pagination from 'react-js-pagination'
import MultiSelect from 'react-multi-select-component'
import { getListReader } from '@src/redux/actions'
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { deleteReader, createReader, updateReader, getReaderInfo } from '@constants/Api'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js'

class ReaderScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberId: '',
      account: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      page: 1,
      limit: CONFIG.LIMIT,
      text: '',
      status: '',
      orderBy: '',
      cardNumber: '',
      totalCount: '',

      modalTitle: '',
      show: false,
      confirmModal: false,
      loadingAction: false,
      listStatus: LIST_STATUS,
      listDobMonth: LIST_DOB_MONTH,
      listOrderByMember: LIST_ORDER_BY_MEMBER,
      modal: {
        account: '',
        name: '',
        phone: '',
        email: '',
        address: '',
      },
      validateError: {
        account: '',
        name: '',
        phone: '',
        address: '',
      },
      isEditReader: false,
      id: '',
      error: null,
    }
    this.getData = this.getData.bind(this)
    this.renderModalField = this.renderModalField.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getData({})
  }

  async getReaderInfo() {
    const res = await getReaderInfo()
    this.setState({
      memberId: res?.data?.id,
    })
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const { limit, text, status, orderBy, cardNumber } = this.state
    try {
      await this.props.getListReader({
        page: page || 1,
        limit: limit || CONFIG.LIMIT,
        text: text?.trim() || '',
        status: status || '',
        orderBy: orderBy || '',
        cardNumber: cardNumber || '',
      })

      this.setState({
        loadingAction: false,
      })
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async createReader(account, name, phone, email, address, role) {
    const member = {
      account,
      name,
      phone,
      email,
      address,
      role,
    }
    this.setState({
      loadingAction: true,
    })
    try {
      if (this.state.isEditReader) {
        await updateReader(member)
      } else {
        await createReader(member)
      }

      this.setState({ show: false, loadingAction: false }, () => {
        notifySuccess(STRING.notifySuccess)
        this.getData({})
      })
    } catch (error) {
      this.setState(
        {
          loadingAction: false,
          error: error,
        },
        () => notifyFail(STRING.notifyFail)
      )
    }
  }

  async deleteReader() {
    const { memberId } = this.state
    if (memberId !== this.state.id) {
      this.setState({ loadingAction: true })
      try {
        await deleteReader({
          id: this.state.id,
        })
        this.getData({})
        this.setState(
          {
            loadingAction: false,
            confirmModal: false,
          },
          () => notifySuccess(STRING.notifySuccess)
        )
      } catch (err) {
        this.setState(
          {
            loadingAction: false,
            confirmModal: false,
            error: err,
          },
          () => notifyFail(STRING.notifyFail)
        )
        console.log(err)
      }
    } else {
      swal('Tài khoản đang đăng nhập, không thể xóa')
      this.setState({
        confirmModal: false,
      })
    }
  }

  handleChange(fieldName, value) {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  handleChangeSelect = async (fieldName, value) => {
    await this.setState({
      ...this.state,
      page: 1,
      [fieldName]: value || '',
    })
    this.getData({})
  }

  handleKeyPress = (e) => {
    if (e.charCode === 13) {
      this.getData({})
    }
  }

  async setShow(bool, member = {}) {
    let res = member
    if (member.id) {
      const id = member.id
      // const rem = await getMemberInfo({ id })
      // res = rem.data
    }
    this.setState({
      ...this.state,
      show: bool,
      modal: {
        name: res.name || '',
        phone: res.phone || '',
        email: res.email || '',
        address: res.address || '',
      },
      isEditReader: member.phone ? true : false,
      id: member.id,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { page, limit, text, status, orderBy, dobMonth, listStatus, listDobMonth, listOrderByMember } = this.state
    return (
      <Row className="mx-0">
        <Col className="col-md-5 col-sm-8">
          <input
            onKeyPress={this.handleKeyPress}
            type="text"
            className="form-control mb-0"
            id="exampleInputEmail1"
            placeholder="Nhập từ khóa"
            value={text}
            onChange={(e) => this.handleChange('text', e.target.value)}
          />
        </Col>
        <Col className="col-md-3 col-sm-4">
          <FormControl
            as="select"
            className="mb-0"
            value={orderBy}
            onChange={(e) => this.handleChangeSelect('orderBy', e.target.value)}
          >
            <option value="" defaultValue>
              {STRING.orderBy}
            </option>
            {listOrderByMember?.map((item, index) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </FormControl>
        </Col>
        <Col className="col-md-2 col-sm-4">
          <FormControl
            as="select"
            className="mb-0"
            value={dobMonth}
            onChange={(e) => this.handleChangeSelect('dobMonth', e.target.value)}
          >
            <option value="" defaultValue>
              {STRING.dob}
            </option>
            {listDobMonth?.map((item, index) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </FormControl>
        </Col>
        <Col className="col-md-2 col-sm-4">
          <FormControl
            as="select"
            className="mb-0"
            value={status}
            onChange={(e) => this.handleChangeSelect('status', e.target.value)}
          >
            <option value="" defaultValue>
              {STRING.status}
            </option>
            {listStatus?.map((item, index) => (
              <option value={item.value} key={index}>
                {item.label}
              </option>
            ))}
          </FormControl>
        </Col>
      </Row>
    )
  }

  renderBody() {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row my-2">
              <div className="col-md-4 col-sm-4">
                <h1 className="text-header-screen">
                  {STRING.reader}
                  {this.props.listReaderState?.data?.data?.totalCount
                    ? ' - ' + this.props.listReaderState?.data?.data?.totalCount
                    : ''}
                </h1>
              </div>
              <div className="col-md-8 col-sm-8">{this.renderButton()}</div>
            </div>
            <div className="col-md-12 my-2 bg-table">
              {this.renderField()}
              {this.renderTable()}
              {this.renderPagination()}
            </div>
          </div>

          {this.renderModal()}
          {this.renderConfirmModal()}
        </div>
      </div>
    )
  }

  renderButton() {
    return (
      <Row className="mx-0">
        <Col className="button-wrapper px-0">
          <Button
            className="mr-0 ml-2"
            variant="success"
            onClick={() => {
              this.setState({
                modalTitle: 'Thêm bạn đọc',
                show: true,
              })
            }}
          >
            {STRING.add}
          </Button>
          <Button
            className="mr-0 ml-2"
            variant="primary"
            onClick={() => {
              this.getData({})
            }}
          >
            {STRING.search}
          </Button>
          <Button
            className="mr-0 ml-2"
            variant="secondary"
            onClick={() =>
              this.setState(
                {
                  text: '',
                  status: '',
                  orderBy: '',
                  dobMonth: '',
                },
                () => this.getData({})
              )
            }
          >
            {STRING.clearSearch}
          </Button>
        </Col>
      </Row>
    )
  }

  renderTableData() {
    return (
      <tbody>
        {this.props.listReaderState?.data?.data?.items?.length ? (
          this.props.listReaderState?.data?.data?.items?.map((value, index) => (
            <tr key={index}>
              <td>{index + CONFIG.LIMIT * (this.state.page - 1) + 1}</td>
              <td>{value.account || '--'}</td>
              <td
                className={
                  'hvr-rotate cursor-pointer text-table-hover ' +
                  (parseInt(value.status) === 1 ? 'color-tvdl' : 'text-danger')
                }
              >
                {value.name || '--'}
              </td>
              <td>{value.phone || '--'}</td>
              <td>{value.email || '--'}</td>
              <td>{value.address || '--'}</td>
              <td>{toDateString(value.dob) || '--'}</td>
              <td>{value.joinedDate ? toDateString(value.joinedDate) : '--'}</td>
              {/* <td>{parseInt(value.status) === 1 ? STATUS.ACTIVE : STATUS.INACTIVE || '--'}</td> */}
              <td className="width2btn">
                <i
                  className="btnEdit fa fa-fw fa-edit hvr-bounce-in"
                  onClick={() => {
                    this.setState(
                      {
                        modalTitle: 'Sửa bạn đọc',
                      },
                      () => this.setShow(true, value)
                    )
                  }}
                />
                <i
                  className="btnDelete far fa-trash-alt hvr-bounce-in"
                  onClick={() => {
                    this.setState({
                      id: value.id,
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
      <div className="col-md-12 mt-3">
        <table id="example2" className="table table-hover table-responsive-sm table-responsive-md">
          <thead className="text-center">
            <tr>
              <th>#</th>
              <th>{STRING.card_number}</th>
              <th>{STRING.name}</th>
              <th>{STRING.phone}</th>
              <th>{STRING.email}</th>
              <th>{STRING.address}</th>
              <th>{STRING.dob}</th>
              <th>{STRING.joinedDate}</th>
              {/* <th>{STRING.status}</th> */}
              <th></th>
            </tr>
          </thead>
          {this.renderTableData()}
        </table>
      </div>
    )
  }

  renderPagination() {
    const totalCount = this.props.listReaderState?.data?.data?.totalCount
    // console.log(this.props.listReaderState)
    const { page } = this.state
    return (
      <Col md="12">
        <Pagination
          itemClass="page-item"
          linkClass="page-link"
          hideDisabled
          activePage={page}
          totalItemsCount={totalCount || 0}
          itemsCountPerPage={CONFIG.LIMIT}
          pageRangeDisplayed={5}
          hideNavigation
          hideFirstLastPages
          onChange={(page) => {
            this.setState(
              {
                ...this.state,
                page: page,
              },
              () => this.getData({ page })
            )
          }}
        />
      </Col>
    )
  }

  checkValidationErrors() {
    const {
      account: accountError,
      phone: phoneError,
      name: nameError,
      address: addressError,
    } = this.state.validateError
    const { account, phone, address, name } = this.state.modal
    return accountError || phoneError || nameError || addressError || !(phone && account && address && name)
  }

  renderModalButton() {
    const { phone, account, address, name } = this.state.modal
    return (
      <Row>
        <Col className="button-wrapper mt-3">
          <Button
            className="mr-0 ml-1"
            variant="success"
            disabled={this.checkValidationErrors()}
            onClick={() => {
              this.createMember(name, phone, account, address)
            }}
          >
            {STRING.save}
          </Button>
          <Button
            className="mr-0 ml-1"
            variant="secondary"
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
    const isEditable = this.state.isEditReader
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.userType) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            {/* <MultiSelect
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
            /> */}
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
    const { show, modalTitle } = this.state
    return (
      <Modal
        show={show}
        onHide={() => {
          this.setShow(false)
          this.setState({
            validateError: {
              // account: null,
              name: null,
              phone: null,
              email: null,
              address: null,
              [STRING.userType]: [],
            },
          })
        }}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <h5 className="text-white">{modalTitle}</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          {/* {isEditReader == false &&
                        this.renderModalField(STRING.account)} */}
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
                  this.deleteMember(this.state.id)
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
    console.log('render')
    const { isLoading } = this.props.listReaderState
    const { loadingAction } = this.state
    return (
      <>
        {/* {isDataLoaded && <Loading />}
        {isLoading && (!isDataLoaded ? <LoadingAction /> : null)} */}
        {(loadingAction || isLoading) && <LoadingAction />}
        {/* {loadingAction && <Loading />} */}
        {/* <Error isOpen={true} /> */}
        {this.renderBody()}
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  listReaderState: state.ReaderReducer,
})

const mapDispatchToProps = {
  getListReader,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReaderScreen)
