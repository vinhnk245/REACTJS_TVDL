const { Sequelize, Op, fn, col, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY, YES_OR_NO, CATEGORY, RENTED_BOOK_STATUS } = require("@utils/constant")
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


async function getRentedBookHistory(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit

    let cardNumber = (req.query.cardNumber || '').trim()
    let readerName = (req.query.readerName || '').trim()
    let bookCode = (req.query.bookCode || '').trim()
    let bookName = (req.query.bookName || '').trim()
    let searchCardNumber = cardNumber.length > 0  ? `reader.cardNumber = '${cardNumber}'` : ''
    let searchReaderName = readerName.length > 0  ? `reader.name like '%${readerName}%'` : ''
    let searchBookCode = bookCode.length > 0  ? `code = '${bookCode}'` : ''
    let searchBookName = bookName.length > 0  ? `name like '%${bookName}%'` : ''

    let searchStatus = req.query.status  ? `rented_book.status = ${req.query.status}` : ''
    let searchFromDate = req.query.fromDate  ? `rented_book.borrowedDate >= FROM_UNIXTIME(${parseInt(req.query.fromDate.slice(0, 10))})` : ''
    let searchToDate = req.query.toDate  ? `rented_book.borrowedDate <= FROM_UNIXTIME(${parseInt(req.query.toDate.slice(0, 10))})` : ''

    let searchByReader = !req.auth.role ? `reader.id = ${req.auth.id}` : ''
    
    let queryOrderBy = 'rented_book.id DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.QTY_DESC)
    //     queryOrderBy = 'qty DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.LOST_DESC)
    //     queryOrderBy = 'lost DESC'
    // if(req.query.orderBy == ORDER_BY.BOOK.AVAILABLE_DESC)
    //     queryOrderBy = 'available DESC'

    let history = await RentedBook.findAndCountAll({
        subQuery: false,
        order: literal(queryOrderBy),
        offset,
        limit,
        //count distinct id
        distinct: true,
        col: 'id',
        where: {
            isActive: ACTIVE,
            [Op.and]: [
                literal(searchByReader),
                literal(searchCardNumber),
                literal(searchReaderName),
                literal(searchStatus),
                literal(searchFromDate),
                literal(searchToDate),
            ]
        },
        attributes: [
            'id', 'status', 'noteMember', 'readerId',
            [col("reader.cardNumber"), "readerCardNumber"],
            [col("reader.name"), "readerName"],
            'borrowedDate', 'borrowedConfirmMemberId',
            [col("borrowedConfirmMember.name"), "borrowedConfirmMemberName"],
        ],
        include: [
            {
                required: true,
                model: RentedBookDetail,
                include: [
                    {
                        model: Book,
                        attributes: [],
                        where: {
                            isActive: ACTIVE,
                            [Op.and]: [
                                literal(searchBookCode),
                                literal(searchBookName)
                            ]
                        }
                    },
                    {
                        model: Member,
                        as: 'returnedConfirmMemberRentedDetail',
                        attributes: []
                    }
                ],
                attributes: [
                    ['id', 'rentedBookDetailId'],
                    'status', 'lost', 'note', 'outOfDate', 'returnedDate', 'returnedConfirmMemberId',
                    [literal("`rented_book_details->returnedConfirmMemberRentedDetail`.`name`"), "returnedConfirmMemberName"],
                    [literal("`rented_book_details->book`.`id`"), "bookId"],
                    [literal("`rented_book_details->book`.`code`"), "bookCode"],
                    [literal("`rented_book_details->book`.`name`"), "bookName"],
                ]
            },
            {
                model: Reader,
                attributes: [],
                // where: {
                //     isActive: ACTIVE,
                //     // [Op.and]: [
                //     //     literal(searchCardNumber),
                //     //     literal(searchReaderName)
                //     // ]
                // }
            },
            {
                model: Member,
                as: 'borrowedConfirmMember',
                attributes: []
            }
        ]
    })

    return {
        totalCount: history.count,
        totalPage: Math.ceil(history.count / limit),
        items: history.rows
    }
}


async function getRentedBookDetail(req, res) {
    if(!req.query.id) throw API_CODE.INVALID_PARAM
    return await rentedDetail(req.query.id)
}


async function rentedDetail(id) {
    let detail = await RentedBook.findOne({
        subQuery: false,
        where: {
            isActive: ACTIVE,
            id
        },
        attributes: [
            'id', 'status', 'noteMember', 'readerId',
            [col("reader.cardNumber"), "readerCardNumber"],
            [col("reader.name"), "readerName"],
            'borrowedDate', 'borrowedConfirmMemberId',
            [col("borrowedConfirmMember.name"), "borrowedConfirmMemberName"],
        ],
        include: [
            {
                model: RentedBookDetail,
                include: [
                    {
                        model: Book,
                        attributes: []
                    },
                    {
                        model: Member,
                        as: 'returnedConfirmMemberRentedDetail',
                        attributes: []
                    }
                ],
                attributes: [
                    ['id', 'rentedBookDetailId'],
                    'status', 'lost', 'note', 'outOfDate', 'returnedDate', 'returnedConfirmMemberId',
                    [literal("`rented_book_details->returnedConfirmMemberRentedDetail`.`name`"), "returnedConfirmMemberName"],
                    [literal("`rented_book_details->book`.`id`"), "bookId"],
                    [literal("`rented_book_details->book`.`code`"), "bookCode"],
                    [literal("`rented_book_details->book`.`name`"), "bookName"],
                ]
            },
            {
                model: Reader,
                attributes: []
            },
            {
                model: Member,
                as: 'borrowedConfirmMember',
                attributes: []
            }
        ]
    })
    if(!detail) throw API_CODE.NOT_FOUND

    return detail
}


async function getTopBorrowedBook(req, res) {
   const topBorrowedBook = await sequelize.query(`
   select count(bookId) as count, bookId, book.name as bookName
   from rented_book_detail
   join book on book.id = rented_book_detail.bookId
   where rented_book_detail.isActive = 1
   group by bookId
   order by count desc, bookId desc limit ${CONFIG.LIMIT_TOP};`)

   if (!topBorrowedBook || topBorrowedBook.length === 0) return []
  
   return topBorrowedBook[0]
}


async function createRentedBook(req, res) {
    if(!req.auth.role) throw API_CODE.NO_PERMISSION

    let { readerId, noteMember, listBook } = req.body
    if(!readerId) throw API_CODE.REQUIRE_READER_RENTED_BOOK
    if(!Array.isArray(listBook) || listBook.length === 0) throw API_CODE.REQUIRE_LIST_BOOK_RENTED_BOOK
    if(listBook.length > 3) throw API_CODE.BORROWED_MAX_THREE

    let findReader = await Reader.findOne({
        id: readerId,
        isActive: ACTIVE
    })
    if(!findReader) throw API_CODE.READER_NOT_FOUND

    let checkBorrowed = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            readerId,
            returnedDate: null
        }
    })
    if (checkBorrowed > 0) throw API_CODE.RETURNED_BEFORE_BORROWED

    // let checkDuplicateBookId = []
    // let checkComicsCategory = []
    // let uniqueArray = listBook.filter(function(elem) {
    //     //check khong cho muon 2 quyen giong nhau
    //     if (checkDuplicateBookId.indexOf(elem.bookId) === -1) {

    //         //check neu co 2 quyen the loai truyen tranh
    //         if(elem.bookCategoryId === CATEGORY.TT && checkComicsCategory.includes(CATEGORY.TT)) throw API_CODE.DUPLICATE_COMICS_CATEGORY

    //         checkDuplicateBookId.push(elem.bookId)
    //         checkComicsCategory.push(elem.bookCategoryId)
    //         return true
    //     }
    //     throw API_CODE.DUPLICATE_BOOK_RENTED_BOOK
    // })

    let checkComicsCategory = []
    listBook = listBook.filter(function(elem) {
        //check khong cho muon 2 quyen truyen tranh
        if (elem.bookCategoryId === CATEGORY.TT && checkComicsCategory.includes(CATEGORY.TT)) 
            throw API_CODE.DUPLICATE_COMICS_CATEGORY

        checkComicsCategory.push(elem.bookCategoryId)
        return true
    })

    let data = await sequelize.transaction(async transaction => {
        let newRentedBook = await RentedBook.create({
            readerId,
            status: RENTED_BOOK_STATUS.BORROWED,
            noteMember,
            borrowedDate: Date.now(),
            borrowedConfirmMemberId: req.auth.id,
            isCreatedByMember: YES_OR_NO.YES,
            createdObjectId: req.auth.id
        },{ transaction })

        let arrayInsert = listBook.map(item => {
            return  { 
                readerId,
                rentedBookId: newRentedBook.id, 
                bookId: item.bookId,
                status: RENTED_BOOK_STATUS.BORROWED,
                borrowedDate: Date.now(),
                borrowedConfirmMemberId: req.auth.id,
            }
        })

        await RentedBookDetail.bulkCreate(arrayInsert, { transaction })
        return newRentedBook
    })
    return await rentedDetail(data.id)
}


async function updateRentedBook(req, res) {
    if(!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM

    let rentedBookUpdate = await RentedBook.findOne({
        where: {
            isActive: ACTIVE,
            id
        }
    })
    if (!rentedBookUpdate) throw API_CODE.NOT_FOUND
    if (rentedBookUpdate.status === RENTED_BOOK_STATUS.RETURNED) throw API_CODE.RENTED_BOOK_WAS_RETURNED

    let dataUpdate = {
        status: RENTED_BOOK_STATUS.RETURNED,
        returnedDate: Date.now(),
        returnedConfirmMemberId: req.auth.id
    }

    let data = await sequelize.transaction(async transaction => {
        await Promise.all([
            rentedBookUpdate.update(dataUpdate, { transaction }),
            RentedBookDetail.update(dataUpdate, {
                transaction,
                where: {
                    isActive: ACTIVE,
                    rentedBookId: id,
                    returnedDate: null
                }
            })
        ])
    })
    return await rentedDetail(id)
}


async function updateRentedBookDetail(req, res) {
    if(!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id, status, lost, note } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM

    let rentedBookDetailUpdate = await RentedBookDetail.findOne({
        where: {
            isActive: ACTIVE,
            id
        }
    })
    if (!rentedBookDetailUpdate) throw API_CODE.NOT_FOUND

    let findRentedBook = await RentedBook.findOne({
        where: {
            isActive: ACTIVE,
            id: rentedBookDetailUpdate.rentedBookId
        }
    })

    let dataUpdate = {
        status,
        lost,
        note,
    }

    let data = await sequelize.transaction(async transaction => {
        if (rentedBookDetailUpdate.status === RENTED_BOOK_STATUS.RETURNED && status === RENTED_BOOK_STATUS.BORROWED) {
            dataUpdate.returnedDate = null
            dataUpdate.returnedConfirmMemberId = null
    
            if (findRentedBook.status === RENTED_BOOK_STATUS.RETURNED) {
                await findRentedBook.update({ status: RENTED_BOOK_STATUS.BORROWED }, { transaction })
            }
        }
        if (rentedBookDetailUpdate.status === RENTED_BOOK_STATUS.BORROWED && status === RENTED_BOOK_STATUS.RETURNED) {
            dataUpdate.returnedDate = Date.now()
            dataUpdate.returnedConfirmMemberId = req.auth.id
        }
        await rentedBookDetailUpdate.update(dataUpdate, { transaction })
    })
    let checkRentedFinish = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            rentedBookId: rentedBookDetailUpdate.rentedBookId,
            returnedDate: null
        }
    })
    if (checkRentedFinish && checkRentedFinish === 0) {
        await findRentedBook.update({ status: RENTED_BOOK_STATUS.RETURNED }, { transaction })
    }
    return await rentedDetail(rentedBookDetailUpdate.rentedBookId)
}


module.exports = {
    getRentedBookHistory,
    getRentedBookDetail,
    createRentedBook,
    updateRentedBook,
    updateRentedBookDetail,
    getTopBorrowedBook,
}
