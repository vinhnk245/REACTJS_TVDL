const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const {
    event: Event
} = require("@models")
const { success, error } = require("../commons/response")
const bookController = require('@controllers/bookController')

async function getListEvent(req, res) {
    const urlRequest = req.protocol + '://' + req.get('host') + '/'
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit

    let queryOrderBy = 'id DESC'
    if (req.query.orderBy == ORDER_BY.EVENT.EVENT_DATE_ASC)
        queryOrderBy = 'eventDate ASC'
    if (req.query.orderBy == ORDER_BY.EVENT.EVENT_DATE_DESC)
        queryOrderBy = 'eventDate DESC'

    let listEvent = await Event.findAndCountAll({
        where: {
            isActive: ACTIVE
        },
        order: literal(queryOrderBy),
        offset: offset,
        limit: limit,
        attributes: [
            'id', 'name', 'content', 'linkGoogleForm', 'eventDate',
            [fn('CONCAT', urlRequest, col('image')), 'image'],
        ]
    })

    return {
        totalCount: listEvent.count,
        totalPage: Math.ceil(listEvent.count / limit),
        items: listEvent.rows
    }
}

async function getEventInfo(req, res) {
    if (!req.query.id) throw API_CODE.INVALID_PARAM
    const urlRequest = req.protocol + '://' + req.get('host') + '/'
    return await getEventDetail(req.query.id, urlRequest)
}

async function getEventDetail(eventId, urlRequest) {
    let eventDetail = await Event.findOne({
        where: {
            isActive: ACTIVE,
            id: eventId
        },
        attributes: [
            'id', 'name', 'content', 'linkGoogleForm', 'eventDate',
            [fn('CONCAT', urlRequest, col('image')), 'image'],
        ]
    })
    if (!eventDetail) throw API_CODE.NOT_FOUND
    return eventDetail
}

async function createEvent(req, res) {
    if (!req.auth.role || req.auth.role == ROLE.MEMBER) throw API_CODE.NO_PERMISSION

    let { name, content, linkGoogleForm, eventDate } = req.body
    if (!name ||
        !content ||
        !linkGoogleForm ||
        !req.files.image ||
        !eventDate) throw API_CODE.REQUIRE_FIELD

    const urlImage = await bookController.uploadFile(req.files.image, CONFIG.PATH_IMAGE_EVENT)

    let newEvent = await Event.create({
        name: name,
        content: content,
        linkGoogleForm: linkGoogleForm,
        eventDate: Number(eventDate),
        createdMemberId: req.auth.id,
        image: urlImage
    })
    return await getEventDetail(newEvent.id, req.url)
}

async function updateEvent(req, res) {
    if (!req.auth.role || req.auth.role == ROLE.MEMBER) throw API_CODE.NO_PERMISSION

    let { id, name, content, linkGoogleForm, eventDate } = req.body
    if (!id ||
        !name ||
        !content ||
        !linkGoogleForm ||
        !eventDate) throw API_CODE.REQUIRE_FIELD

    let eventUpdate = await Event.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })

    if (!eventUpdate) throw API_CODE.NOT_FOUND

    let urlImage = null
    if (req.files && req.files.image)
        urlImage = await bookController.uploadFile(req.files.image, CONFIG.PATH_IMAGE_EVENT)

    let dataUpdate = {
        name: name,
        content: content,
        linkGoogleForm: linkGoogleForm,
        eventDate: Number(eventDate)
    }
    if (urlImage) dataUpdate.image = urlImage

    await eventUpdate.update(dataUpdate)

    return await getEventDetail(id, req.url)
}

async function deleteEvent(req, res) {
    if (!req.auth.role || req.auth.role == ROLE.MEMBER) throw API_CODE.NO_PERMISSION

    let id = req.body.id
    if (!id) throw API_CODE.INVALID_PARAM

    let eventDelete = await Event.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if (!eventDelete) throw API_CODE.NOT_FOUND

    await eventDelete.update({
        isActive: IS_ACTIVE.INACTIVE
    })
    return
}

module.exports = {
    getListEvent,
    getEventInfo,
    createEvent,
    updateEvent,
    deleteEvent,
}
