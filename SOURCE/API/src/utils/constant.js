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
    UNAUTHORIZED: { code: 403, message: 'Phiên đăng nhập hết hạn' },
    INVALID_ACCESS_TOKEN: { code: 401, message: 'Token không hợp lệ' },
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
    WRONG_PASSWORD: { code: 24, message: 'Mật khẩu hiện tại không đúng' },
    CANT_RESET_PASSWORD: { code: 25, message: 'Tài khoản của bạn không được phép reset mật khẩu thành viên Thư viện' },
    REQUIRE_READER_RENTED_BOOK: { code: 26, message: 'Vui lòng chọn bạn đọc' },
    REQUIRE_LIST_BOOK_RENTED_BOOK: { code: 27, message: 'Vui lòng chọn sách' },
    DUPLICATE_BOOK_RENTED_BOOK: { code: 28, message: 'Không được phép mượn 2 quyển giống nhau' },
    DUPLICATE_COMICS_CATEGORY: { code: 29, message: 'Không được phép mượn 2 quyển truyện tranh' },
    READER_NOT_FOUND: { code: 30, message: 'Không tìm thấy thông tin bạn đọc' },
    RETURNED_BEFORE_BORROWED: { code: 31, message: 'Không được phép mượn khi chưa trả hết sách' },
    BORROWED_MAX_THREE: { code: 32, message: 'Chỉ được mượn tối đa 3 quyển' },
    BOOK_HAS_RETURNED: { code: 33, message: 'Lượt mượn sách này đã được trả từ trước' },
  },

  CONFIG: {
    CRYPT_SALT: 10,
    PAGING_LIMIT: 20,
    DEFAULT_PASSWORD: 'TVDL11092013',
    PATH_IMAGE_BOOK: 'uploads/images/books/',
    PATH_IMAGE_EVENT: 'uploads/images/events/',
    PREFIX: 'TVDL',
    FIRST_CARD_NUMBER: 1,
    LIMIT_TOP_BORROWED_BOOK: 10,
  },

  VOLUNTEER_STATUS: { 
    PENDING: 0,
    ACCEPT: 1,
    REJECT: 2,
  },

  USER_TYPE: { 
    MEMBER: 1,
    READER: 2,
  },

  RENTED_BOOK_STATUS: { 
    PENDING: 0,
    BORROWED: 1,
    RETURNED: 2,
    OUT_OF_DATE: 3,
    CANCEL: 4,
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
    EVENT: {
      EVENT_DATE_ASC: 1,
      EVENT_DATE_DESC: 2,
    },
  },

  CATEGORY: {
    SĐB: 1,
    SCSQ: 2,
    TSTN: 3,
    VHC: 4,
    KTC: 5,
    VHTN: 6,
    SNN: 7,
    PTTH: 8,
    KTTN: 9,
    MGTH: 10,
    LSVH: 11,
    KĐ: 12,
    TT: 13,
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
    MANAGER: 1,
    HEAD_OF_BOARD: 2,
    MEMBER: 3,
  },

  GENDER: {
    WOMAN: 1,
    MAN: 2,
  },

  YES_OR_NO: {
    YES: 1,
    NO: 0,
  },

};
