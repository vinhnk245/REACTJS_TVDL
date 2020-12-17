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
import { getListBook } from '@src/redux/actions'
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { deleteBook, createBook, updateBook, getBookInfo, getListCategory } from '@constants/Api'
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
        [STRING.bookCategory]: '',
        [STRING.bookName]: '',
        [STRING.amountBook]: '',
        [STRING.note]: '',
        [STRING.description]: '',
        [STRING.author]: '',
        [STRING.publishers]: '',
        [STRING.publishingYear]: '',
        [STRING.image]: null,
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
      // state book
      listBookCategory: [],
      bookCategoryId: '',
    }
    this.getData = this.getData.bind(this)
    this.renderModalField = this.renderModalField.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getData({})
    this.getListBookCategory()
  }

  async getBookInfo() {
    const res = await getBookInfo()
    this.setState({
      bookId: res?.data?.id,
    })
  }

  async getListBookCategory() {
    this.setState({
      isLoading: true,
    })
    try {
      const res = await getListCategory({ text: '' })
      if (res.status === 1) {
        this.setState({
          isLoading: false,
          listBookCategory: res.data,
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const { limit, text, orderBy, bookCategoryId } = this.state
    try {
      await this.props.getListBook({
        page: page || 1,
        limit: limit || CONFIG.LIMIT,
        text: text?.trim() || '',
        orderBy: orderBy || '',
        bookCategoryId: bookCategoryId || '',
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
      [STRING.bookCategory]: bookCategoryId,
      [STRING.bookName]: name,
      [STRING.amountBook]: qty,
      [STRING.note]: note,
      [STRING.description]: description,
      [STRING.author]: author,
      [STRING.publishers]: publishers,
      [STRING.publishingYear]: publishingYear,
      [STRING.image]: image,
    } = this.state.modal
    const { page, bookId, isEditBook } = this.state
    this.setState({
      loadingAction: true,
    })
    try {
      const formData = new FormData()
      formData.append('id', bookId)
      formData.append('name', name)
      formData.append('bookCategoryId', bookCategoryId)
      formData.append('qty', qty)
      formData.append('note', note)
      formData.append('author', author)
      formData.append('publishers', publishers)
      formData.append('description', description)
      formData.append('publishingYear', publishingYear)
      formData.append('image', image)
      let res
      if (isEditBook) {
        res = await updateBook(formData)
      } else {
        res = await createBook(formData)
      }
      if (res.status === 1) {
        this.setState(
          {
            show: false,
            loadingAction: false,

            validateError: {
              // account: null,
              name: null,
              phone: null,
              email: null,
              address: null,
              [STRING.userType]: [],
            },
            modal: {
              [STRING.bookCategory]: '',
              [STRING.bookName]: '',
              [STRING.amountBook]: '',
              [STRING.note]: '',
              [STRING.description]: '',
              [STRING.author]: '',
              [STRING.publishers]: '',
              [STRING.publishingYear]: '',
              [STRING.image]: null,
            },
            imgBook: '',
            bookId: '',
          },
          () => {
            notifySuccess(STRING.notifySuccess)
            this.getData({})
          }
        )
      }
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async deleteBook(id) {
    this.setState({ loadingAction: true })
    try {
      const res = await deleteBook({
        id: id,
      })
      if (res.status === 1) {
        this.setState(
          {
            loadingAction: false,
            confirmModal: false,
          },
          () => {
            this.getData({})
            notifySuccess(STRING.notifySuccess)
          }
        )
      }
    } catch (err) {
      this.setState({
        loadingAction: false,
        confirmModal: false,
        error: err,
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

  fileUpload = (e) => {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        [STRING.image]: e.target.files[0],
      },
      imgBook: URL.createObjectURL(e.target.files[0]),
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

  async setShow(bool, book = {}) {
    this.setState({
      ...this.state,
      show: bool,
      modal: {
        [STRING.bookCategory]: parseInt(book?.book_category?.id),
        [STRING.bookName]: book?.name,
        [STRING.amountBook]: book?.qty,
        [STRING.note]: book?.note,
        [STRING.description]: book?.description,
        [STRING.author]: book?.author,
        [STRING.publishers]: book?.publishers,
        [STRING.publishingYear]: book?.publishingYear,
        [STRING.image]: null,
      },
      isEditBook: book.id ? true : false,
      bookId: book.id,
      imgBook: book?.book_images[0]?.image || '',
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { page, limit, text, orderBy, listBookCategory, bookCategoryId } = this.state
    return (
      <Row className="mx-0">
        <Col className="col-md-4 col-sm-8">
          <input
            onKeyPress={this.handleKeyPress}
            type="text"
            className="form-control mb-0"
            placeholder="Nhập từ khóa"
            value={text}
            onChange={(e) => this.handleChange('text', e.target.value)}
          />
        </Col>
        <Col className="col-md-4 col-sm-8">
          <FormControl
            as="select"
            value={bookCategoryId}
            onChange={(e) =>
              this.setState(
                {
                  bookCategoryId: e.target.value,
                },
                () => this.getData({})
              )
            }
          >
            <option value="" defaultValue>
              Chọn loại sách
            </option>
            {listBookCategory?.map((item, index) => (
              <option value={item.id} key={index}>
                {item.name}
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
                className="hvr-rotate cursor-pointer text-table-hover color-tvdl"
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
              <td style={{ alignItems: 'center' }}>{value.code || '--'}</td>
              <td>{value.author || '--'}</td>
              <td>
                {value.book_category?.logo ? <img src={value.book_category?.logo} width="100" height="auto" /> : '--'}
              </td>
              <td>
                {value.book_images[0]?.image ? (
                  <img src={value.book_images[0]?.image} width="100" height="auto" />
                ) : (
                  '--'
                )}
              </td>
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
                      bookId: value.id,
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
              this.setState({
                show: false,
                validateError: {
                  // account: null,
                  name: null,
                  phone: null,
                  email: null,
                  address: null,
                  [STRING.userType]: [],
                },
                modal: {
                  [STRING.bookCategory]: '',
                  [STRING.bookName]: '',
                  [STRING.amountBook]: '',
                  [STRING.note]: '',
                  [STRING.description]: '',
                  [STRING.author]: '',
                  [STRING.publishers]: '',
                  [STRING.publishingYear]: '',
                  [STRING.image]: null,
                },
                imgBook: '',
                bookId: '',
              })
            }}
          >
            {STRING.exit}
          </Button>
        </Col>
      </Row>
    )
  }

  renderModalField(fieldName) {
    const { listBookCategory, isEditBook, imgBook } = this.state
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.bookCategory) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <FormControl
              as="select"
              value={field}
              onChange={(e) => this.handleChangeFieldModal(fieldName, parseInt(e.target.value))}
            >
              <option value="" defaultValue>
                Chọn loại sách
              </option>
              {listBookCategory?.map((item, index) => (
                <option value={item.id} key={index}>
                  {item.name}
                </option>
              ))}
            </FormControl>
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.image) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            {imgBook && <img src={imgBook || ''} width="100" height="auto" />}
            <FormControl type="file" onChange={this.fileUpload} />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.description) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <textarea
              className="form-control"
              placeholder="Nhập mô tả"
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
            />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.publishingYear) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <FormControl
              type="number"
              aria-describedby="basic-addon1"
              placeholder={`Nhập ${fieldName?.toLowerCase()}`}
              onChange={(e) => {
                validateForm(this, field, fieldName)
                this.setState({
                  ...this.state,
                  modal: {
                    ...this.state.modal,
                    [fieldName]: parseInt(e.target.value),
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
          this.setState({
            show: false,
            validateError: {
              // account: null,
              name: null,
              phone: null,
              email: null,
              address: null,
              [STRING.userType]: [],
            },
            modal: {
              [STRING.bookCategory]: '',
              [STRING.bookName]: '',
              [STRING.amountBook]: '',
              [STRING.note]: '',
              [STRING.description]: '',
              [STRING.author]: '',
              [STRING.publishers]: '',
              [STRING.publishingYear]: '',
              [STRING.image]: null,
            },
            imgBook: '',
            bookId: '',
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
          {this.renderModalField(STRING.bookCategory)}
          {this.renderModalField(STRING.bookName)}
          {this.renderModalField(STRING.amountBook)}
          {this.renderModalField(STRING.note)}
          {this.renderModalField(STRING.description)}
          {this.renderModalField(STRING.author)}
          {this.renderModalField(STRING.publishers)}
          {this.renderModalField(STRING.publishingYear)}
          {this.renderModalField(STRING.image)}
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
                  this.deleteBook(this.state.bookId)
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
