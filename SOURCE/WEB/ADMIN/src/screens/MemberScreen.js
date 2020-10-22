import React, { Component } from 'react'
import { Row, Col, FormControl, Button, Modal } from 'react-bootstrap'
import '@styles/MemberScreen.css'
import { STRING, NUMBER, IS_ACTIVE, CONFIG, ROLE, STATUS, LIST_STATUS } from '@constants/Constant'
import Pagination from 'react-js-pagination'
import MultiSelect from 'react-multi-select-component'
import { getListMember } from '@src/redux/actions'
import { connect } from 'react-redux'
import { toDateString } from '@src/utils/helper'
import { deleteMember, createMember, updateMember, getMemberInfo } from '@constants/Api'
import { validateForm } from '@src/utils/helper'
import Loading from '@src/components/Loading'
import Error from '@src/components/Error'
import DatePickerCustom from '@src/components/DatePickerCustom'
import LoadingAction from '@src/components/LoadingAction'
import { notifyFail, notifySuccess } from '@src/utils/notify'
import swal from 'sweetalert'
import reactotron from 'reactotron-react-js';

class MemberScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      memberId: '',
      account: '',
      name: '',
      phone: '',
      email: '',
      address: '',
      role: ROLE.MEMBER,
      page: 1,
      limit: CONFIG.LIMIT,
      text: '',
      status: '',
      orderBy: '',
      totalCount: '',
      modalTitle: '',
      show: false,
      confirmModal: false,
      loadingAction: false,
      listStatus: LIST_STATUS,
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
      isEditMember: false,
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

  async getMemberInfo() {
    const res = await getMemberInfo()
    this.setState({
      memberId: res?.data?.id,
    })
  }

  async getData({ page }) {
    this.setState({ loadingAction: true })
    const { limit, text, status, orderBy } = this.state
    try {
      await this.props.getListMember({
        page: page || 1,
        limit: limit || CONFIG.LIMIT,
        text: text?.trim() || '',
        status: status || '',
        orderBy: orderBy || '',
      });


      this.setState({
        loadingAction: false
      })


    } catch (error) {
      this.setState({
        loadingAction: false,
      })
    }
  }

  async createMember(account, name, phone, email, address, role) {
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
      if (this.state.isEditMember) {
        await updateMember(member)
      } else {
        await createMember(member)
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

  async deleteMember() {
    const { memberId } = this.state
    if (memberId !== this.state.id) {
      this.setState({ loadingAction: true })
      try {
        await deleteMember({
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
    await this.setState(
      {
        ...this.state,
        page: 1,
        [fieldName]: value || '',
      }
    )
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
      isEditMember: member.phone ? true : false,
      id: member.id,
    })
  }

  handlePageChange(pageNumber) {
    this.setState({ page: pageNumber })
  }
  renderField() {
    const { page, limit, text, status, orderBy, listStatus } = this.state
    return (
      <Row className="mx-0">
        <Col sm>
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
        <Col sm>
          <FormControl
            // onKeyPress={this.handleKeyPress}
            as="select"
            className="mb-0"
            id="exampleInputEmail1"
            // placeholder="Nhập từ khóa"
            value={status}
            onChange={(e) => this.handleChangeSelect('status', e.target.value)}
          >
            <option value="" defaultValue>
              {STRING.status}
            </option>
            {listStatus?.map((item, index) => <option value={item.value} key={index}>{item.label}</option>)}
          </FormControl>
        </Col>
        <Col sm>
          <FormControl
            onKeyPress={this.handleKeyPress}
            as="select"
            className="mb-0"
            value={orderBy}
            onChange={(e) => this.handleChange('orderBy', e.target.value)}
          />
        </Col>
      </Row >
    )
  }

  renderBody() {
    return (
      <div className="content-wrapper">
        <div className="content-header">
          <div className="container-fluid">
            <div className="row mb-1">
              <div className="col-md-4 col-sm-4">
                <h1 className="text-header-screen">Thành viên</h1>
              </div>
              <div className="col-md-8 col-sm-8">
                {this.renderButton()}
              </div>
            </div>
          </div>
          {this.renderField()}
          {/* {this.renderButton()} */}
          {this.renderTable()}
          {this.renderPagination()}
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
            className="mr-0 ml-1"
            variant="success"
            onClick={() => {
              this.setState({
                modalTitle: 'Thêm thành viên',
                show: true
              })
            }}
          >
            {STRING.add}
          </Button>
          <Button
            className="mr-0 ml-1"
            variant="primary"
            onClick={() => {
              this.getData({})
            }}
          >
            {STRING.search}
          </Button>
          <Button
            className="mr-0 ml-1"
            variant="secondary"
            onClick={() =>
              this.setState({
                text: '',
                status: '',
                orderBy: '',
              }, () => this.getData({}))
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
        {this.props.listMemberState?.data?.data?.items?.length ? (
          this.props.listMemberState?.data?.data?.items?.map((value, index) => (
            <tr key={index}>
              <td>{index + CONFIG.LIMIT * (this.state.page - 1) + 1}</td>
              <td>{value.account || '--'}</td>
              <td>{value.name || '--'}</td>
              <td>{value.phone || '--'}</td>
              <td>{value.email || '--'}</td>
              <td>{value.address || '--'}</td>
              <td>{value.joinedDate ? toDateString(value.joinedDate) : '--'}</td>
              <td>{toDateString(value.dob) || '--'}</td>
              <td>{parseInt(value.status) === 1 ? STATUS.ACTIVE : STATUS.INACTIVE || '--'}</td>
              <td className="width2btn">
                <i
                  className="btnEdit fa fa-fw fa-edit"
                  onClick={() => {
                    this.setState({
                      modalTitle: 'Sửa thành viên'
                    }, () => this.setShow(true, value))

                  }}
                />
                <i
                  className="btnDelete far fa-trash-alt"
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
      <div className="col-md-12 mt-1">
        <table id="example2" className="table table-bordered table-striped  table-responsive-sm table-responsive-md">
          <thead className="text-center">
            <tr>
              <th>STT</th>
              <th>Mã TNV</th>
              <th>{STRING.name}</th>
              <th>{STRING.phone}</th>
              <th>{STRING.email}</th>
              <th>{STRING.address}</th>
              <th>{STRING.dob}</th>
              <th>{STRING.joinedDate}</th>
              <th>{STRING.status}</th>
              <th></th>
            </tr>
          </thead>
          {this.renderTableData()}
        </table>
      </div>
    )
  }

  renderPagination() {
    const totalCount = this.props.listMemberState?.data?.data?.totalCount
    // console.log(this.props.listMemberState)
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
            this.setState({
              ...this.state,
              page: page,
            }, () => this.getData({ page }))
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
    const {
      account,
      phone,
      address,
      name,
    } = this.state.modal
    return (
      accountError ||
      phoneError ||
      nameError ||
      addressError ||
      !(phone && account && address && name)
    )
  }

  renderModalButton() {
    const {
      phone,
      account,
      address,
      name,
    } = this.state.modal
    return (
      <Row>
        <Col className="button-wrapper mt-3">
          <Button
            className="mr-0 ml-1"
            variant="success"
            disabled={this.checkValidationErrors()}
            onClick={() => {
              this.createMember(
                name,
                phone,
                account,
                address,
              )
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
    const isEditable = this.state.isEditMember
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
          {/* {isEditMember == false &&
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
    const { isLoading } = this.props.listMemberState
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
  listMemberState: state.MemberReducer,
})

const mapDispatchToProps = {
  getListMember,
}

export default connect(mapStateToProps, mapDispatchToProps)(MemberScreen)
