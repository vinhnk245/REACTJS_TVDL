const { API_CODE, IS_ACTIVE, ROLE, CONFIG } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const { reader } = require("@models")
const { success, error } = require("../commons/response")

async function getReaderInfo(req, res) {
  if(!req.query.id) return error(API_CODE.INVALID_PARAM)
  return await getReaderDetail(req.query.id)
}

async function getReaderDetail(readerId) {
  let readerDetail = await reader.findOne({
    attributes: [
      'id', 'token', 'account', 'name', 'address', 'dob', 'cardNumber', 'createdDate', 'parentName', 'parentPhone', 'lost', 'note'
    ],
    where: {
      isActive: ACTIVE,
      id: readerId
    }
  })
  if(!readerDetail) return error(API_CODE.NOT_FOUND)
  return readerDetail
}

async function createReader(req, res) {
  let { name, address, dob, parentName, parentPhone, note } = req.body
  if(!name || 
      !address || 
      !parentName || 
      !dob) return error(API_CODE.REQUIRE_FIELD)

  let account, cardNumber
  let lastReader = await reader.findAll({
    where: {
      isActive: ACTIVE
    },
    order: [
      ['cardNumber', 'DESC']
    ],
    limit: 1
  })
  if(!lastReader || lastReader.length === 0){
    //khong co ban ghi reader trong db
    cardNumber = CONFIG.FIRST_CARD_NUMBER
  } else {
    cardNumber = lastReader[0].cardNumber + 1
  }
  account = CONFIG.PREFIX + cardNumber
  let hash = bcrypt.hashSync(account, CONFIG.CRYPT_SALT)
  let newReader = await reader.create({
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
  if(!name || 
    !cardNumber || 
    !address || 
    !parentName || 
    !status || 
    !dob) return error(API_CODE.REQUIRE_FIELD)

  let readerUpdate = await reader.findOne({
    where: {
      isActive: ACTIVE,
      id: id
    }
  })
  if(!readerUpdate) return error(API_CODE.NOT_FOUND)

  let newAccount = readerUpdate.account
  if(readerUpdate.cardNumber != cardNumber){
    let checkCardNumber = await reader.findOne({
      where: {
        isActive: ACTIVE,
        cardNumber: cardNumber
      }
    })
    if(checkCardNumber) return error(API_CODE.CARD_NUMBER_EXIST)

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
    status: status,
  })
  return await getReaderDetail(readerUpdate.id)
}

async function deleteReader(req, res) {
  if(req.auth.role == ROLE.MEMBERS)
      return error(API_CODE.NO_PERMISSION)

  let id = req.body.id
  if(!id) return error(API_CODE.INVALID_PARAM)

  let readerDelete = await reader.findOne({
      where: {
          isActive: ACTIVE,
          id: id
      }
  })
  if(!readerDelete) return error(API_CODE.NOT_FOUND)
  
  await readerDelete.update({
      isActive: IS_ACTIVE.INACTIVE
  })
  return
}


module.exports = {
  getReaderInfo,
  getReaderDetail,
  createReader,
  updateReader,
  deleteReader,
};
