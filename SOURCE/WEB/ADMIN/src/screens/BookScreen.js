import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/BookScreen.css'
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
  LIST_ORDER_BY_READER,
} from '@constants/Constant'
import Pagination from 'react-js-pagination'
import MultiSelect from 'react-multi-select-component'
import { getListBook } from '@src/redux/actions'
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { deleteBook, createBook, updateBook, getBookInfo } from '@constants/Api'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js'

class BookScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      bookId: '',
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
      listOrderByMember: LIST_ORDER_BY_READER,
      modal: {
        [STRING.name]: '',
        [STRING.parentName]: '',
        [STRING.cardNumber]: '',
        [STRING.parentPhone]: '',
        [STRING.address]: '',
        [STRING.date_of_birth]: '',
        [STRING.note]: '',
      },
      validateError: {
        account: '',
        name: '',
        phone: '',
        address: '',
      },
      isEditBook: false,
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

  async getBookInfo() {
    const res = await getBookInfo()
    this.setState({
      bookId: res?.data?.id,
    })
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const { limit, text, orderBy } = this.state
    try {
      await this.props.getListBook({
        page: page || 1,
        limit: limit || CONFIG.LIMIT,
        text: text?.trim() || '',
        orderBy: orderBy || '',
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

  async createBook() {
    const {
      [STRING.name]: name,
      [STRING.parentName]: parentName,
      [STRING.parentPhone]: phone,
      [STRING.address]: address,
      [STRING.date_of_birth]: dob,
      [STRING.note]: note,
      [STRING.cardNumber]: cardNumber,
    } = this.state.modal
    const { reader_id, page } = this.state
    this.setState({
      loadingAction: true,
    })
    try {
      if (this.state.isEditBook) {
        await updateBook({
          id: reader_id,
          name: name,
          address: address,
          dob: dob,
          cardNumber: cardNumber,
          parentName: parentName,
          parentPhone: phone,
          note: note,
        })
      } else {
        await createBook({
          name: name,
          address: address,
          dob: dob,
          parentName: parentName,
          parentPhone: phone,
          note: note,
        })
      }

      this.setState({ show: false, loadingAction: false }, () => {
        notifySuccess(STRING.notifySuccess)
        // this.getData({ page })
        this.getData({})
      })
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async deleteBook() {
    const { bookId } = this.state
    if (bookId !== this.state.id) {
      this.setState({ loadingAction: true })
      try {
        await deleteBook({
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
  handleChangeFieldModal = (fieldName, value) => {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        [fieldName]: value || '',
      },
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

  async setShow(bool, reader = {}) {
    reactotron.log(reader)
    this.setState({
      ...this.state,
      show: bool,
      modal: {
        [STRING.name]: reader.name,
        [STRING.parentName]: reader.parentName,
        [STRING.parentPhone]: reader.parentPhone,
        [STRING.address]: reader.address,
        [STRING.date_of_birth]: Date.parse(reader.dob),
        [STRING.note]: reader.note,
        [STRING.cardNumber]: reader.cardNumber,
      },
      isEditBook: reader.id ? true : false,
      reader_id: reader.id,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { page, limit, text, orderBy } = this.state
    return (
      <Row className="mx-0">
        <Col className="col-md-5 col-sm-8">
          <input
            onKeyPress={this.handleKeyPress}
            type="text"
            className="form-control mb-0"
            placeholder="Nhập từ khóa"
            value={text}
            onChange={(e) => this.handleChange('text', e.target.value)}
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
            <div className="row my-2">
              <div className="col-md-4 col-sm-4">
                <h1 className="text-header-screen">
                  {STRING.book}
                  {this.props.listBookState?.data?.data?.totalCount
                    ? ' - ' + this.props.listBookState?.data?.data?.totalCount
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
                modalTitle: 'Thêm sách',
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
                  // status: '',
                  orderBy: '',
                  cardNumber: '',
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
        {this.props.listBookState?.data?.data?.items?.length ? (
          this.props.listBookState?.data?.data?.items?.map((value, index) => (
            <tr key={index}>
              <td>{index + CONFIG.LIMIT * (this.state.page - 1) + 1}</td>
              <td
                className='hvr-rotate cursor-pointer text-table-hover color-tvdl'
                onClick={() => {
                  this.setState(
                    {
                      modalTitle: 'Sửa sách',
                    },
                    () => this.setShow(true, value)
                  )
                }}
              >
                {value.name || '--'}
              </td>
              <td>{value.code || '--'}</td>
              <td>{value.author || '--'}</td>
              <td>{value.book_category?.name || '--'}</td>
              <td>{value.book_images[0]?.image || '--'}</td>
              <td className="width2btn">
                <i
                  className="btnEdit fa fa-fw fa-edit hvr-bounce-in"
                  onClick={() => {
                    this.setState(
                      {
                        modalTitle: 'Sửa sách',
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
              <th>{STRING.bookName}</th>
              <th>{STRING.bookCode}</th>
              <th>{STRING.bookAuthor}</th>
              <th>{STRING.bookCategory}</th>
              <th>{STRING.image}</th>
              <th></th>
            </tr>
          </thead>
          {this.renderTableData()}
        </table>
      </div>
    )
  }

  renderPagination() {
    const totalCount = this.props.listBookState?.data?.data?.totalCount
    // console.log(this.props.listBookState)
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
            // disabled={this.checkValidationErrors()}
            onClick={() => {
              this.createBook()
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
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.date_of_birth) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <DatePickerCustom
              className={`date-picker form-control`}
              dateFormat="dd/MM/yyyy"
              placeholderText={STRING.date_of_birth}
              handleChange={this.handleChangeFieldModal}
              selected={field}
              maxDate={new Date()}
            />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.parentPhone) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <FormControl
              aria-describedby="basic-addon1"
              placeholder={`Nhập ${fieldName?.toLowerCase()}`}
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
              placeholder={`Nhập ${fieldName?.toLowerCase()}`}
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
            // onBlur={() => {
            //   // console.log(this.state.validateError)
            //   validateForm(this, field?.trim(), fieldName)
            // }}
            />
            {fieldError && <span className="validation-error">{fieldError}</span>}
          </Col>
        </Row>
      )
    }
  }

  renderModal() {
    const { show, modalTitle, isEditBook } = this.state
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
          {/* {isEditBook == false &&
                        this.renderModalField(STRING.account)} */}
          {this.renderModalField(STRING.name)}
          {this.renderModalField(STRING.parentName)}
          {this.renderModalField(STRING.parentPhone)}
          {this.renderModalField(STRING.address)}
          {isEditBook && this.renderModalField(STRING.cardNumber)}
          {this.renderModalField(STRING.date_of_birth)}
          {this.renderModalField(STRING.note)}
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
                  this.deleteBook(this.state.reader_id)
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
    const { isLoading } = this.props.listBookState
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
  listBookState: state.BookReducer,
})

const mapDispatchToProps = {
  getListBook,
}

export default connect(mapStateToProps, mapDispatchToProps)(BookScreen)
