const { debug, apiCode, config, IS_ACTIVE, ROLE } = require('@utils/constant');

module.exports = function () {
  return (req, res, next) => {
    let { page = 1, limit = config.PAGING_LIMIT } = req.query;

    page = Math.max(page, 1);

    const offset = (page - 1) * limit;
    req.query.page = page;
    req.query.limit = limit;
    req.query.offset = offset;

    next();
  };
};
