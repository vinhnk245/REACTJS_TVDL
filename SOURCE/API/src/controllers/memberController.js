const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { member: Member } = require("@models")
const { success, error } = require("../commons/response")

async function getListMember(req, res) {
    let { orderBy, status, dobMonth } = req.query
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit
    let text = (req.query.text || '').trim()
    let querySearch = text.length > 0
        ? `(name like '%${text}%' or phone like '%${text}%')`
        : ''

    let queryStatus = status ? `status = ${status}` : ``

    let queryOrderBy = 'status DESC, role, id DESC'
    if (orderBy == ORDER_BY.MEMBER.ID_ASC)
        queryOrderBy = 'id ASC'
    if (orderBy == ORDER_BY.MEMBER.ID_DESC)
        queryOrderBy = 'id DESC'
    if (orderBy == ORDER_BY.MEMBER.DOB_ASC)
        queryOrderBy = 'dob ASC'
    if (orderBy == ORDER_BY.MEMBER.DOB_DESC)
        queryOrderBy = 'dob DESC'
    if (orderBy == ORDER_BY.MEMBER.MONTH_ASC)
        queryOrderBy = 'MONTH(dob) ASC, DAY(dob) ASC'
    if (orderBy == ORDER_BY.MEMBER.MONTH_DESC)
        queryOrderBy = 'MONTH(dob) DESC, DAY(dob) ASC'

    let queryDobMonth = ''
    switch (parseInt(dobMonth)) {
        case ORDER_BY.DOB_MONTH.JANUARY:
            queryDobMonth = 'MONTH(dob) = 1'
            break;
        case ORDER_BY.DOB_MONTH.FEBRUARY:
            queryDobMonth = 'MONTH(dob) = 2'
            break;
        case ORDER_BY.DOB_MONTH.MARCH:
            queryDobMonth = 'MONTH(dob) = 3'
            break;
        case ORDER_BY.DOB_MONTH.APRIL:
            queryDobMonth = 'MONTH(dob) = 4'
            break;
        case ORDER_BY.DOB_MONTH.MAY:
            queryDobMonth = 'MONTH(dob) = 5'
            break;
        case ORDER_BY.DOB_MONTH.JUNE:
            queryDobMonth = 'MONTH(dob) = 6'
            break;
        case ORDER_BY.DOB_MONTH.JULY:
            queryDobMonth = 'MONTH(dob) = 7'
            break;
        case ORDER_BY.DOB_MONTH.AUGUST:
            queryDobMonth = 'MONTH(dob) = 8'
            break;
        case ORDER_BY.DOB_MONTH.SEPTEMBER:
            queryDobMonth = 'MONTH(dob) = 9'
            break;
        case ORDER_BY.DOB_MONTH.OCTOBER:
            queryDobMonth = 'MONTH(dob) = 10'
            break;
        case ORDER_BY.DOB_MONTH.NOVEMBER:
            queryDobMonth = 'MONTH(dob) = 11'
            break;
        case ORDER_BY.DOB_MONTH.DECEMBER:
            queryDobMonth = 'MONTH(dob) = 12'
            break;
        default:
            break;
    }

    let listMember = await Member.findAndCountAll({
        where: {
            isActive: ACTIVE,
            [Op.and]: [
                literal(queryStatus),
                literal(querySearch),
                literal(queryDobMonth)
            ]
        },
        order: literal(queryOrderBy),
        offset: offset,
        limit: limit
    })

    return {
        totalCount: listMember.count,
        totalPage: Math.ceil(listMember.count / limit),
        items: listMember.rows
    }
}

async function getUserInfo(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION
    return await getMemberDetail(req.auth.id)
}

async function getMemberInfo(req, res) {
    if (!req.query.id) throw API_CODE.INVALID_PARAM
    return await getMemberDetail(req.query.id)
}

async function getMemberDetail(memberId) {
    let memberDetail = await Member.findOne({
        where: {
            isActive: ACTIVE,
            id: memberId
        },
        attributes: [
            'id', 'token', 'account', 'name', 'address', 'dob', 'joinedDate', 'phone', 'email', 'role', 'note'
        ]
    })
    if (!memberDetail) throw API_CODE.NOT_FOUND
    return memberDetail
}

async function createMember(req, res) {
    if (!req.auth.role || req.auth.role == ROLE.MEMBER)
        throw API_CODE.NO_PERMISSION

    let { account, name, address, dob, joinedDate, phone, email, role, note } = req.body
    if (!account ||
        !name ||
        !phone ||
        !address ||
        !dob ||
        !role) throw API_CODE.REQUIRE_FIELD

    let checkAccount = await Member.findOne({
        where: {
            isActive: ACTIVE,
            [Op.or]: [
                { account: account },
                { phone: phone }
            ]
        }
    })
    if (checkAccount && checkAccount.account == account) throw API_CODE.ACCOUNT_EXIST
    if (checkAccount && checkAccount.phone == phone) throw API_CODE.PHONE_EXIST

    let hash = bcrypt.hashSync(CONFIG.DEFAULT_PASSWORD, CONFIG.CRYPT_SALT)
    let newMember = await Member.create({
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
    if (!req.auth.role || req.auth.role == ROLE.MEMBER)
        throw API_CODE.NO_PERMISSION

    let { id, account, name, address, dob, joinedDate, phone, email, role, note, status } = req.body
    if (!account ||
        !name ||
        !phone ||
        !address ||
        !dob ||
        typeof status != "number" ||
        !role) throw API_CODE.REQUIRE_FIELD

    let memberUpdate = await Member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if (!memberUpdate) throw API_CODE.NOT_FOUND

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
    return await getMemberDetail(id)
}

async function deleteMember(req, res) {
    if (!req.auth.role || req.auth.role == ROLE.MEMBER)
        throw API_CODE.NO_PERMISSION

    let id = req.body.id
    if (!id) throw API_CODE.INVALID_PARAM

    let memberDelete = await Member.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if (!memberDelete) throw API_CODE.NOT_FOUND

    await memberDelete.update({
        isActive: IS_ACTIVE.INACTIVE
    })
    return
}


module.exports = {
    getListMember,
    getUserInfo,
    getMemberInfo,
    getMemberDetail,
    createMember,
    updateMember,
    deleteMember,
}
