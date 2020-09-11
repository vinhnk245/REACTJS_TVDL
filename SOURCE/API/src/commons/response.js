'use strict';
const _ = require('lodash');
const { config } = require('@utils/constant');
const { debug } = require('@utils/constant');
function wrapErrorJSON(error, message = null, ex = '') {
  return {
    status: 0,
    code: error.code,
    msg: message || error.message,
    ex: ex || ex,
    data: {},
  };
}
function wrapSuccessJSON(data, message = 'Thành công', count = null, page = 0) {
  return {
    status: 1,
    code: 1,
    msg: message,
    data: data,
    paging: count ? { page: page, totalItemCount: count, limit: config.PAGING_LIMIT } : null,
  };
}
function wrapHandlerWithJSONResponse(handler) {
  return async function (req, res, next) {
    console.log(handler);
    try {
      let result = await handler(req, res);
      if (!_.isObject(result) || !result.data) {
        result = { data: result };
      }
      res.json({
        status: 1,
        code: 1,
        msg: 'Thành công',
        ...result,
      });
    } catch (error) {
      console.log(error);
      res.json(wrapErrorJSON(error));
    }
  };
}

module.exports = {
  error: wrapErrorJSON,
  success: wrapSuccessJSON,
  wrapHandlerWithJSONResponse,
};
