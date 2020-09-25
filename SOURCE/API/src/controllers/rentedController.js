const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY, YES_OR_NO } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { 
    rented_book: RentedBook,
    rented_book_detail: RentedBookDetail,
    book: Book,
    reader: Reader,
    member: Member,
} = require("@models")
const { success, error } = require("../commons/response")


async function getListRentedBook(req, res) {
    // const urlRequest = req.protocol + '://' + req.get('host') + '/'

    // let page = !req.query.page ? 0 : req.query.page - 1
    // let limit = parseInt(req.query.limit || LIMIT)
    // if (page < 0) throw API_CODE.PAGE_ERROR
    // let offset = page * limit
    // let text = (req.query.text || '').trim()
    // let querySearch = text.length > 0 
    //     ? `name like '%${text}%' or code like '%${text}%' or author like '%${text}%' or publishers like '%${text}%'` 
    //     : ''
    
    // let queryBookCategory = req.query.bookCategoryId ? `bookCategoryId = ${req.query.bookCategoryId}` : ``

    // let queryOrderBy = 'id DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.QTY_DESC)
    //     queryOrderBy = 'qty DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.LOST_DESC)
    //     queryOrderBy = 'lost DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.AVAILABLE_DESC)
    //     queryOrderBy = 'available DESC'

    // let listBook = await Book.findAndCountAll({
    //     where: {
    //         isActive: ACTIVE,
    //         [Op.and]: [
    //             sequelize.literal(queryBookCategory),
    //             sequelize.literal(querySearch)
    //         ]
    //     },
    //     include: [
    //         {
    //             model: BookCategory,
    //             attributes: []
    //         }
    //     ],
    //     attributes: [
    //         'id', 'name', 'code', 'qty', 'lost', 'available', 'note', 'description', 'author', 'publishers', 'publishingYear',
    //         [sequelize.col("book_category.name"), "bookCategoryName"],
    //         [sequelize.col("book_category.code"), "bookCategoryCode"],
    //         [sequelize.fn('CONCAT', urlRequest, sequelize.col("book_category.logo")), 'bookCategoryLogo']
    //     ],
    //     order: sequelize.literal(queryOrderBy),
    //     offset: offset,
    //     limit: limit
    // })

    // await Promise.all(
    //     listBook.rows.map(async book => {
    //         book.dataValues.image = await getBookImages(book.id, urlRequest)
    //     })
    // )

    // return {
    //     totalCount: listBook.count,
    //     totalPage: Math.ceil(listBook.count / limit),
    //     items: listBook.rows
    // }
}

async function getRentedBookInfo(req, res) {
    if(!req.query.id) throw API_CODE.INVALID_PARAM
    return await getRentedBookDetail(req.query.id, req.url)
}

async function getRentedBookDetail(bookId, urlRequest) {
    // let bookDetail = await Book.findOne({
    //     where: {
    //         isActive: ACTIVE,
    //         id: bookId
    //     },
    //     include: [
    //         {
    //             model: BookCategory,
    //             attributes: []
    //         }
    //     ],
    //     attributes: [
    //         'id', 'name', 'code', 'qty', 'lost', 'available', 'note', 'description', 'author', 'publishers', 'publishingYear',
    //         [sequelize.col("book_category.name"), "bookCategoryName"],
    //         [sequelize.col("book_category.code"), "bookCategoryCode"],
    //         [sequelize.fn('CONCAT', urlRequest, sequelize.col("book_category.logo")), 'bookCategoryLogo']
    //     ]
    // })
    // if(!bookDetail) throw API_CODE.NOT_FOUND

    // bookDetail.dataValues.image = await getBookImages(bookId, urlRequest)
    // return bookDetail
}

async function createRentedBook(req, res) {
    if(!req.auth.role) throw API_CODE.NO_PERMISSION

    let { readerId, noteMember, listBook } = req.body
    if(!readerId) throw API_CODE.REQUIRE_READER_RENTED_BOOK
    if(!Array.isArray(listBook) || listBook.length === 0) throw API_CODE.REQUIRE_LIST_BOOK_RENTED_BOOK

    // let data = await sequelize.transaction(async transaction => {
    //     let newBook = await Book.create({
    //         bookCategoryId: bookCategoryId,
    //         code: code,
    //         name: name,
    //         qty: qty,
    //         available: available,
    //         note: note,
    //         description: description,
    //         author: author,
    //         publishers: publishers,
    //         publishingYear: publishingYear,
    //         createdMemberId: req.auth.id
    //     },{ transaction })
    
    //     if(req.files && req.files.image) {
    //         const urlImage = await uploadFile(req.files.image, CONFIG.PATH_IMAGE_BOOK)
    //         await BookImage.create({
    //             bookId: newBook.id,
    //             image: urlImage,
    //             createdMemberId: req.auth.id
    //         },{ transaction })
    //     }
    //     return newBook
    // });
    // return await getRentedBookDetail(data.id, req.url)
    
}

async function updateRentedBook(req, res) {
    // if(req.auth.role == ROLE.MEMBER) throw API_CODE.NO_PERMISSION

    // let { id, bookCategoryId, name, code, qty, lost, available, note, description, author, publishers, publishingYear } = req.body
    // if(!id ||
    //     !bookCategoryId || 
    //     !name || 
    //     !code || 
    //     typeof qty != 'number' ||
    //     typeof lost != 'number' ||
    //     typeof available != 'number') throw API_CODE.REQUIRE_FIELD

    // if(qty < available) throw API_CODE.ERROR_QTY_LESS_AVAILABLE
    // if(qty < lost || qty - lost != available) throw API_CODE.ERROR_QTY_LOST_AVAILABLE

    // let bookUpdate = await Book.findOne({
    //     where: {
    //         isActive: ACTIVE,
    //         id: id
    //     }
    // })
    // if(!bookUpdate) throw API_CODE.NOT_FOUND

    // let findCategory = await BookCategory.findOne({
    //     where: {
    //         isActive: ACTIVE,
    //         id: bookCategoryId
    //     }
    // })
    // if(!findCategory) throw API_CODE.CATEGORY_NOT_FOUND
    
    // code = findCategory.code + code
    // if (bookUpdate.code != code) {
    //     let findBook = await Book.findOne({
    //         where: {
    //             isActive: ACTIVE,
    //             code: code
    //         }
    //     })
    //     if(findBook) throw API_CODE.BOOK_CODE_EXIST
    // }

    // await bookUpdate.update({
    //     bookCategoryId: bookCategoryId,
    //     code: code,
    //     name: name,
    //     qty: qty,
    //     lost: lost,
    //     available: available,
    //     note: note,
    //     description: description,
    //     author: author,
    //     publishers: publishers,
    //     publishingYear: publishingYear,
    //     updatedMemberId: req.auth.id,
    //     updatedDate: Date.now()
    // })

    return await getRentedBookDetail(bookUpdate.id)
}


module.exports = {
    getListRentedBook,
    getRentedBookInfo,
    createRentedBook,
    updateRentedBook,
}
