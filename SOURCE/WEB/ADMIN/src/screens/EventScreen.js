import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/EventScreen.css'
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
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { getListEvent, createEvent, updateEvent, deleteEvent } from '@constants/Api'
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
      address: '',
      page: 1,
      limit: CONFIG.LIMIT,
      orderBy: '',
      totalCount: '',
      modalTitle: '',
      show: false,
      confirmModal: false,
      loadingAction: false,
      listStatus: LIST_STATUS,
      listDobMonth: LIST_DOB_MONTH,
      listOrderByMember: LIST_ORDER_BY_READER,
      modal: {
        [STRING.nameEvent]: '',
        [STRING.content]: '',
        [STRING.linkGoogleForm]: '',
        [STRING.note]: '',
        [STRING.eventDate]: '',
        [STRING.imageEvent]: null,
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
      //state
      listEvent: '',
      imgEvent: '',
      isEditEvent: false,
    }
    this.getData = this.getData.bind(this)
    this.renderModalField = this.renderModalField.bind(this)
    this.renderField = this.renderField.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    this.getData({})
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const { limit, text, status, orderBy, cardNumber } = this.state
    try {
      const res = await getListEvent({
        page: page || 1,
        limit: limit || CONFIG.LIMIT,
        orderBy: orderBy || '',
      })
      reactotron.log(res)
      this.setState({
        loadingAction: false,
        listEvent: res.data.items,
        count: res.data.totalCount,
      })
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async createEvent() {
    const {
      [STRING.nameEvent]: name,
      [STRING.content]: content,
      [STRING.linkGoogleForm]: linkGoogleForm,
      [STRING.eventDate]: eventDate,
      [STRING.imageEvent]: imageEvent,
    } = this.state.modal
    const { reader_id, page, event_id } = this.state
    this.setState({
      loadingAction: true,
    })
    try {
      const formData = new FormData()
      formData.append('id', event_id)
      formData.append('name', name)
      formData.append('content', content)
      formData.append('linkGoogleForm', linkGoogleForm)
      formData.append('eventDate', Date.parse(eventDate))
      formData.append('image', imageEvent)
      let res
      if (this.state.isEditEvent) {
        res = await updateEvent(formData)
      } else {
        res = await createEvent(formData)
      }
      if (res.status === 1) {
        this.setState(
          {
            show: false,
            loadingAction: false,
            modal: {
              [STRING.nameEvent]: '',
              [STRING.content]: '',
              [STRING.linkGoogleForm]: '',
              [STRING.note]: '',
              [STRING.eventDate]: '',
              [STRING.imageEvent]: null,
            },
            imgEvent: '',
          },
          () => {
            notifySuccess(STRING.notifySuccess)
          }
        )
      }
      this.getData({})
    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async deleteEvent() {
    const { event_id } = this.state
    this.setState({ loadingAction: true })
    try {
      const res = await deleteEvent({
        id: event_id,
      })
      if (res.status === 1) {
        this.setState(
          {
            loadingAction: false,
            confirmModal: false,
          },
          () => notifySuccess(STRING.notifySuccess)
        )
        this.getData({})
      }
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

  async setShow(bool, event = {}) {
    reactotron.log(event)
    this.setState({
      ...this.state,
      show: bool,
      modal: {
        [STRING.nameEvent]: event?.name,
        [STRING.content]: event?.content,
        [STRING.linkGoogleForm]: event?.linkGoogleForm,
        [STRING.eventDate]: new Date(event.eventDate),
      },
      imgEvent: event.image,
      isEditEvent: event.id ? true : false,
      event_id: event.id,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { page, limit, text, status, cardNumber, orderBy, listOrderByMember } = this.state
    return (
      <Row className="mx-0">
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
            <option value={1} defaultValue>
              Ngày gần nhất
            </option>
            <option value={2} defaultValue>
              Ngày xa nhất
            </option>
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
                  {STRING.event} - {this.state.count}
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
                  orderBy: '',
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
    const { listEvent } = this.state
    return (
      <tbody>
        {listEvent.length ? (
          listEvent.map((value, index) => (
            <tr key={index}>
              <td>{index + CONFIG.LIMIT * (this.state.page - 1) + 1}</td>
              <td
                className="hvr-rotate cursor-pointer text-table-hover color-tvdl"
                onClick={() => {
                  this.setState(
                    {
                      modalTitle: 'Sửa bạn đọc',
                    },
                    () => this.setShow(true, value)
                  )
                }}
              >
                {value.name || '--'}
              </td>
              <td>{value.image ? <img src={value.image} width="100" height="auto" /> : '--'}</td>
              <td>{value.eventDate ? toDateString(value.eventDate) : '--'}</td>
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
                      event_id: value.id,
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
              <th>{STRING.nameEvent}</th>
              <th>{STRING.imageEvent}</th>
              <th>{STRING.eventDate}</th>
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
    const { imgEvent } = this.state
    const {
      [STRING.nameEvent]: name,
      [STRING.content]: content,
      [STRING.linkGoogleForm]: linkGoogleForm,
      [STRING.eventDate]: eventDate,
      [STRING.imageEvent]: imageEvent,
    } = this.state.modal
    return !(name && content && linkGoogleForm && eventDate && imgEvent)
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
              this.createEvent()
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

  fileUpload = (e) => {
    this.setState({
      ...this.state,
      modal: {
        ...this.state.modal,
        [STRING.imageEvent]: e.target.files[0],
      },
      imgEvent: URL.createObjectURL(e.target.files[0]),
    })
  }

  renderModalField(fieldName) {
    const { isEditEvent, imgEvent } = this.state
    const { [fieldName]: field } = this.state.modal
    const { [fieldName]: fieldError } = this.state.validateError
    if (fieldName === STRING.content) {
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
    } else if (fieldName === STRING.eventDate) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            <DatePickerCustom
              className={`date-picker form-control`}
              dateFormat="dd/MM/yyyy"
              placeholderText={STRING.eventDate}
              handleChange={this.handleChangeFieldModal}
              selected={field}
            />
          </Col>
        </Row>
      )
    } else if (fieldName === STRING.imageEvent) {
      return (
        <Row>
          <Col className="modal-field" sm={4}>
            <span>{fieldName}</span>
          </Col>
          <Col sm={8}>
            {isEditEvent && <img src={imgEvent || ''} width="100" height="auto" />}
            <FormControl type="file" onChange={this.fileUpload} />
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
    const { show, modalTitle } = this.state
    return (
      <Modal
        show={show}
        onHide={() =>
          this.setState({
            ...this.state,
            modal: {
              [STRING.nameEvent]: '',
              [STRING.content]: '',
              [STRING.linkGoogleForm]: '',
              [STRING.note]: '',
              [STRING.eventDate]: '',
              [STRING.imageEvent]: null,
            },
            validateError: {},
            show: false,
          })
        }
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <h5 className="text-white">{modalTitle}</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          {this.renderModalField(STRING.nameEvent)}
          {this.renderModalField(STRING.content)}
          {this.renderModalField(STRING.linkGoogleForm)}
          {this.renderModalField(STRING.eventDate)}
          {this.renderModalField(STRING.imageEvent)}
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
                  this.deleteEvent()
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
    const { loadingAction, isLoading } = this.state
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

export default ReaderScreen
