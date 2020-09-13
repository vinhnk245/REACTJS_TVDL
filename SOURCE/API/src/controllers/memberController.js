const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const { member } = require("@models")
const { success, error } = require("../commons/response")

async function getMemberInfo(req, res) {
    if(!req.query.id) return error(API_CODE.INVALID_PARAM)
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
    if(!memberDetail) return error(API_CODE.NOT_FOUND)
    return memberDetail
}

async function createMember(req, res) {
    if(req.auth.role == ROLE.MEMBERS)
        return error(API_CODE.NO_PERMISSION)

    let { account, name, address, dob, joinedDate, phone, email, role, note } = req.body
    if(!account || 
        !name || 
        !phone || 
        !address ||
        !dob ||
        !role) return error(API_CODE.REQUIRE_FIELD)

    let checkAccount = await member.findOne({
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
        return error(API_CODE.NO_PERMISSION)

    let { id, account, name, address, dob, joinedDate, phone, email, role, note, status } = req.body
    if(!account || 
        !name || 
        !phone || 
        !address ||
        !dob ||
        !status ||
        !role) return error(API_CODE.REQUIRE_FIELD)

    let memberUpdate = await member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if(!memberUpdate) return error(API_CODE.NOT_FOUND)

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
        return error(API_CODE.NO_PERMISSION)

    let id = req.body.id
    if(!id) return error(API_CODE.INVALID_PARAM)

    let memberDelete = await member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if(!memberDelete) return error(API_CODE.NOT_FOUND)

    await memberDelete.update({
        isActive: IS_ACTIVE.INACTIVE
    })
    return
}


module.exports = {
    getMemberInfo,
    getMemberDetail,
    createMember,
    updateMember,
    deleteMember,
}
