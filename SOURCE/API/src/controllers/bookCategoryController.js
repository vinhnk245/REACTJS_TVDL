const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js');
const response = require("@commons/response");
const { success, error } = response;

const { API_CODE, IS_ACTIVE, ROLE } = require('@utils/constant');
const { book_category: BookCategory } = require('@models');

async function getListCategory(req, res, next) {
  //neu trong router co check isAuthenticated thi urlRequest = req.url
  const urlRequest = req.protocol + '://' + req.get('host') + '/'

  let text = (req.query.text || '').trim()
  let querySearch = text.length > 0 
    ? `name like '%${text}%' or description like '%${text}%'` 
    : ''

  let categories = await BookCategory.findAll({
    where: { 
      isActive: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        literal(querySearch)
      ]
    },
    attributes: [
      'id', 'name', 'code', 'description',
      [fn('CONCAT', urlRequest, col('logo')), 'logo'],
    ]
  })
  return categories
}


module.exports = {
    getListCategory,
};
