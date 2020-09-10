"use strict";
const { debug, apiCode, IS_ACTIVE, ROLE, SALE_STATUS } = require("./constant");
var compose = require("composable-middleware");
const response = require("../commons/response");
const Sequelize = require("sequelize");
const sequelize = require("../config/env");
const { user,customer } = require("@models");
const Op = Sequelize.Op;
// const userController = require('../controllers/userController')

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
          var findUser = await customer.findOne({
            attributes: ["id","token","role_id"],
            where: {
              token: req.headers.token,
            },
          });
          if (findUser) {
            req.auth = findUser;
            next();
            return;
          } else return res.json(response.error(apiCode.UNAUTHORIZED));
        } catch (error) {
          debug.error(error);
          return res.json(response.error(apiCode.DB_ERROR, "Lỗi kết nối"));
        }
      } else {
        return res.json(response.error(apiCode.INVALID_ACCESS_TOKEN));
      }
    });
  },
};
