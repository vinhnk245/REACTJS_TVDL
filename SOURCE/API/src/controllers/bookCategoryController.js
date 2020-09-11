const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../config/env.js');

const { API_CODE, IS_ACTIVE, ROLE } = require('@utils/constant');
const { book_category } = require('@models');

async function getListCategory(req, res, next) {
    console.log(book_category)
  let categories = await book_category.findAll({
    where: { isActive: IS_ACTIVE.ACTIVE }
  })
  return categories
}


module.exports = {
    getListCategory,
};
