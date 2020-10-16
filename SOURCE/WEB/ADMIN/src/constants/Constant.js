const ROUTER = {
  HOME: '/home',
  USER: '/nguoi-dung',
  MEMBER: '/thanh-vien',
  READER: '/ban-doc',
  BOOK: '/sach',
  RENTED: '/muon-tra',
  TRANSPORT: '/xe',
  OVERVIEW: '/tong-quan',
}
const STRING = {
  emptyData: 'Không có dữ liệu',
  overView: 'Tổng quan',
  transport: 'Xe',
  numericalOrder: 'STT',
  member: 'Thành viên',
  user: 'Người dùng',
  username: 'Tên người dùng',
  namePhoneNumber: 'Tên, Số điện thoại',
  status: 'Trạng thái',
  fromDate: 'Từ ngày',
  toDate: 'Đến ngày',
  search: 'Tìm kiếm',
  add: 'Thêm mới',
  phoneNumber: 'Số điện thoại',
  email: 'Email',
  createdDate: 'Ngày tạo',
  address: 'Địa chỉ',
  save: 'Lưu',
  exit: 'Thoát',
  fullname: 'Họ và tên',
  allow: 'Duyệt',
  reject: 'Từ chối',
  clearSearch: 'Xóa bộ lọc',
  changePassword: 'Đổi mật khẩu',
  newPassword: 'Mật khẩu mới',
  currentPassword: 'Mật khẩu hiện tại',
  password: 'Mật khẩu',
  unActive: 'Ngừng hoạt động',
  actived: 'Kích hoạt',
  account: 'Tài khoản'
}

const NUMBER = {
  page_limit: 20,
  OPTION_ONE: 1,
  OPTION_ZERO: 0,
}

const IS_ACTIVE = {
  ACTIVE: 1,
  INACTIVE: 0,
  DEACTIVATE: 2,
  REJECT: 3,
}

const ROLE = {
  MANAGER: 1,
  HEAD_OF_BOARD: 2,
  MEMBER: 3,
}

const VOLUNTEER_STATUS = {
  PENDING: 0,
  ACCEPT: 1,
  REJECT: 2,
}

const USER_TYPE = {
  MEMBER: 1,
  READER: 2,
}

const RENTED_BOOK_STATUS = {
  PENDING: 0,
  BORROWED: 1,
  RETURNED: 2,
  CANCEL: 3,
}

const ORDER_BY = {
  MEMBER: {
    ID_ASC: 1,
    ID_DESC: 2,
    DOB_ASC: 3,
    DOB_DESC: 4,
    JOINED_DATE_ASC: 5,
    JOINED_DATE_DESC: 6,
  },
  READER: {
    CARD_NUMBER_ASC: 1,
    CARD_NUMBER_DESC: 2,
    DOB_ASC: 3,
    DOB_DESC: 4,
    LOST_DESC: 5,
  },
  BOOK: {
    QTY_DESC: 1,
    LOST_DESC: 2,
    AVAILABLE_DESC: 3,
  },
  VOLUNTEER: {
    CREATED_DATE_ASC: 1,
    CREATED_DATE_DESC: 2,
    DOB_ASC: 3,
    DOB_DESC: 4,
  },
  EVENT: {
    EVENT_DATE_ASC: 1,
    EVENT_DATE_DESC: 2,
  },
}

const STATUS = {
  ACTIVE: 'Đang hoạt động',
  INACTIVE: 'Ngừng hoạt động',
}

const GENDER = {
  male: 'Nam',
  female: 'Nữ',
}

export { ROUTER, NUMBER, STRING, STATUS, GENDER }
