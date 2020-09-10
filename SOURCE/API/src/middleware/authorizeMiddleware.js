const { ROLE, API_CODE } = require('@utils/constant');

module.exports = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    if (req.auth && roles.length && !roles.includes(req.auth.role_id)) {
      return res.json({
        status: 0,
        code: API_CODE.UNAUTHORIZED.code,
        msg: API_CODE.UNAUTHORIZED.message,
        ex: '',
        data: {},
      });
    }
    next();
  };
};
