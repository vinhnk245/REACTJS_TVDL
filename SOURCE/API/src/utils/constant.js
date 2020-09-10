'use strict';
const debug = require('debug');

module.exports = {
  // error code
  statusCode: {
    OK: 200,
    BAD_REQUEST: 400,
    INTERNAL_SERVER_ERROR: 500,
    UNAUTHORIZED: 403,
    MULTIPLE_CHOICES: 300,
    FORBIDDEN: 403,
  },

  apiCode: {
    SUCCESS: { code: 1, message: 'Thành công' },
    DB_ERROR: { code: 2, message: 'Truy vấn lỗi' },
    WRONG_TYPE_ACCOUNT: { code: 3, message: 'Không đúng loại user' },
    DELETE_IMAGE_ERROR: { code: 4, message: 'Lỗi xoá ảnh' },
    ACCOUNT_EXIST: { code: 5, message: 'Tài khoản đã tồn tại' },
    LOGIN_FAIL: { code: 6, message: 'Sai tài khoản hoặc mật khẩu' },
    UPLOAD_IMAGE_ERROR: { code: 7, message: 'Lỗi upload media' },
    CREATE_USER_ERROR: { code: 8, message: 'Lỗi tạo tài khoản' },
    INVALID_PARAM: { code: 9, message: 'Tham số không hợp lệ' },
    REVIEW_ORDER_ERROR: { code: 10, message: 'Lỗi đánh giá' },
    NOT_FOUND: { code: 11, message: 'Dữ liệu không tồn tại ' },
    FB_ERROR: { code: 12, message: '' },
    UNAUTHORIZED: { code: 403, message: 'Không có quyền truy cập' },
    INVALID_ACCESS_TOKEN: { code: 404, message: 'Token không hợp lệ' },
    NO_PERMISSION: { code: 13, message: 'Không có quyền thực hiện chức năng' },
    NOT_ACCOUNT_EXIST: { code: 14, message: 'Tài khoản không tồn tại' },
    UPDATE_USER_ERROR: { code: 15, message: 'Lỗi cập nhật tài khoản' },
    PAGE_ERROR: { code: 16, message: 'Lỗi truyền trang' },
    PLACE_ERROR: { code: 17, message: 'Không thể lấy được địa chỉ' },
    UPDATE_FAIL: { code: 18, message: 'Cập nhật không thành công' },
    DATA_EXIST: { code: 19, message: 'Dữ liệu đã tồn tại' },
    REGISTER_FAIL: { code: 20, message: 'Bạn không thể đăng ký tài khoản' },
    DELETE_USER_ERROR: { code: 25, message: 'Bạn không thể xóa tài khoản này này' },
    FAIL_CHANGE_PASS: { code: 26, message: 'Sai mật khẩu' },
  },

  config: {
    CRYPT_SALT: 10,
    PAGING_LIMIT: 5,
    RESET_PASSWORD: 'Base123a@',
    MAX_IMAGE: 5,
  },

  phone: {
    MIN_SEARCH_PHONE_LENGTH: 5,
    MIN_CREATE_PHONE_LENGTH: 6,
    MAX_CREATE_PHONE_LENGTH: 15,
  },

  firebase: {
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
    DEACTIVE: 2,
  },

  ROLE: {
    ADMIN: 1,
    ENTERPRISE: 2,
    PROFESSIONAL_MANAGER: 3,
    HR_MANAGER: 4,
    SALE: 5,
  },
  GENDER: {
    WOMAN: 1,
    MAN: 2,
  },
  TYPE_INPUT: {
    TEXT: 1,
    SELECT: 2,
    MULTIPLE_SELECT: 3,
    DATE: 4,
    YES_NO: 5,
  }
};
