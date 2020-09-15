const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { 
    book: Book, 
    book_category: BookCategory
} = require("@models")
const { success, error } = require("../commons/response")

async function getListBook(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit
    let text = (req.query.text || '').trim()
    let querySearch = text.length > 0 
        ? `name like '%${text}%' or code like '%${text}%' or author like '%${text}%' or publishers like '%${text}%'` 
        : ''
    
    let queryBookCategory = req.query.bookCategoryId ? `bookCategoryId = ${req.query.bookCategoryId}` : ``

    let queryOrderBy = 'id DESC'
    if(req.query.orderBy == ORDER_BY.BOOK.QTY_DESC)
        queryOrderBy = 'qty DESC'
    if(req.query.orderBy == ORDER_BY.BOOK.LOST_DESC)
        queryOrderBy = 'lost DESC'
    if(req.query.orderBy == ORDER_BY.BOOK.AVAILABLE_DESC)
        queryOrderBy = 'available DESC'

    let listBook = await Book.findAndCountAll({
      where: {
        isActive: ACTIVE,
        [Op.and]: [
            sequelize.literal(queryBookCategory),
            sequelize.literal(querySearch)
        ]
      },
      order: sequelize.literal(queryOrderBy),
      offset: offset,
      limit: limit
    })

    return {
      totalPage: Math.ceil(listBook.count / limit),
      items: listBook.rows
    }
}

async function getBookInfo(req, res) {
    if(!req.query.id) throw API_CODE.INVALID_PARAM
    return await getBookDetail(req.query.id)
}

async function getBookDetail(bookId) {
    let bookDetail = await Book.findOne({
        where: {
            isActive: ACTIVE,
            id: bookId
        },
        include: [
            {
                model: BookCategory,
                require: false,
                attributes: []
            }
        ],
        attributes: [
            'id', 'name', 'code', 'qty', 'lost', 'available', 'note', 'description', 'author', 'publishers', 'publishingYear',
            [sequelize.col("book_category.name"), "bookCategoryName"],
            [sequelize.col("book_category.code"), "bookCategoryCode"],
            [sequelize.col("book_category.logo"), "bookCategoryLogo"]
        ]
    })
    if(!bookDetail) throw API_CODE.NOT_FOUND
    return bookDetail
}

async function createBook(req, res) {
    if(req.auth.role == ROLE.MEMBERS) throw API_CODE.NO_PERMISSION

    let { bookCategoryId, name, code, qty, available, note, description, author, publishers, publishingYear } = req.body
    if(!bookCategoryId || 
        !name || 
        !code || 
        typeof qty != 'number' ||
        typeof available != 'number') throw API_CODE.REQUIRE_FIELD

    if(qty < available) throw API_CODE.ERROR_QTY_LESS_AVAILABLE

    let findCategory = await BookCategory.findOne({
        where: {
            isActive: ACTIVE,
            id: bookCategoryId
        }
    })
    if(!findCategory) throw API_CODE.CATEGORY_NOT_FOUND

    code = findCategory.code + code
    let findBook = await Book.findOne({
        where: {
            isActive: ACTIVE,
            code: code
        }
    })
    if(findBook) throw API_CODE.BOOK_CODE_EXIST

    let newBook = await Book.create({
        bookCategoryId: bookCategoryId,
        code: code,
        name: name,
        qty: qty,
        available: available,
        note: note,
        description: description,
        author: author,
        publishers: publishers,
        publishingYear: publishingYear,
        createdMemberId: req.auth.id
    })
    return await getBookDetail(newBook.id)
}

async function updateBook(req, res) {
    if(req.auth.role == ROLE.MEMBERS) throw API_CODE.NO_PERMISSION

    let { id, bookCategoryId, name, code, qty, lost, available, note, description, author, publishers, publishingYear } = req.body
    if(!id ||
        !bookCategoryId || 
        !name || 
        !code || 
        typeof qty != 'number' ||
        typeof lost != 'number' ||
        typeof available != 'number') throw API_CODE.REQUIRE_FIELD

    if(qty < available) throw API_CODE.ERROR_QTY_LESS_AVAILABLE
    if(qty < lost || qty - lost != available) throw API_CODE.ERROR_QTY_LOST_AVAILABLE

    let bookUpdate = await Book.findOne({
        where: {
            isActive: ACTIVE,
            id: id
        }
    })
    if(!bookUpdate) throw API_CODE.NOT_FOUND

    let findCategory = await BookCategory.findOne({
        where: {
            isActive: ACTIVE,
            id: bookCategoryId
        }
    })
    if(!findCategory) throw API_CODE.CATEGORY_NOT_FOUND
    
    code = findCategory.code + code
    if (bookUpdate.code != code) {
        let findBook = await Book.findOne({
            where: {
                isActive: ACTIVE,
                code: code
            }
        })
        if(findBook) throw API_CODE.BOOK_CODE_EXIST
    }

    await bookUpdate.update({
        bookCategoryId: bookCategoryId,
        code: code,
        name: name,
        qty: qty,
        lost: lost,
        available: available,
        note: note,
        description: description,
        author: author,
        publishers: publishers,
        publishingYear: publishingYear,
        updatedMemberId: req.auth.id,
        updatedDate: Date.now()
    })

    return await getBookDetail(bookUpdate.id)
}

async function deleteBook(req, res) {
    // if(req.auth.role == ROLE.MEMBERS)
    //     throw API_CODE.NO_PERMISSION

    // let id = req.body.id
    // if(!id) throw API_CODE.INVALID_PARAM

    // let memberDelete = await member.findOne({
    //     where: {
    //         isActive: ACTIVE,
    //         id: id
    //     }
    // })
    // if(!memberDelete) throw API_CODE.NOT_FOUND

    // await memberDelete.update({
    //     isActive: IS_ACTIVE.INACTIVE
    // })
    // return
}


module.exports = {
    getListBook,
    getBookInfo,
    getBookDetail,
    createBook,
    updateBook,
    deleteBook,
}
