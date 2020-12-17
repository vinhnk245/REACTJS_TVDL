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
    book_category: BookCategory,
    book_image: BookImage,
    reader: Reader,
    member: Member,
} = require("@models")
const { success, error } = require("../commons/response")
const bookController = require('@controllers/bookController')


async function getRentedBookHistory(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit

    let cardNumber = (req.query.cardNumber || '').trim()
    let readerName = (req.query.readerName || '').trim()
    let bookCode = (req.query.bookCode || '').trim()
    let bookName = (req.query.bookName || '').trim()
    let searchCardNumber = cardNumber.length > 0 ? `reader.cardNumber = '${cardNumber}'` : ''
    let searchReaderName = readerName.length > 0 ? `reader.name like '%${readerName}%'` : ''
    // let searchBookCode = bookCode.length > 0 ? `code = '${bookCode}'` : ''
    let searchBookName = bookName.length > 0 ? `name like '%${bookName}%'` : ''

    let searchStatus = req.query.status ? `rented_book.status = ${req.query.status}` : `rented_book.status in (${RENTED_BOOK_STATUS.BORROWED}, ${RENTED_BOOK_STATUS.RETURNED})`
    let searchFromDate = req.query.fromDate ? `rented_book.borrowedDate >= FROM_UNIXTIME(${parseInt(req.query.fromDate.slice(0, 10))})` : ''
    let searchToDate = req.query.toDate ? `rented_book.borrowedDate <= FROM_UNIXTIME(${parseInt(req.query.toDate.slice(0, 10))})` : ''

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
            'borrowedDate', 'returnedDate', 'borrowedConfirmMemberId',
            [col("borrowedConfirmMember.name"), "borrowedConfirmMemberName"],
        ],
        include: [
            {
                separate: true,
                // required: true,
                where: {
                    isActive: ACTIVE
                },
                model: RentedBookDetail,
                include: [
                    {
                        model: Book,
                        attributes: [],
                        where: {
                            isActive: ACTIVE,
                            [Op.and]: [
                                // literal(searchBookCode),
                                literal(searchBookName)
                            ]
                        },
                        include: [
                            {
                                model: BookCategory,
                                attributes: []
                            }
                        ],
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
                    [literal("`returnedConfirmMemberRentedDetail`.`name`"), "returnedConfirmMemberName"],
                    [literal("`book`.`id`"), "bookId"],
                    [literal("`book`.`code`"), "bookCode"],
                    [literal("`book`.`name`"), "bookName"],
                    [literal("`book`.`description`"), "bookDescription"],
                    [literal("`book`.`author`"), "author"],
                    [literal("`book`.`publishers`"), "publishers"],
                    [literal("`book`.`publishingYear`"), "publishingYear"],
                    [literal("`book->book_category`.`name`"), "categoryName"],
                    [literal("`book->book_category`.`code`"), "categoryCode"],
                    [literal("`book->book_category`.`description`"), "categoryDescription"],
                    [fn('CONCAT', req.url, col('`book->book_category`.`logo`')), 'categoryLogo']

                    // doan nay dung khi required : true nhung limit offset sai
                    // [literal("`rented_book_details->returnedConfirmMemberRentedDetail`.`name`"), "returnedConfirmMemberName"],
                    // [literal("`rented_book_details->book`.`id`"), "bookId"],
                    // [literal("`rented_book_details->book`.`code`"), "bookCode"],
                    // [literal("`rented_book_details->book`.`name`"), "bookName"],
                    // [literal("`rented_book_details->book`.`description`"), "bookDescription"],
                    // [literal("`rented_book_details->book`.`author`"), "author"],
                    // [literal("`rented_book_details->book`.`publishers`"), "publishers"],
                    // [literal("`rented_book_details->book`.`publishingYear`"), "publishingYear"],
                    // [literal("`rented_book_details->book->book_category`.`name`"), "categoryName"],
                    // [literal("`rented_book_details->book->book_category`.`code`"), "categoryCode"],
                    // [literal("`rented_book_details->book->book_category`.`description`"), "categoryDescription"],
                    // [fn('CONCAT', req.url, col('`rented_book_details->book->book_category`.`logo`')), 'categoryLogo']
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

    await Promise.all(
        history.rows.map(async rented => {
            if (rented.rented_book_details.length > 0) {
                await Promise.all(
                    rented.rented_book_details.map(async rentedDetail => {
                        rentedDetail.dataValues.bookImage = await bookController.getBookImages(rentedDetail.bookId, req.url)
                    })
                )
            }
        })
    )

    return {
        totalCount: history.count,
        totalPage: Math.ceil(history.count / limit),
        items: history.rows
    }
}


async function getRentedBookDetail(req, res) {
    if (!req.query.id) throw API_CODE.INVALID_PARAM
    return await rentedDetail(req.query.id, req.url)
}


async function rentedDetail(id, urlRequest) {
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
                required: false,
                model: RentedBookDetail,
                where: {
                    isActive: ACTIVE
                },
                include: [
                    {
                        model: Book,
                        attributes: [],
                        include: [
                            {
                                model: BookCategory,
                                attributes: []
                            }
                        ]
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
                    [literal("`rented_book_details->book`.`description`"), "bookDescription"],
                    [literal("`rented_book_details->book`.`author`"), "author"],
                    [literal("`rented_book_details->book`.`publishers`"), "publishers"],
                    [literal("`rented_book_details->book`.`publishingYear`"), "publishingYear"],
                    [literal("`rented_book_details->book->book_category`.`name`"), "categoryName"],
                    [literal("`rented_book_details->book->book_category`.`code`"), "categoryCode"],
                    [literal("`rented_book_details->book->book_category`.`description`"), "categoryDescription"],
                    [fn('CONCAT', urlRequest, col('`rented_book_details->book->book_category`.`logo`')), 'categoryLogo']
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
    if (!detail) throw API_CODE.NOT_FOUND

    if (detail.rented_book_details.length > 0) {
        await Promise.all(
            detail.rented_book_details.map(async rentedDetail => {
                rentedDetail.dataValues.bookImage = await bookController.getBookImages(rentedDetail.bookId, urlRequest)
            })
        )
    }

    return detail
}


async function getTopBorrowedBook(req, res) {
    const urlRequest = req.protocol + '://' + req.get('host') + '/'
    const topBorrowedBook = await sequelize.query(`
    select count(bookId) as count, 
    bookId, 
    book.name as bookName,
    book.code as bookCode,
    book.description as bookDescription,
    book.author,
    book.publishers,
    book.publishingYear,
    book_category.name as categoryName,
    book_category.code as categoryCode,
    book_category.description as categoryDescription,
    CONCAT('${urlRequest}', book_category.logo) as categoryLogo
    from rented_book_detail
    join book on book.id = rented_book_detail.bookId
    join book_category on book_category.id = book.bookCategoryId
    where rented_book_detail.isActive = 1 and rented_book_detail.status in (${RENTED_BOOK_STATUS.BORROWED}, ${RENTED_BOOK_STATUS.RETURNED})
    group by bookId
    order by count desc, bookId desc limit ${CONFIG.LIMIT_TOP};`)

    if (!topBorrowedBook || topBorrowedBook.length === 0) return []
    let data = topBorrowedBook[0]
    await Promise.all(
        data.map(async book => {
            book.bookImage = await bookController.getBookImages(book.bookId, urlRequest)
        })
    )
    return data
}


async function getTopBorrowedReader(req, res) {
    const topBorrowedReader = await sequelize.query(`
    select count(readerId) as totalBorrowed,
    readerId,
    reader.name as readerName,
    reader.cardNumber,
    reader.address,
    reader.dob,
    reader.parentName,
    reader.parentPhone,
    reader.lost as totalLost
    from rented_book_detail
    join reader on reader.id = rented_book_detail.readerId
    where rented_book_detail.isActive = 1 and rented_book_detail.status in (${RENTED_BOOK_STATUS.BORROWED}, ${RENTED_BOOK_STATUS.RETURNED})
    group by readerId
    order by totalBorrowed desc, readerId desc limit ${CONFIG.LIMIT_TOP};`)

    if (!topBorrowedReader || topBorrowedReader.length === 0) return []
    let data = topBorrowedReader[0]
    return data
}


async function createRentedBook(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { readerId, noteMember, listBook } = req.body
    if (!readerId) throw API_CODE.REQUIRE_READER_RENTED_BOOK
    if (!Array.isArray(listBook) || listBook.length === 0) throw API_CODE.REQUIRE_LIST_BOOK_RENTED_BOOK
    if (listBook.length > 3) throw API_CODE.BORROWED_MAX_THREE

    let findReader = await Reader.findOne({
        id: readerId,
        isActive: ACTIVE
    })
    if (!findReader) throw API_CODE.READER_NOT_FOUND

    let checkBorrowed = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            readerId,
            returnedDate: null,
            status: {
                [Op.in]: [RENTED_BOOK_STATUS.BORROWED, RENTED_BOOK_STATUS.RETURNED]
            }
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
    listBook = listBook.filter(function (elem) {
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
        }, { transaction })

        let arrayInsert = listBook.map(item => {
            return {
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
    return await rentedDetail(data.id, req.url)
}


async function requestRentBook(req, res) {
    if (req.auth.role) throw API_CODE.NO_PERMISSION

    let { listBook } = req.body
    if (!Array.isArray(listBook) || listBook.length === 0) throw API_CODE.REQUIRE_LIST_BOOK_RENTED_BOOK
    if (listBook.length > 3) throw API_CODE.BORROWED_MAX_THREE

    let checkBorrowed = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            readerId: req.auth.id,
            status: RENTED_BOOK_STATUS.BORROWED,
        }
    })
    if (checkBorrowed && checkBorrowed > 0) throw API_CODE.RETURNED_BEFORE_BORROWED

    let checkRequested = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            readerId: req.auth.id,
            status: RENTED_BOOK_STATUS.PENDING,
        }
    })
    if (checkRequested && checkRequested > 0) throw API_CODE.EXIST_REQUEST_RENT_BOOK_PENDING

    let checkComicsCategory = []
    listBook = listBook.filter(function (elem) {
        //check khong cho muon 2 quyen truyen tranh
        if (elem.bookCategoryId === CATEGORY.TT && checkComicsCategory.includes(CATEGORY.TT))
            throw API_CODE.DUPLICATE_COMICS_CATEGORY

        checkComicsCategory.push(elem.bookCategoryId)
        return true
    })

    let data = await sequelize.transaction(async transaction => {
        let newRentedBook = await RentedBook.create({
            readerId: req.auth.id,
            status: RENTED_BOOK_STATUS.PENDING,
            isCreatedByMember: YES_OR_NO.NO,
            createdObjectId: req.auth.id
        }, { transaction })

        let arrayInsert = listBook.map(item => {
            return {
                readerId: req.auth.id,
                rentedBookId: newRentedBook.id,
                bookId: item.bookId,
                status: RENTED_BOOK_STATUS.PENDING,
            }
        })

        await RentedBookDetail.bulkCreate(arrayInsert, { transaction })
        return newRentedBook
    })
    return await rentedDetail(data.id, req.url)
}


async function updateRentedBook(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

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
    return await rentedDetail(id, req.url)
}


async function updateRentedBookDetail(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id, status, lost, note } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM

    let rentedBookDetailUpdate = await RentedBookDetail.findOne({
        where: {
            isActive: ACTIVE,
            id
        }
    })
    if (!rentedBookDetailUpdate) throw API_CODE.NOT_FOUND
    if (rentedBookDetailUpdate.returnedDate) throw API_CODE.RENTED_BOOK_DETAIL_HAS_BEEN_UPDATE

    let dataUpdate = {
        status,
        lost,
        note,
        returnedDate: Date.now(),
        returnedConfirmMemberId: req.auth.id,
    }

    let data = await sequelize.transaction(async transaction => {
        await rentedBookDetailUpdate.update(dataUpdate, { transaction })

        let countBookNoReturn = await RentedBookDetail.count({
            where: {
                isActive: ACTIVE,
                rentedBookId: rentedBookDetailUpdate.rentedBookId,
                returnedDate: null
            }
        })
        if (countBookNoReturn == 1) {
            // nếu trả quyển cuối trong đơn => cập nhật lại đơn
            await RentedBook.update({
                status: RENTED_BOOK_STATUS.RETURNED,
                returnedDate: Date.now(),
                returnedConfirmMemberId: req.auth.id,
            }, {
                where: {
                    isActive: ACTIVE,
                    id: rentedBookDetailUpdate.rentedBookId
                },
                transaction,
            })
        }

        if (lost == 1) {
            await Reader.update({
                lost: literal(`lost + 1`)
            }, {
                where: {
                    isActive: ACTIVE,
                    id: rentedBookDetailUpdate.readerId
                },
                transaction
            })
        }
    })

    return await rentedDetail(rentedBookDetailUpdate.rentedBookId, req.url)
}


async function getListRequestRentBook(req, res) {
    let page = !req.query.page ? 0 : req.query.page - 1
    let limit = parseInt(req.query.limit || LIMIT)
    if (page < 0) throw API_CODE.PAGE_ERROR
    let offset = page * limit

    let cardNumber = (req.query.cardNumber || '').trim()
    let readerName = (req.query.readerName || '').trim()
    let bookCode = (req.query.bookCode || '').trim()
    let bookName = (req.query.bookName || '').trim()
    let searchCardNumber = cardNumber.length > 0 ? `reader.cardNumber = '${cardNumber}'` : ''
    let searchReaderName = readerName.length > 0 ? `reader.name like '%${readerName}%'` : ''
    let searchBookCode = bookCode.length > 0 ? `code = '${bookCode}'` : ''
    let searchBookName = bookName.length > 0 ? `name like '%${bookName}%'` : ''

    let searchStatus = req.query.status ? `rented_book.status = ${req.query.status}` : `rented_book.status in (${RENTED_BOOK_STATUS.PENDING}, ${RENTED_BOOK_STATUS.CANCEL})`
    let searchFromDate = req.query.fromDate ? `rented_book.borrowedDate >= FROM_UNIXTIME(${parseInt(req.query.fromDate.slice(0, 10))})` : ''
    let searchToDate = req.query.toDate ? `rented_book.borrowedDate <= FROM_UNIXTIME(${parseInt(req.query.toDate.slice(0, 10))})` : ''

    let history = await RentedBook.findAndCountAll({
        subQuery: false,
        order: [['id', 'DESC']],
        offset,
        limit,
        distinct: true,
        col: 'id',
        where: {
            isActive: ACTIVE,
            [Op.and]: [
                literal(searchCardNumber),
                literal(searchReaderName),
                literal(searchStatus),
                literal(searchFromDate),
                literal(searchToDate),
            ]
        },
        attributes: [
            'id', 'status', 'readerId',
            [col("reader.cardNumber"), "readerCardNumber"],
            [col("reader.name"), "readerName"]
        ],
        include: [
            {
                required: true,
                where: {
                    isActive: ACTIVE
                },
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
                    }
                ],
                attributes: [
                    ['id', 'rentedBookDetailId'],
                    [literal("`rented_book_details->book`.`id`"), "bookId"],
                    [literal("`rented_book_details->book`.`code`"), "bookCode"],
                    [literal("`rented_book_details->book`.`name`"), "bookName"]
                ]
            },
            {
                model: Reader,
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


async function cancelRequestRentBook(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id, noteMember } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM
    if (!noteMember || noteMember.length == 0) throw API_CODE.REQUIRE_NOTE_MEMBER_CANCEL_REQUEST

    let rentedBook = await RentedBook.findOne({
        where: {
            isActive: ACTIVE,
            id,
            status: RENTED_BOOK_STATUS.PENDING
        }
    })
    if (!rentedBook) throw API_CODE.NOT_FOUND

    let data = await sequelize.transaction(async transaction => {
        await Promise.all([
            rentedBook.update({
                status: RENTED_BOOK_STATUS.CANCEL,
                noteMember,
                borrowedDate: Date.now(),
                borrowedConfirmMemberId: req.auth.id,
            }, { transaction }),
            RentedBookDetail.update({
                status: RENTED_BOOK_STATUS.CANCEL,
                borrowedDate: Date.now(),
                borrowedConfirmMemberId: req.auth.id,
            }, {
                transaction,
                where: {
                    isActive: ACTIVE,
                    rentedBookId: id
                }
            })
        ])
    })
    return
}


async function confirmRequestRentBook(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM

    let rentedBookUpdate = await RentedBook.findOne({
        where: {
            isActive: ACTIVE,
            id,
            status: RENTED_BOOK_STATUS.PENDING
        }
    })
    if (!rentedBookUpdate) throw API_CODE.NOT_FOUND

    let dataUpdate = {
        status: RENTED_BOOK_STATUS.BORROWED,
        borrowedDate: Date.now(),
        borrowedConfirmMemberId: req.auth.id,
    }

    let data = await sequelize.transaction(async transaction => {
        await Promise.all([
            rentedBookUpdate.update(dataUpdate, { transaction }),
            RentedBookDetail.update(dataUpdate, {
                transaction,
                where: {
                    isActive: ACTIVE,
                    rentedBookId: id,
                    status: RENTED_BOOK_STATUS.PENDING
                }
            })
        ])
    })
    return
}


async function addBookToRequestRentedBook(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { bookId, bookCategoryId, rentedBookId } = req.body
    if (!bookId || bookId <= 0 || !bookCategoryId || bookCategoryId <= 0 || !rentedBookId || rentedBookId <= 0) throw API_CODE.INVALID_PARAM

    let findBook = await Book.findOne({
        where: {
            isActive: ACTIVE,
            id: bookId,
            bookCategoryId
        }
    })
    if (!findBook) throw API_CODE.BOOK_NOT_FOUND

    let rentedBookUpdate = await RentedBook.findOne({
        where: {
            isActive: ACTIVE,
            id: rentedBookId,
            status: RENTED_BOOK_STATUS.PENDING
        }
    })
    if (!rentedBookUpdate) throw API_CODE.NOT_FOUND

    let count = await RentedBookDetail.count({
        where: {
            isActive: ACTIVE,
            rentedBookId,
            status: RENTED_BOOK_STATUS.PENDING
        }
    })
    if (count > 2) throw API_CODE.RENTED_BOOK_OUT_OF_QTY

    await RentedBookDetail.create({
        readerId: rentedBookUpdate.readerId,
        rentedBookId,
        bookId,
        status: RENTED_BOOK_STATUS.PENDING
    })
    return
}


async function removeBookInRentedBookDetail(req, res) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let { id } = req.body
    if (!id || id <= 0) throw API_CODE.INVALID_PARAM

    let rentedBookDetailDelete = await RentedBookDetail.findOne({
        where: {
            isActive: ACTIVE,
            id
        }
    })
    if (!rentedBookDetailDelete) throw API_CODE.NOT_FOUND
    if (rentedBookDetailDelete.status !== RENTED_BOOK_STATUS.PENDING) throw API_CODE.CAN_NOT_DELETE_RENTED_DETAIL

    await rentedBookDetailDelete.update({
        isActive: IS_ACTIVE.INACTIVE
    })

    return await rentedDetail(rentedBookDetailDelete.rentedBookId, req.url)
}


module.exports = {
    getRentedBookHistory,
    getRentedBookDetail,
    createRentedBook,
    updateRentedBook,
    updateRentedBookDetail,
    getTopBorrowedReader,
    getTopBorrowedBook,
    requestRentBook,
    getListRequestRentBook,
    cancelRequestRentBook,
    confirmRequestRentBook,
    addBookToRequestRentedBook,
    removeBookInRentedBookDetail,
}
