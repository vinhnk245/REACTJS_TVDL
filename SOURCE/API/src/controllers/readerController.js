const { API_CODE, IS_ACTIVE, ROLE } = require("@utils/constant")
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
      IS_ACTIVE: ACTIVE,
      ID: readerId
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
      !parentPhone ||
      !dob) return error(API_CODE.INVALID_PARAM)

  let checkAccount = await reader.findOne({
      where: {
          isActive: ACTIVE,
          [Op.or]: [
              { account: account }, 
              { phone: phone }
          ]
      }
  })
  if(checkAccount && checkAccount.account == account) return error(API_CODE.ACCOUNT_EXIST)
  if(checkAccount && checkAccount.phone == phone) return error(API_CODE.PHONE_EXIST)

  let hash = bcrypt.hashSync(CONFIG.DEFAULT_PASSWORD, CONFIG.CRYPT_SALT)
  let newReader = await reader.create({
      account: account,
      password: hash,
      name: name,
      address: address,
      phone: phone,
      email: email,
      dob: dob,
      joinedDate: joinedDate,
      role: role,
      note: note,
      createdMemberId: req.auth.id
  })
  return await getReaderDetail(newReader.id)
}

async function updateReader(req, res) {
  let { id, account, name, address, dob, joinedDate, phone, email, role, note, status } = req.body
  if(!account || 
      !name || 
      !phone || 
      !address ||
      !dob ||
      !status ||
      !role) return error(API_CODE.INVALID_PARAM)

  let readerUpdate = await reader.findOne({
      where: {
          isActive: ACTIVE,
          id: id
      }
  })
  if(!readerUpdate) return error(API_CODE.NOT_FOUND)

  await readerUpdate.update({
      account: account,
      name: name,
      address: address,
      phone: phone,
      email: email,
      dob: dob,
      joinedDate: joinedDate,
      role: role,
      status: status,
      note: note
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
