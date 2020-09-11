'use strict';
const { debug, API_CODE, IS_ACTIVE, ROLE, SALE_STATUS } = require('../utils/constant');
var compose = require('composable-middleware');
const response = require('../commons/response');
const Sequelize = require('sequelize');
const sequelize = require('../config/env');
const {user} = require('@models');
const Op = Sequelize.Op;
// const userController = require('../controllers/userController')
const selectedField = ["id","account","name","phone","email","address","token"];
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
          let findUser = await user.findOne({
            attributes: selectedField,
            where: {
              token: req.headers.token,
              isActive: 1,
            },
          });
          if (!findUser)
            return res.json(response.error(API_CODE.UNAUTHORIZED)); 

          req.auth = findUser;
          next();
          return;
        } catch (error) {
          console.log(error);
          return res.json(response.error(API_CODE.DB_ERROR, 'Lỗi kết nối'));
        }
      } else {
        return res.json(response.error(API_CODE.INVALID_ACCESS_TOKEN));
      }
    });
  },
};
