'use strict';
const debug = require('debug');

module.exports = {
  STATUS_CODE: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 403,
    MULTIPLE_CHOICES: 300,
    FORBIDDEN: 403,
  },

  API_CODE: {
    UNAUTHORIZED: { code: 403, message: 'Không có quyền truy cập' },
    INVALID_ACCESS_TOKEN: { code: 404, message: 'Token không hợp lệ' },
    SUCCESS: { code: 1, message: 'Thành công' },
    DB_ERROR: { code: 2, message: 'Truy vấn lỗi' },
    ACCOUNT_EXIST: { code: 3, message: 'Tài khoản đã tồn tại' },
    LOGIN_FAIL: { code: 4, message: 'Sai tài khoản hoặc mật khẩu' },
    INVALID_PARAM: { code: 5, message: 'Tham số không hợp lệ' },
    NOT_FOUND: { code: 6, message: 'Dữ liệu không tồn tại' },
    NO_PERMISSION: { code: 7, message: 'Không có quyền thực hiện chức năng' },
    PAGE_ERROR: { code: 8, message: 'Lỗi truyền trang' },
    FAIL_CHANGE_PASS: { code: 9, message: 'Sai mật khẩu' },
    REQUIRE_FIELD: { code: 10, message: 'Vui lòng nhập đầy đủ thông tin' },
    ACCOUNT_DEACTIVATED: { code: 11, message: 'Tài khoản hiện đang bị khóa' },
    PHONE_EXIST: { code: 12, message: 'Số điện thoại đã tồn tại' },
    CARD_NUMBER_EXIST: { code: 13, message: 'Số thẻ đã tồn tại' },
    CATEGORY_NOT_FOUND: { code: 14, message: 'Thể loại sách không tồn tại' },
    BOOK_CODE_EXIST: { code: 15, message: 'Mã sách đã tồn tại' },
    ERROR_QTY_LESS_AVAILABLE: { code: 16, message: 'Sách có sẵn không được phép lớn hơn số lượng' },
    ERROR_QTY_LOST_AVAILABLE: { code: 17, message: 'Vui lòng kiểm tra lại số lượng, đã mất, có sẵn' },
    INVALID_PHONE: { code: 18, message: 'Vui lòng nhập đúng định dạng số điện thoại' },
    VOLUNTEER_REGISTRATION_EXIST: { code: 19, message: 'Số điện thoại đã được đăng ký' },
    REJECT_VOLUNTEER_REQUIRE_NOTE: { code: 20, message: 'Vui lòng nhập lý do từ chối' },
    VOLUNTEER_REGISTRATION_ACCEPTED: { code: 21, message: 'Không thể từ chối những yêu cầu đã được phê duyệt' },
    VOLUNTEER_REGISTRATION_REJECTED: { code: 22, message: 'Yêu cầu này đã bị từ chối từ trước' },
    REQUIRE_IMAGE: { code: 23, message: 'Vui lòng tải ảnh lên' },
  },

  CONFIG: {
    CRYPT_SALT: 10,
    PAGING_LIMIT: 20,
    DEFAULT_PASSWORD: 'TVDL11092013',
    PATH_IMAGE_BOOK: 'uploads/images/books/',
    PATH_IMAGE_EVENT: 'uploads/images/events/',
    PREFIX: 'TVDL',
    FIRST_CARD_NUMBER: 1,
  },

  VOLUNTEER_STATUS: { 
    PENDING: 0,
    ACCEPT: 1,
    REJECT: 2,
  },

  ORDER_BY: { 
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
      LOST_ASC: 5,
      LOST_DESC: 6,
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
  },

  VALIDATE_PHONE: {
    MIN_CREATE_PHONE_LENGTH: 6,
    MAX_CREATE_PHONE_LENGTH: 15,
  },

  FIREBASE: {
    ACCOUNT: '',
  },

  debug: {
    db: debug('app:dbquery'),
    log: debug('app:log'),
    debug: debug('app:debug'),
    error: debug('app:error'),
    email: debug('app:email'),
  },

  IS_ACTIVE: {
    ACTIVE: 1,
    INACTIVE: 0,
    DEACTIVATE: 2,
    REJECT: 3,
  },

  ROLE: {
    MANAGERS: 1,
    HEAD_OF_BOARDS: 2,
    MEMBERS: 3,
  },

  GENDER: {
    WOMAN: 1,
    MAN: 2,
  },

};
