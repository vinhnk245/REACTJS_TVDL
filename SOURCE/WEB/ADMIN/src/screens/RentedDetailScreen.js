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
  LIST_ORDER_BY_READER,
} from '@constants/Constant'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import { toDateString } from '@src/utils/helper'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js'
import { getRentedDetail, updateRentedBook, updateBookDetail } from '@constants/Api'

class RentedDetailScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      page: 1,
      limit: CONFIG.LIMIT,
      show: false,
      confirmModal: false,
      showModalBookDetail: false,
      isLoading: false,
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
      isEditReader: false,
      id: '',
      error: null,
      //
      rentedDetail: '',
      nameBook: '',
      lost: false,
      note: '',
    }
  }

  componentDidMount() {
    this.getDetail()
  }

  async getDetail() {
    this.setState({
      isLoading: true,
    })
    const {
      match: { params },
    } = this.props
    try {
      const res = await getRentedDetail({
        id: params.id,
      })

      if (res.status === 1) {
        this.setState({
          isLoading: false,
          rentedDetail: res.data,
        })
      }
    } catch (error) {
      this.setState({
        isLoading: false,
      })
    }
  }

  async updateRentedBook() {
    this.setState({
      isLoading: true,
    })
    const {
      match: { params },
    } = this.props
    try {
      const res = await updateRentedBook({
        id: params.id,
      })
      if (res.status === 1) {
        this.setState(
          {
            isLoading: false,
            confirmModal: false,
          },
          () =>
            swal({
              title: 'Thành công',
              icon: 'success',
            })
        )
        this.getDetail()
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        confirmModal: false,
      })
    }
  }

  async updateBookDetail() {
    this.setState({
      isLoading: true,
    })
    const { idBook, lost, note } = this.state
    reactotron.log(lost)
    try {
      const res = await updateBookDetail({
        id: idBook,
        status: 2,
        lost: lost ? 1 : 0,
        note: note,
      })
      if (res.status === 1) {
        this.setState(
          {
            isLoading: false,
            lost: false,
            showModalBookDetail: false,
            confirmModal: false,
          },
          () =>
            swal({
              title: 'Thành công',
              icon: 'success',
            })
        )
        this.getDetail()
      }
    } catch (error) {
      this.setState({
        isLoading: false,
        confirmModal: false,
      })
    }
  }

  setShow(bool, value) {
    this.setState({
      showModalBookDetail: bool,
      nameBook: value.bookName,
      idBook: value.rentedBookDetailId,
      edit: 1,
    })
  }

  handleChange(fieldName, value) {
    this.setState({
      ...this.state,
      [fieldName]: value || '',
    })
  }

  renderInfo() {
    const { rentedDetail } = this.state
    return (
      <div
        className="p-2"
        // style={{
        //   backgroundColor: 'white',
        //   borderRadius: '5px',
        //   boxShadow: '3px 3px 10px rgb(0, 0, 0, 0.4)',
        //   marginTop: -5,
        // }}
      >
        <div className="mx-2">
          <div className="row">
            {/* col 1 */}
            <div className="col-md-6 col-12">
              <div className="row mx-2 my-1">
                <div className="col-5">
                  <Col>Họ tên</Col>
                </div>
                <div className="col-7">
                  <Col>
                    <strong>{rentedDetail?.readerName || '--'}</strong>
                  </Col>
                </div>
              </div>
              <div className="row mx-2 my-3">
                <div className="col-5">
                  <Col>Số thẻ</Col>
                </div>
                <div className="col-7">
                  <Col>
                    <strong>{rentedDetail?.readerCardNumber || '--'}</strong>
                  </Col>
                </div>
              </div>
              <div className="row mx-2 my-1">
                <div className="col-5">
                  <Col>Ngày mượn</Col>
                </div>
                <div className="col-7">
                  <Col>
                    <strong>{rentedDetail?.borrowedDate ? toDateString(rentedDetail?.borrowedDate) : '--'}</strong>
                  </Col>
                </div>
              </div>
              <div className="row mx-2 my-3">
                <div className="col-5">
                  <Col>Người cho mượn</Col>
                </div>
                <div className="col-7">
                  <Col>
                    <strong>{rentedDetail?.borrowedConfirmMemberName || '--'}</strong>
                  </Col>
                </div>
              </div>
            </div>
            {/* col 2 */}
            {/* <div className="col-md-6 col-12"></div> */}
          </div>
        </div>
      </div>
    )
  }
  renderTableData() {
    const { rentedDetail } = this.state
    return (
      <tbody>
        {rentedDetail?.rented_book_details?.length ? (
          rentedDetail?.rented_book_details?.map((value, index) => (
            <tr key={index}>
              <td>{index + CONFIG.LIMIT * (this.state.page - 1) + 1}</td>
              <td>{value?.bookName || '--'}</td>
              <td
              // className="hvr-rotate cursor-pointer text-table-hover color-tvdl"
              // onClick={() => {
              //   this.setState(
              //     {
              //       modalTitle: 'Sửa bạn đọc',
              //     },
              //     () => this.setShow(true, value)
              //   )
              // }}
              >
                {value.bookCode || '--'}
              </td>
              <td>
                <img src={value?.categoryLogo || ''} width="100" height="auto" />
              </td>
              <td>
                <img src={value?.bookImage[0] || ''} width="100" height="auto" />
              </td>
              <td className={'' + (parseInt(value.lost) > 0 ? 'text-bold text-danger' : '')}>{value.lost}</td>
              <td>{value.returnedDate ? toDateString(value?.returnedDate) : '--'}</td>
              <td>{value.returnedConfirmMemberName || '--'}</td>
              <td className="width2btn">
                <i
                  className="btnEdit fa fa-fw fa-edit hvr-bounce-in"
                  onClick={() => {
                    this.setState(
                      {
                        modalTitle: 'Trả sách',
                      },
                      () => this.setShow(true, value)
                    )
                  }}
                />
              </td>
            </tr>
          ))
        ) : (
          <tr className="text-center">
            <td colSpan={9}>{STRING.emptyData}</td>
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
              <th>Tên sách</th>
              <th>Mã sách</th>
              <th>Loại sách</th>
              <th>Ảnh bìa</th>
              <th>Làm mất</th>
              <th>Ngày trả</th>
              <th>Người xác nhận</th>
              <th></th>
            </tr>
          </thead>
          {this.renderTableData()}
        </table>
      </div>
    )
  }

  renderBookModal() {
    const { showModalBookDetail, nameBook, lost, note } = this.state
    return (
      <Modal
        show={showModalBookDetail}
        onHide={() =>
          this.setState({
            edit: '',
            lost: false,
            note: '',
            showModalBookDetail: false,
          })
        }
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header closeButton>
          <h5 style={{ color: 'white' }}>Trả sách</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <Row>
            <Col className="modal-field" sm={4}>
              <span>Tên sách</span>
            </Col>
            <Col sm={8}>
              <span>{nameBook}</span>
            </Col>
          </Row>
          <Row>
            <Col className="modal-field" sm={4}>
              <span>Làm mất</span>
            </Col>
            <Col sm={8}>
              <input
                type="checkbox"
                className="form-control"
                value={lost}
                onClick={() => this.setState({ lost: !this.state.lost })}
                onChange={this.sete}
              />
            </Col>
          </Row>
          <Row>
            <Col className="modal-field" sm={4}>
              <span>Ghi chú</span>
            </Col>
            <Col sm={8}>
              <textarea
                className="form-control"
                aria-describedby="basic-addon1"
                value={note}
                onChange={(e) => this.handleChange('note', e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col className="button-wrapper" style={{ justifyContent: 'center' }}>
              <Button variant="success" onClick={() => this.setState({ confirmModal: true })}>
                OK
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  this.setState({
                    showModalBookDetail: false,
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

  renderConfirmModal() {
    const { confirmModal, edit } = this.state
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
          <h5 style={{ color: 'white' }}>Bạn chắc chắn muốn trả sách ?</h5>
        </Modal.Header>
        <Modal.Body className="custom-body">
          <Row>
            <Col className="button-wrapper">
              <Button
                variant="success"
                onClick={edit === 1 ? () => this.updateBookDetail() : () => this.updateRentedBook()}
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

  renderBody() {
    const { rentedDetail } = this.state
    return (
      <div>
        <div className="m-2 mb-3" style={{ justifyContent: 'space-between', display: 'flex' }}>
          <h1 className="header h1--cursor" onClick={() => this.props.history.goBack()} style={{ cursor: 'pointer' }}>
            <i className="fas mr-2 fa-angle-left" />
            Chi tiết người mượn {rentedDetail?.readerName}
          </h1>
          <div>
            <Button
              variant="success"
              onClick={() =>
                this.setState({
                  confirmModal: true,
                })
              }
            >
              Trả toàn bộ
            </Button>
          </div>
        </div>
        {this.renderInfo()}
        <div className="col-md-12 my-2 bg-table">
          {this.renderTable()}
          {this.renderConfirmModal()}
          {this.renderBookModal()}
        </div>
      </div>
    )
  }

  render() {
    const { isLoading } = this.state
    return (
      <div className="content-wrapper">
        <div className="content-header">
          {isLoading && <LoadingAction />}
          {this.renderBody()}
        </div>
      </div>
    )
  }
}

export default RentedDetailScreen
