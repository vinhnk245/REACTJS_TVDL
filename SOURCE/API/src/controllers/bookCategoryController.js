const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../config/env.js');
const response = require("@commons/response");
const { success, error } = response;

const { API_CODE, IS_ACTIVE, ROLE } = require('@utils/constant');
const { book_category: BookCategory } = require('@models');

async function getListCategory(req, res, next) {
  const URL_REQUEST = req.protocol + '://' + req.get('host') + '/'
  let text = (req.query.text || '').trim()
  let querySearch = text.length > 0 
    ? `name like '%${text}%' or description like '%${text}%'` 
    : ''

  let categories = await BookCategory.findAll({
    where: { 
      isActive: IS_ACTIVE.ACTIVE,
      [Op.and]: [
        sequelize.literal(querySearch)
      ]
    },
    attributes: [
      'id', 'name', 'code', 'description',
      [sequelize.fn('CONCAT', URL_REQUEST, sequelize.col('logo')), 'logo'],
    ]
  })
  return categories
}


module.exports = {
    getListCategory,
};
