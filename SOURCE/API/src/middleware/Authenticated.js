'use strict'
const { debug, API_CODE, IS_ACTIVE, ROLE, SALE_STATUS } = require('../utils/constant')
var compose = require('composable-middleware')
const response = require('../commons/response')
const { success, error } = require("../commons/response")
const Sequelize = require('sequelize')
const sequelize = require('../config/env')
const { reader, member } = require('@models')
const Op = Sequelize.Op


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
          let readerCheck = await reader.findOne({
            where: {
              token: req.headers.token,
              isActive: IS_ACTIVE.ACTIVE,
            },
            attributes: [
              'id', 'rank', 'lost', 'status'
            ]
          })
          if (!readerCheck) {
            let memberCheck = await member.findOne({
              where: {
                token: req.headers.token,
                isActive: IS_ACTIVE.ACTIVE,
              },
              attributes: [
                'id', 'role', 'status'
              ]
            })
            if (!memberCheck) 
              return res.json(response.error(API_CODE.UNAUTHORIZED))
            if(memberCheck.status === IS_ACTIVE.DEACTIVATE) 
              return res.json(response.error(API_CODE.ACCOUNT_DEACTIVATED))

            req.auth = memberCheck
          } else {
            if(readerCheck.status === IS_ACTIVE.DEACTIVATE) 
              return res.json(response.error(API_CODE.ACCOUNT_DEACTIVATED))
              
            req.auth = readerCheck
          }
          next();
          return;
        } catch (error) {
          console.log(error);
          return res.json(response.error(API_CODE.DB_ERROR))
        }
      } else {
        return res.json(response.error(API_CODE.INVALID_ACCESS_TOKEN))
      }
    })
  },
}
