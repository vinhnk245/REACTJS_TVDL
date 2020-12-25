import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/RentedScreen.css'
import '@styles/hover.css'
import {
  STRING,
  NUMBER,
  IS_ACTIVE,
  CONFIG,
  ROLE,
  STATUS,
  ROUTER,
  LIST_STATUS_RENTED,
  LIST_DOB_MONTH,
  LIST_ORDER_BY_READER,
} from '@constants/Constant'
import Pagination from 'react-js-pagination'
import { Multiselect } from 'multiselect-react-dropdown'
import { getListReader, getListBook } from '@src/redux/actions'
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { getListRented, createReader, updateReader, getReaderInfo, createRentedBook } from '@constants/Api'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js'
import { Link } from 'react-router-dom'

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
      limit: CONFIG.LIMIT_10,
      text: '',
      status: '',
      orderBy: '',
      cardNumber: '',
      totalCount: '',
      modalTitle: '',
      show: false,
      confirmModal: false,
      loadingAction: false,
      listStatusRented: LIST_STATUS_RENTED,
      listDobMonth: LIST_DOB_MONTH,
      listOrderByMember: LIST_ORDER_BY_READER,
      modal: {
        [STRING.reader]: '',
        [STRING.note]: '',
        [STRING.book]: '',
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
      //
      listBookHis: [],
      totalCount: '',
      reader: [],
      listBoook: [],
    }
    this.getData = this.getData.bind(this)
    this.renderModalField = this.renderModalField.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getData({})
    this.getListReader()
    this.getListBook()
  }

  async getListReader() {
    this.setState({ loadingAction: true })
    try {
      await this.props.getListReader({
        page: 1,
        limit: 100000000,
        text: '',
        status: '',
        orderBy: '',
        cardNumber: '',
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

  async getListBook() {
    this.setState({ loadingAction: true })
    try {
      await this.props.getListBook({
        page: 1,
        limit: 100000000,
        text: '',
        orderBy: '',
        bookCategoryId: '',
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

  async getReaderInfo() {
    const res = await getReaderInfo()
    this.setState({
      memberId: res?.data?.id,
    })
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const {
      limit,
      status,
      orderBy,
      cardNumber,
      readerName,
      bookName,
      [STRING.fromDate]: fromDate,
      [STRING.toDate]: toDate,
    } = this.state
    try {
      const res = await getListRented({
        page: page || 1,
        limit: limit || CONFIG.LIMIT_10,
        cardNumber: cardNumber || '',
        // readerName: readerName || '',
        // bookName: bookName || '',
        // fromDate: fromDate || '',
        // toDate: toDate || '',
        status: status || '',
        // orderBy: orderBy || '',
      })
      this.setState({
        loadingAction: false,
        listBookHis: res.data.items,
        totalCount: res.data.totalCount,
      })
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async createRentedBook() {
    const { [STRING.note]: note } = this.state.modal
    const { reader, listBook } = this.state
    this.setState({
      loadingAction: true,
    })
    try {
      let res = await createRentedBook({
        readerId: reader[0]?.id,
        noteMember: note,
        listBook: listBook?.map(
          (item) =>
            new Object({
              bookId: item.id,
              bookCategoryId: item.category_id,
            })
        ),
      })
      if (res.status === 1) {
        this.setState({ show: false, loadingAction: false }, () => {
          notifySuccess(STRING.notifySuccess)
          this.getData({})
        })
      }
    } catch (error) {
      this.setState({
        loadingAction: false,
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
      isEditReader: reader.id ? true : false,
      reader_id: reader.id,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { status, cardNumber, orderBy, listStatusRented } = this.state
    return (
      <Row className="mx-0">
        {/* <Col className="col-md-5 col-sm-8">
          <input
            onKeyPress={this.handleKeyPress}
            type="text"
            className="form-control mb-0"
            placeholder="Nhập từ khóa"
            value={text}
            onChange={(e) => this.handleChange('text', e.target.value)}
          />
        </Col> */}
        {/* <Col className="col-md-3 col-sm-4">
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
        </Col> */}
        <Col className="col-md-2 col-sm-4">
          <input
            onKeyPress={this.handleKeyPress}
            type="text"
            className="form-control mb-0"
            placeholder="Nhập số thẻ"
            value={cardNumber}
            onChange={(e) => this.handleChange('cardNumber', e.target.value)}
          />
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
            {listStatusRented?.map((item, index) => (
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
                  Mượn trả
                  {/* {this.state.totalCount ? ' - ' + this.state.totalCount : ''} */}
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
                modalTitle: 'Mượn sách',
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
    const { listBookHis } = this.state
    return (
      <tbody>
        {listBookHis.length ? (
          listBookHis.map((value, index) => (
            <tr key={index}>
              {/* <td>{index + CONFIG.LIMIT_10 * (this.state.page - 1) + 1}</td> */}
              <td>{value.readerCardNumber || '--'}</td>
              <td
                className="hvr-rotate cursor-pointer text-table-hover color-tvdl"
              // onClick={() => {
              //   this.setState(
              //     {
              //       modalTitle: 'Sửa bạn đọc',
              //     },
              //     () => this.setShow(true, value)
              //   )
              // }}
              >
                {value.readerName || '--'}
              </td>
              <td>{value.borrowedDate ? toDateString(value.borrowedDate) : '--'}</td>
              <td>{value.returnedDate ? toDateString(value.returnedDate) : '--'}</td>
              <td>{value.borrowedConfirmMemberName || '--'}</td>
              <td>{value.rented_book_details?.length || '--'}</td>
              <td>{parseInt(value.status) === 2 ? STATUS.RETURNED : parseInt(value.status) === 1 ? STATUS.BORROWED : STATUS.PENDING || '--'}</td>
              <td className="width2btn">
                <Link to={ROUTER.RENTED_DETAIL + '/' + value.id}>
                  <i className="btnEdit far fa-edit hvr-bounce-in" />
                </Link>
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
    const { listBookHis } = this.state

    return (
      <div className="col-md-12 mt-3">
        <table id="example2" className="table table-hover table-responsive-sm table-responsive-md">
          <thead className="text-center">
            <tr>
              {/* <th>#</th> */}
              <th>{STRING.cardNumber}</th>
              <th>{STRING.name}</th>
              <th>Ngày mượn</th>
              <th>Ngày trả</th>
              <th>TNV cho mượn</th>
              <th>Số lượng</th>
              <th>Trạng thái</th>
              <th></th>
            </tr>
          </thead>
          {this.renderTableData()}
        </table>
      </div>
    )
  }

  renderPagination() {
    // const totalCount = this.props.listReaderState?.data?.data?.totalCount
    const totalCount = this.state.totalCount
    // alert(totalCount)
    const { page } = this.state
    return (
      <Col md="12">
        <Pagination
          itemClass="page-item"
          linkClass="page-link"
          hideDisabled
          activePage={page}
          totalItemsCount={totalCount || 0}
          itemsCountPerPage={CONFIG.LIMIT_10}
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
              this.createRentedBook()
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

  onSelect = (selectedList, selectedItem) => {
    this.setState({
      ...this.state,
      reader: selectedList || '',
    })
  }

  onRemove = (selectedList, removedItem) => {
    this.setState({
      ...this.state,
      reader: selectedList || '',
    })
  }
  onSelectBook = (selectedList, selectedItem) => {
    this.setState({
      ...this.state,
      listBook: selectedList || '',
    })
  }

  onRemoveBook = (selectedList, removedItem) => {
    this.setState({
      ...this.state,
      listBook: selectedList || '',
    })
  }

  renderModalField(fieldName) {
    const { note, reader } = this.state
    const listReader = this.props.listReaderState?.data?.data?.items?.map(
      (reader) =>
        new Object({
          id: reader.id,
          name: reader.name,
        })
    )
    const listBook = this.props.listBookState?.data?.data?.items?.map(
      (reader) =>
        new Object({
          id: reader.id,
          name: reader.name,
          category_id: reader.book_category.id,
        })
    )

    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.reader) {
      return (
        <Row className="mb-2">
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <Multiselect
              selectionLimit={1}
              options={listReader}
              selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              onSelect={this.onSelect} // Function will trigger on select event
              onRemove={this.onRemove} // Function will trigger on remove event
              displayValue="name"
              placeholder="Chọn bạn đọc"
            />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.note) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <textarea
              className="form-control"
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
    } else if (fieldName === STRING.book) {
      return (
        <Row className="mb-2">
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <Multiselect
              className="form-control"
              selectionLimit={3}
              options={listBook}
              selectedValues={this.state.selectedValue} // Preselected value to persist in dropdown
              onSelect={this.onSelectBook} // Function will trigger on select event
              onRemove={this.onRemoveBook} // Function will trigger on remove event
              displayValue="name"
              placeholder="Chọn sách"
            />
          </Col>
        </Row>
      )
    }
  }

  renderModal() {
    const { show, modalTitle, isEditReader } = this.state
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
          {this.renderModalField(STRING.reader)}
          {this.renderModalField(STRING.book)}
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
                  this.deleteReader(this.state.reader_id)
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
  listBookState: state.BookReducer,
})

const mapDispatchToProps = {
  getListReader,
  getListBook,
}

export default connect(mapStateToProps, mapDispatchToProps)(ReaderScreen)
