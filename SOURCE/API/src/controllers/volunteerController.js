const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY, VOLUNTEER_STATUS } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { volunteer: Volunteer, member: Member} = require("@models")
const { regexPhone } = require("@utils/utils")

async function getListVolunteerRegistration(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit
    let text = (req.query.text || '').trim()
    let querySearch = text.length > 0 
        ? `(name like '%${text}%' or phone like '%${text}%' or email like '%${text}%' or address like '%${text}%')` 
        : ''

    let queryStatus = req.query.status ? `status = ${req.query.status}` : ``

    let queryOrderBy = 'id DESC'
    if(req.query.orderBy == ORDER_BY.VOLUNTEER.CREATED_DATE_ASC)
        queryOrderBy = 'createdDate ASC'
    if(req.query.orderBy == ORDER_BY.VOLUNTEER.CREATED_DATE_DESC)
        queryOrderBy = 'createdDate DESC'
    if(req.query.orderBy == ORDER_BY.VOLUNTEER.DOB_ASC)
        queryOrderBy = 'dob ASC'
    if(req.query.orderBy == ORDER_BY.VOLUNTEER.DOB_DESC)
        queryOrderBy = 'dob DESC'

    let listVolunteer = await Volunteer.findAndCountAll({
        where: {
            isActive: ACTIVE,
            [Op.and]: [
                literal(queryStatus),
                literal(querySearch)
            ]
        },
        order: literal(queryOrderBy),
        offset: offset,
        limit: limit
    })

    return {
        totalCount: listVolunteer.count,
        totalPage: Math.ceil(listVolunteer.count / limit),
        items: listVolunteer.rows
    }
}

async function volunteerRegistration(req, res) {
    const { name, phone, email, linkFacebook, dob, reasons, contributes } = req.body
    if(!name ||
        !phone ||
        !email ||
        !linkFacebook ||
        !dob ||
        !reasons ||
        !contributes) throw API_CODE.REQUIRE_FIELD

    if (!regexPhone(phone)) throw API_CODE.INVALID_PHONE

    let checkRequest = await Volunteer.findOne({
        where: {
            isActive: ACTIVE,
            phone: phone,
            status: {
                [Op.ne]: VOLUNTEER_STATUS.REJECT
            }
        }
    })
    if(checkRequest) throw API_CODE.VOLUNTEER_REGISTRATION_EXIST

    await Volunteer.create({
        name,
        phone,
        email,
        linkFacebook,
        dob,
        reasons,
        contributes,
        status: VOLUNTEER_STATUS.PENDING
    })
    return
}

async function acceptRequestVolunteer(req, res) {
    if(!req.auth.role || req.auth.role == ROLE.MEMBER)
        throw API_CODE.NO_PERMISSION

    const { id, account } = req.body
    if(typeof id != 'number') throw API_CODE.INVALID_PARAM
    if(!account) throw API_CODE.ACCEPT_VOLUNTEER_REQUIRE_ACCOUNT

    let findVolunteer = await Volunteer.findOne({
        where: {
            isActive: ACTIVE,
            id
        }
    })
    if (!findVolunteer) throw API_CODE.NOT_FOUND
    if (findVolunteer.status == VOLUNTEER_STATUS.ACCEPT) throw API_CODE.VOLUNTEER_HAS_BEEN_MEMBER
    if (findVolunteer.status == VOLUNTEER_STATUS.REJECT) throw API_CODE.VOLUNTEER_REGISTRATION_REJECTED

    let checkAccount = await Member.findOne({
        where: {
            isActive: ACTIVE,
            account
        }
    })
    if (checkAccount) throw API_CODE.ACCOUNT_EXIST

    let hash = bcrypt.hashSync(CONFIG.DEFAULT_PASSWORD, CONFIG.CRYPT_SALT)
    let newMember = null
    let data = await sequelize.transaction(async transaction => {
        await Promise.all([
            newMember = await Member.create({
                account,
                password: hash,
                name: findVolunteer.name,
                address: findVolunteer.address,
                phone: findVolunteer.phone,
                email: findVolunteer.email,
                dob: findVolunteer.dob,
                joinedDate: Date.now(),
                role: ROLE.MEMBER,
                createdMemberId: req.auth.id
            }, { transaction }),
            findVolunteer.update({ 
                status: VOLUNTEER_STATUS.ACCEPT,
                updatedDate: Date.now(),
                updatedMemberId: req.auth.id,
            }, { transaction })
        ])
        return newMember
    })
    return data
}

async function rejectRequestVolunteer(req, res) {
    if(req.auth.role == ROLE.MEMBER)
        throw API_CODE.NO_PERMISSION

    const { id, note } = req.body
    if(typeof id != 'number') throw API_CODE.INVALID_PARAM
    if(!note) throw API_CODE.REJECT_VOLUNTEER_REQUIRE_NOTE

    let findVolunteer = await Volunteer.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if (!findVolunteer) throw API_CODE.NOT_FOUND
    if (findVolunteer.status == VOLUNTEER_STATUS.ACCEPT) throw API_CODE.VOLUNTEER_REGISTRATION_ACCEPTED
    if (findVolunteer.status == VOLUNTEER_STATUS.REJECT) throw API_CODE.VOLUNTEER_REGISTRATION_REJECTED

    await findVolunteer.update({
        status: VOLUNTEER_STATUS.REJECT,
        updatedMemberId: req.auth.id,
        updatedDate: Date.now()
    })
    return
}


module.exports = {
    volunteerRegistration,
    getListVolunteerRegistration,
    acceptRequestVolunteer,
    rejectRequestVolunteer,
}
