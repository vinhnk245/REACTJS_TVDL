const ROUTER = {
  HOME: '/home',
  USER: '/nguoi-dung',
  // MEMBER: '/thanh-vien',
  MEMBER: '/tnv',
  READER: '/ban-doc',
  BOOK: '/sach',
  RENTED: '/muon-tra',
  EVENT: '/su-kien',
  OVERVIEW: '/tong-quan',
  RENTED_DETAIL: '/chi-tiet-muon-tra',
}
const STRING = {
  lostBook: 'Làm mất',
  parentName: 'Họ tên bố mẹ',
  parentPhone: 'Sđt bố mẹ',
  cardNumber: 'Số thẻ',
  date_of_birth: 'Ngày sinh',
  note: 'Ghi chú',
  joined_Date: 'Ngày tham gia',
  role: 'Loại người dùng',
  emptyData: 'Không có dữ liệu',
  overView: 'Tổng quan',
  transport: 'Xe',
  numericalOrder: 'STT',
  member: 'TNV',
  reader: 'Bạn đọc',
  rented: 'Mượn trả',
  book: 'Sách',
  bookName: 'Tên sách',
  bookCode: 'Mã sách',
  bookAuthor: 'Tác giả',
  bookCategory: 'Thể loại',
  image: 'Ảnh',
  event: 'Sự kiện',
  user: 'Người dùng',
  username: 'Tên người dùng',
  namePhoneNumber: 'Tên, Số điện thoại',
  status: 'Trạng thái',
  orderBy: 'Sắp xếp mặc định',
  fromDate: 'Từ ngày',
  toDate: 'Đến ngày',
  search: 'Tìm kiếm',
  add: 'Thêm mới',
  name: 'Họ tên',
  phone: 'Số điện thoại',
  email: 'Email',
  address: 'Địa chỉ',
  dob: 'Sinh nhật',
  createdDate: 'Ngày tạo',
  joinedDate: 'Tham gia',
  save: 'Lưu',
  exit: 'Thoát',
  allow: 'Duyệt',
  reject: 'Từ chối',
  clearSearch: 'Xóa bộ lọc',
  changePassword: 'Đổi mật khẩu',
  newPassword: 'Mật khẩu mới',
  currentPassword: 'Mật khẩu hiện tại',
  password: 'Mật khẩu',
  unActive: 'Ngừng hoạt động',
  actived: 'Kích hoạt',
  account: 'Tài khoản',
  dobMonth: 'Tháng ',
  notifySuccess: 'Thao tác thành công',
  notifyFail: 'Thao tác thất bại',
  codeBook: 'Mã sách',
  amountBook: 'Số lượng sách',
  description: 'Mô tả',
  author: 'Tác giả',
  publishers: 'Nhà xuất bản',
  publishingYear: 'Năm xuất bản',
  image: 'Ảnh bìa',
  eventDate: 'Ngày sự kiện',
  imageEvent: 'Ảnh',
  content: 'Nội dung',
  linkGoogleForm: 'Link google',
  nameEvent: 'Tên sự kiện',
}
const NUMBER = {
  OPTION_ONE: 1,
  OPTION_ZERO: 0,
}
const CONFIG = {
  LIMIT: 5,
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
  INACTIVE: 'Tạm dừng',
}
const GENDER = {
  male: 'Nam',
  female: 'Nữ',
}
const LIST_STATUS = [
  { value: 1, label: STATUS.ACTIVE },
  { value: 0, label: STATUS.INACTIVE },
]
const LIST_DOB_MONTH = [
  { value: 1, label: STRING.dobMonth + 1 },
  { value: 2, label: STRING.dobMonth + 2 },
  { value: 3, label: STRING.dobMonth + 3 },
  { value: 4, label: STRING.dobMonth + 4 },
  { value: 5, label: STRING.dobMonth + 5 },
  { value: 6, label: STRING.dobMonth + 6 },
  { value: 7, label: STRING.dobMonth + 7 },
  { value: 8, label: STRING.dobMonth + 8 },
  { value: 9, label: STRING.dobMonth + 9 },
  { value: 10, label: STRING.dobMonth + 10 },
  { value: 11, label: STRING.dobMonth + 11 },
  { value: 12, label: STRING.dobMonth + 12 },
]
const LIST_ORDER_BY_MEMBER = [
  { value: 1, label: 'Thêm từ lâu nhất' },
  { value: 2, label: 'Thêm gần đây nhất' },
  { value: 3, label: 'Sinh nhật lớn đến bé' },
  { value: 4, label: 'Sinh nhật bé đến lớn' },
  { value: 5, label: 'Tháng sinh nhật bé đến lớn' },
  { value: 6, label: 'Tháng sinh nhật lớn đến bé' },
]
const LIST_ORDER_BY_READER = [
  { value: 1, label: 'Số thẻ bé đến lớn' },
  { value: 2, label: 'Số thẻ lớn đến bé' },
  { value: 3, label: 'Sinh nhật lớn đến bé' },
  { value: 4, label: 'Sinh nhật bé đến lớn' },
  { value: 5, label: 'Làm mất sách nhiều nhất' },
]

export {
  ROUTER,
  NUMBER,
  STRING,
  STATUS,
  GENDER,
  CONFIG,
  IS_ACTIVE,
  ROLE,
  LIST_STATUS,
  LIST_DOB_MONTH,
  LIST_ORDER_BY_MEMBER,
  LIST_ORDER_BY_READER,
}
