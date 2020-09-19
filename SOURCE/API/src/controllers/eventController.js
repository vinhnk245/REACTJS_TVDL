const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const {
    event: Event
} = require("@models")
const { success, error } = require("../commons/response")

async function getListEvent(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit

    let queryOrderBy = 'id DESC'
    if (req.query.orderBy == ORDER_BY.EVENT.EVENT_DATE_DESC)
        queryOrderBy = 'eventDate DESC'

    let listEvent = await Event.findAndCountAll({
        where: {
            isActive: ACTIVE
        },
        order: sequelize.literal(queryOrderBy),
        offset: offset,
        limit: limit
    })

    return {
        totalPage: Math.ceil(listEvent.count / limit),
        items: listEvent.rows
    }
}

async function getEventInfo(req, res) {
    if (!req.query.id) throw API_CODE.INVALID_PARAM
    return await getEventDetail(req.query.id)
}

async function getEventDetail(eventId) {
    let eventDetail = await Event.findOne({
        where: {
            isActive: ACTIVE,
            id: eventId
        }
    })
    if (!eventDetail) throw API_CODE.NOT_FOUND
    return eventDetail
}

async function createEvent(req, res) {
    console.log("Test " + req.auth.role)
    if (req.auth.role == ROLE.MEMBERS) throw API_CODE.NO_PERMISSION

    let { name, content, linkGoogleForm, eventDate } = req.body
    if (!name ||
        !content ||
        !linkGoogleForm ||
        !req.files.image ||
        !eventDate) throw API_CODE.REQUIRE_FIELD

    const urlImage = await uploadFile(req.files.image, CONFIG.PATH_IMAGE_EVENT)

    let newEvent = await Event.create({
        name: name,
        content: content,
        linkGoogleForm: linkGoogleForm,
        eventDate: Number(eventDate),
        createdMemberId: req.auth.id,
        image: urlImage
    })
    return await getEventDetail(newEvent.id)
}

async function updateEvent(req, res) {
    if (req.auth.role == ROLE.MEMBERS) throw API_CODE.NO_PERMISSION

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

    var urlImage = null
    if (req.files && req.files.image)
        urlImage = await uploadFile(req.files.image, CONFIG.PATH_IMAGE_EVENT)

    if (urlImage) {
        await eventUpdate.update({
            name: name,
            content: content,
            linkGoogleForm: linkGoogleForm,
            eventDate: Number(eventDate),
            image: urlImage
        })
    } else {
        await eventUpdate.update({
            name: name,
            content: content,
            linkGoogleForm: linkGoogleForm,
            eventDate: Number(eventDate)
        })
    }

    return await getEventDetail(eventUpdate.id)
}

async function deleteEvent(req, res) {
    if (req.auth.role == ROLE.MEMBERS)
        throw API_CODE.NO_PERMISSION

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

async function uploadImage(req, res) {
    const imageUpload = req.files.image
    if (!imageUpload) throw API_CODE.REQUIRE_IMAGE
    return req.url + await uploadFile(imageUpload, CONFIG.PATH_IMAGE_BOOK)
}

async function uploadFile(file, pathImage) {
    console.log(file)
    const fileType = file.mimetype.replace('image/', '')
    const fileName = `${hat()}.${fileType}`
    //Use the mv() method to place the file in upload directory
    file.mv(`./public/${pathImage}` + fileName)
    return pathImage + fileName
}

module.exports = {
    getListEvent,
    getEventInfo,
    createEvent,
    updateEvent,
    deleteEvent,
}
