const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const hat = require("hat")
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, ORDER_BY } = require("@utils/constant")
const ACTIVE = IS_ACTIVE.ACTIVE
const LIMIT = CONFIG.PAGING_LIMIT
const { 
    book: Book, 
    book_category: BookCategory,
    book_image: BookImage
} = require("@models")
const { success, error } = require("../commons/response")


async function getListBook(req, res) {
    //neu trong router co check isAuthenticated thi urlRequest = req.url
    const urlRequest = req.protocol + '://' + req.get('host') + '/'

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
            [sequelize.fn('CONCAT', urlRequest, sequelize.col("book_category.logo")), 'bookCategoryLogo']
        ],
        order: sequelize.literal(queryOrderBy),
        offset: offset,
        limit: limit
    })

    await Promise.all(
        listBook.rows.map(async book => {
            book.dataValues.image = await getBookImages(book.id, urlRequest)
        })
    )

    return {
        totalCount: listBook.count,
        totalPage: Math.ceil(listBook.count / limit),
        items: listBook.rows
    }
}

async function getBookInfo(req, res) {
    if(!req.query.id) throw API_CODE.INVALID_PARAM
    const urlRequest = req.protocol + '://' + req.get('host') + '/'
    return await getBookDetail(req.query.id, urlRequest)
}

async function getBookDetail(bookId, urlRequest) {
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
            [sequelize.fn('CONCAT', urlRequest, sequelize.col("book_category.logo")), 'bookCategoryLogo']
        ]
    })
    if(!bookDetail) throw API_CODE.NOT_FOUND

    bookDetail.dataValues.image = await getBookImages(bookId, urlRequest)
    return bookDetail
}

async function getBookImages(bookId, urlRequest) {
    try {
        const bookImages = await BookImage.findAll({
            where: {
                isActive: ACTIVE,
                bookId: bookId
            },
            attributes: [
                [sequelize.fn('CONCAT', urlRequest, sequelize.col('image')), 'image'],
            ]
        })
        return bookImages.map(item => { return item.dataValues.image})
    } catch (error) {
        return []
    }
}

async function createBook(req, res) {
    // if(req.auth.role == ROLE.MEMBERS) throw API_CODE.NO_PERMISSION

    let { bookCategoryId, name, code, qty, available, note, description, author, publishers, publishingYear } = req.body
    if(!bookCategoryId || 
        !name || 
        !code || 
        !qty ||
        !available) throw API_CODE.REQUIRE_FIELD

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

    let data = await sequelize.transaction(async transaction => {
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
        },{ transaction })
    
        if(req.files && req.files.image) {
            const urlImage = await uploadFile(req.files.image, CONFIG.PATH_IMAGE_BOOK)
            await BookImage.create({
                bookId: newBook.id,
                image: urlImage,
                createdMemberId: req.auth.id
            },{ transaction })
        }
        return newBook
    });
    return await getBookDetail(data.id, req.url)
    
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

async function uploadImage(req, res) {
    const imageUpload = req.files.image
    if(!imageUpload) throw API_CODE.REQUIRE_IMAGE
    return req.url + await uploadFile(imageUpload, CONFIG.PATH_IMAGE_BOOK)
}

async function uploadFile(file, pathImage) {
    try {
        const fileType = file.mimetype.replace('image/', '')
        const fileName = `${hat()}.${fileType}`
        //Use the mv() method to place the file in upload directory
        file.mv(`./public/${pathImage}` + fileName)
        return pathImage + fileName
    } catch (error) {
        return ''
    }
}


module.exports = {
    getListBook,
    getBookInfo,
    createBook,
    updateBook,
    deleteBook,
    uploadImage,
    uploadFile,
}
