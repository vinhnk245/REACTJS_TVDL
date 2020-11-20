const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY, RENTED_BOOK_STATUS } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const {
  reader: Reader,
  member: Member,
} = require("@models")
const { success, error } = require("../commons/response")

async function getListReader(req, res) {
  let page = !req.query.page ? 0 : req.query.page - 1
  let limit = parseInt(req.query.limit || LIMIT)
  if (page < 0) throw API_CODE.PAGE_ERROR
  let offset = page * limit
  let text = (req.query.text || '').trim()
  let querySearch = text.length > 0
    ? `(reader.name like '%${text}%' or reader.parentName like '%${text}%' or reader.parentPhone like '%${text}%')`
    : ''

  let queryCardNumber = req.query.cardNumber ? `cardNumber = ${req.query.cardNumber}` : ``
  let queryStatus = req.query.status ? `reader.status = ${req.query.status}` : ``

  let queryOrderBy = 'id DESC'
  if (req.query.orderBy == ORDER_BY.READER.CARD_NUMBER_ASC)
    queryOrderBy = 'cardNumber ASC, id DESC'
  if (req.query.orderBy == ORDER_BY.READER.CARD_NUMBER_DESC)
    queryOrderBy = 'cardNumber DESC, id DESC'
  if (req.query.orderBy == ORDER_BY.READER.DOB_ASC)
    queryOrderBy = 'dob ASC, id DESC'
  if (req.query.orderBy == ORDER_BY.READER.DOB_DESC)
    queryOrderBy = 'dob DESC, id DESC'
  if (req.query.orderBy == ORDER_BY.READER.LOST_DESC)
    queryOrderBy = 'lost DESC, id DESC'

  let listReader = await Reader.findAndCountAll({
    subQuery: false,
    attributes: [
      'id', 'name', 'address', 'dob', 'cardNumber', 'parentName', 'parentPhone', 'lost', 'createdDate',
      [col(`member.name`), 'createdMemberName'],
      [col(`member.account`), 'createdMemberAccount'],
    ],
    where: {
      isActive: ACTIVE,
      [Op.and]: [
        literal(queryCardNumber),
        literal(queryStatus),
        literal(querySearch)
      ]
    },
    include: [
      {
        required: false,
        model: Member,
        where: {
          isActive: ACTIVE
        },
        attributes: []
      }
    ],
    order: literal(queryOrderBy),
    offset: offset,
    limit: limit
  })

  return {
    totalCount: listReader.count,
    totalPage: Math.ceil(listReader.count / limit),
    items: listReader.rows
  }
}

async function getReaderInfo(req, res) {
  if (!req.query.id) throw API_CODE.INVALID_PARAM
  return await getReaderDetail(req.query.id)
}

async function getReaderDetail(readerId) {
  let readerDetail = await Reader.findOne({
    attributes: [
      'id', 'token', 'account', 'name', 'address', 'dob', 'cardNumber', 'createdDate', 'parentName', 'parentPhone', 'lost', 'note'
    ],
    where: {
      isActive: ACTIVE,
      id: readerId
    }
  })
  if (!readerDetail) throw API_CODE.NOT_FOUND
  return readerDetail
}

async function createReader(req, res) {
  let { name, address, dob, parentName, parentPhone, note } = req.body
  if (!name ||
    !address ||
    !parentName ||
    !dob) throw API_CODE.REQUIRE_FIELD

  let account, cardNumber
  let lastReader = await Reader.findAll({
    where: {
      isActive: ACTIVE
    },
    order: [
      ['cardNumber', 'DESC']
    ],
    limit: 1
  })
  if (!lastReader || lastReader.length === 0) {
    //khong co ban ghi reader trong db
    cardNumber = CONFIG.FIRST_CARD_NUMBER
  } else {
    cardNumber = lastReader[0].cardNumber + 1
  }
  account = CONFIG.PREFIX + cardNumber
  let hash = bcrypt.hashSync(account, CONFIG.CRYPT_SALT)
  let newReader = await Reader.create({
    account: account,
    password: hash,
    name: name,
    address: address,
    cardNumber: cardNumber,
    parentName: parentName,
    parentPhone: parentPhone,
    dob: dob,
    note: note,
    createdMemberId: req.auth.id
  })
  return await getReaderDetail(newReader.id)
}

async function updateReader(req, res) {
  let { id, name, cardNumber, address, dob, parentName, parentPhone, note, status } = req.body
  if (!name ||
    !cardNumber ||
    !address ||
    !parentName ||
    // !status ||
    !dob) throw API_CODE.REQUIRE_FIELD

  let readerUpdate = await Reader.findOne({
    where: {
      isActive: ACTIVE,
      id: id
    }
  })
  if (!readerUpdate) throw API_CODE.NOT_FOUND

  let newAccount = readerUpdate.account
  if (readerUpdate.cardNumber != cardNumber) {
    let checkCardNumber = await Reader.findOne({
      where: {
        isActive: ACTIVE,
        cardNumber: cardNumber
      }
    })
    if (checkCardNumber) throw API_CODE.CARD_NUMBER_EXIST

    newAccount = CONFIG.PREFIX + cardNumber
  }
  await readerUpdate.update({
    account: newAccount,
    name: name,
    address: address,
    cardNumber: cardNumber,
    parentName: parentName,
    parentPhone: parentPhone,
    dob: dob,
    note: note,
    // status: status,
  })
  return await getReaderDetail(readerUpdate.id)
}

async function deleteReader(req, res) {
  if (req.auth.role == ROLE.MEMBER)
    throw API_CODE.NO_PERMISSION

  let id = req.body.id
  if (!id) throw API_CODE.INVALID_PARAM
  let readerDelete = await Reader.findOne({
    where: {
      isActive: ACTIVE,
      id: id
    }
  })
  if (!readerDelete) throw API_CODE.NOT_FOUND

  await readerDelete.update({
    isActive: IS_ACTIVE.INACTIVE
  })
  return
}


module.exports = {
  getListReader,
  getReaderInfo,
  getReaderDetail,
  createReader,
  updateReader,
  deleteReader,
};
