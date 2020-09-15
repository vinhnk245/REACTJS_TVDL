const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { member } = require("@models")
const { success, error } = require("../commons/response")

async function getListMember(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit
    let text = (req.query.text || '').trim()
    let querySearch = text.length > 0 
    ? `name like '%${text}%' or phone like '%${text}%'` 
    : ''

    let queryStatus = req.query.status ? `status = ${req.query.status}` : ``

    let queryOrderBy = 'role, id'
    if(req.query.orderBy == ORDER_BY.MEMBER.ID_ASC)
        queryOrderBy = 'id ASC'
    if(req.query.orderBy == ORDER_BY.MEMBER.ID_DESC)
        queryOrderBy = 'id DESC'
    if(req.query.orderBy == ORDER_BY.MEMBER.DOB_ASC)
        queryOrderBy = 'dob ASC'
    if(req.query.orderBy == ORDER_BY.MEMBER.DOB_DESC)
        queryOrderBy = 'dob DESC'
    if(req.query.orderBy == ORDER_BY.MEMBER.JOINED_DATE_ASC)
        queryOrderBy = 'joinedDate ASC'
    if(req.query.orderBy == ORDER_BY.MEMBER.JOINED_DATE_DESC)
        queryOrderBy = 'joinedDate DESC'

    let listMember = await member.findAndCountAll({
      where: {
        isActive: ACTIVE,
        [Op.and]: [
            sequelize.literal(queryStatus),
            sequelize.literal(querySearch)
        ]
      },
      order: sequelize.literal(queryOrderBy),
      offset: offset,
      limit: limit
    })

    return {
      totalPage: Math.ceil(listMember.count / limit),
      items: listMember.rows
    }
}

async function getMemberInfo(req, res) {
    if(!req.query.id) throw API_CODE.INVALID_PARAM
    return await getMemberDetail(req.query.id)
}

async function getMemberDetail(memberId) {
    let memberDetail = await member.findOne({
        where: {
            isActive: ACTIVE,
            id: memberId
        },
        attributes: [
            'id', 'token', 'account', 'name', 'address', 'dob', 'joinedDate', 'phone', 'email', 'role', 'note'
        ]
    })
    if(!memberDetail) throw API_CODE.NOT_FOUND
    return memberDetail
}

async function createMember(req, res) {
    if(req.auth.role == ROLE.MEMBERS)
    throw API_CODE.NO_PERMISSION

    let { account, name, address, dob, joinedDate, phone, email, role, note } = req.body
    if(!account || 
        !name || 
        !phone || 
        !address ||
        !dob ||
        !role) throw API_CODE.REQUIRE_FIELD

    let checkAccount = await member.findOne({
        where: {
            isActive: ACTIVE,
            [Op.or]: [
                { account: account }, 
                { phone: phone }
            ]
        }
    })
    if(checkAccount && checkAccount.account == account) throw API_CODE.ACCOUNT_EXIST
    if(checkAccount && checkAccount.phone == phone) throw API_CODE.PHONE_EXIST

    let hash = bcrypt.hashSync(CONFIG.DEFAULT_PASSWORD, CONFIG.CRYPT_SALT)
    let newMember = await member.create({
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
    return await getMemberDetail(newMember.id)
}

async function updateMember(req, res) {
    if(req.auth.role == ROLE.MEMBERS)
        throw API_CODE.NO_PERMISSION

    let { id, account, name, address, dob, joinedDate, phone, email, role, note, status } = req.body
    if(!account || 
        !name || 
        !phone || 
        !address ||
        !dob ||
        !status ||
        !role) throw API_CODE.REQUIRE_FIELD

    let memberUpdate = await member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if(!memberUpdate) throw API_CODE.NOT_FOUND

    await memberUpdate.update({
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
    return await getMemberDetail(memberUpdate.id)
}

async function deleteMember(req, res) {
    if(req.auth.role == ROLE.MEMBERS)
        throw API_CODE.NO_PERMISSION

    let id = req.body.id
    if(!id) throw API_CODE.INVALID_PARAM

    let memberDelete = await member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if(!memberDelete) throw API_CODE.NOT_FOUND

    await memberDelete.update({
        isActive: IS_ACTIVE.INACTIVE
    })
    return
}


module.exports = {
    getListMember,
    getMemberInfo,
    getMemberDetail,
    createMember,
    updateMember,
    deleteMember,
}
