'use strict';
const { debug, apiCode, IS_ACTIVE, ROLE, SALE_STATUS } = require('../utils/constant');
var compose = require('composable-middleware');
const response = require('../commons/response');
const Sequelize = require('sequelize');
const sequelize = require('../config/env');
const {user} = require('@models');
const Op = Sequelize.Op;
// const userController = require('../controllers/userController')
const attribute=["id","full_name","user_name","phone","role_id","modified_at","created_at","token"];
module.exports = {
  isGuest: function isGuest() {
    return compose().use(function (req, res, next) {
      next();
      return;
    });
  },
  isAuthenticated: function isAuthenticated() {
    return compose().use(async function (req, res, next) {
      if (req.headers && req.headers.token) {
        try {
          var findUser = await user.findOne({
            attributes: attribute,
            where: {
              token: req.headers.token,
              is_active: 1,
            },
          });
          console.log(findUser)
          if (findUser) {
            req.auth = findUser;
            next();
            return;
          } else return res.json(response.error(apiCode.UNAUTHORIZED));
        } catch (error) {
          debug.error(error);
          return res.json(response.error(apiCode.DB_ERROR, 'Lỗi kết nối'));
        }
      } else {
        return res.json(response.error(apiCode.INVALID_ACCESS_TOKEN));
      }
    });
  },
};
