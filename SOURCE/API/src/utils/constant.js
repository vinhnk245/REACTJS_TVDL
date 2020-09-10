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
  },

  CONFIG: {
    CRYPT_SALT: 10,
    PAGING_LIMIT: 20,
    DEFAULT_PASSWORD: 'tvdl2013',
    MAX_IMAGE: 5,
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
    REACTIVATE: 3,
  },

  ROLE: {
    MANAGERS: 1,
    HEAD_OF_BOARDS: 2,
    MEMBERS: 3,
    SALE: 5,
  },

  GENDER: {
    WOMAN: 1,
    MAN: 2,
  },

};
