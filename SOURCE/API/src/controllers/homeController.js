// const Sequelize = require('sequelize')
// const Op = Sequelize.Op
const { Sequelize, Op, literal } = require('sequelize')
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const response = require("@commons/response")
const { success, error } = response
const { API_CODE, IS_ACTIVE, ROLE, CONFIG, USER_TYPE, RENTED_BOOK_STATUS } = require('@utils/constant')
const {
    book: Book,
    reader: Reader,
    member: Member,
    rented_book: RentedBook,
} = require('@models')
const memberController = require('@controllers/memberController')
const readerController = require('@controllers/readerController')

async function login(req, res, next) {
    const { account, password, deviceId } = req.body
    if (!account || !password)
        throw API_CODE.REQUIRE_FIELD

    let readerLogin = await Reader.findOne({
        where: {
            account: account,
            isActive: IS_ACTIVE.ACTIVE
        }
    })
    if (!readerLogin) {
        let memberLogin = await Member.findOne({
            where: {
                account: account,
                isActive: IS_ACTIVE.ACTIVE
            }
        })
        if (!memberLogin) throw API_CODE.LOGIN_FAIL
        if (memberLogin.status === IS_ACTIVE.DEACTIVATE) throw API_CODE.ACCOUNT_DEACTIVATED

        let checkPass = await bcrypt.compareSync(
            password,
            memberLogin.password,
            (err, res) => {
                return res
            })
        if (!checkPass) throw API_CODE.LOGIN_FAIL

        await memberLogin.update({
            token: hat(),
            deviceId: deviceId
        })
        return await memberController.getMemberDetail(memberLogin.id)
    } else {
        if (readerLogin.status === IS_ACTIVE.DEACTIVATE) throw API_CODE.ACCOUNT_DEACTIVATED

        let checkPasswordReader = await bcrypt.compareSync(
            password,
            readerLogin.password,
            (err, res) => {
                return res
            })
        if (!checkPasswordReader) throw API_CODE.LOGIN_FAIL

        await readerLogin.update({
            token: hat(),
            deviceId: deviceId
        })
        return await readerController.getReaderDetail(readerLogin.id)
    }
}

async function logout(req, res, next) {
    let update = {
        token: hat(),
        deviceId: null
    }
    let where = {
        where: {
            id: req.auth.id
        }
    }
    if (req.auth.role) {
        await Member.update(update, where)
    } else {
        await Reader.update(update, where)
    }
    return
}

async function changePassword(req, res, next) {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) throw API_CODE.REQUIRE_FIELD

    let checkPass = await bcrypt.compareSync(
        currentPassword,
        req.auth.password,
        (err, res) => {
            return res
        })
    if (!checkPass) throw API_CODE.WRONG_PASSWORD

    let hash = bcrypt.hashSync(newPassword, CONFIG.CRYPT_SALT)
    await req.auth.update({ password: hash })
    return
}

async function resetPassword(req, res, next) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    const { id, userType } = req.body
    if (!id || !userType || ![USER_TYPE.MEMBER, USER_TYPE.READER].includes(userType)) throw API_CODE.INVALID_PARAM

    if (userType === USER_TYPE.MEMBER) {
        if (req.auth.role === ROLE.MEMBER) throw API_CODE.CANT_RESET_PASSWORD

        let findMember = await Member.findOne({
            where: { id, isActive: IS_ACTIVE.ACTIVE }
        })
        if (!findMember) throw API_CODE.NOT_FOUND

        let hash = bcrypt.hashSync(CONFIG.DEFAULT_PASSWORD, CONFIG.CRYPT_SALT)
        await findMember.update({ password: hash })
    } else {
        let findReader = await Reader.findOne({
            where: { id, isActive: IS_ACTIVE.ACTIVE }
        })
        if (!findReader) throw API_CODE.NOT_FOUND

        let hash = bcrypt.hashSync(findReader.account, CONFIG.CRYPT_SALT)
        await findReader.update({ password: hash })
    }
    return
}

async function checkTokenForApp(req, res, next) {
    // if (req.headers && req.headers.token) {
    //     let readerCheck = await Reader.findOne({
    //         where: {
    //             token: req.headers.token,
    //             isActive: IS_ACTIVE.ACTIVE,
    //         }
    //     })
    //     if (!readerCheck) throw API_CODE.UNAUTHORIZED
    // } else {
    //     throw API_CODE.INVALID_ACCESS_TOKEN
    // }
    return ''
}

async function getOverviews(req, res, next) {
    if (!req.auth.role) throw API_CODE.NO_PERMISSION

    let data = {}
    await Promise.all([
        data.activeMember = await Member.count({
            where: {
                isActive: IS_ACTIVE.ACTIVE,
                status: IS_ACTIVE.ACTIVE
            }
        }),
        data.totalMember = await Member.count({
            where: {
                isActive: IS_ACTIVE.ACTIVE
            }
        }),
        data.totalBook = await Book.count({
            where: {
                isActive: IS_ACTIVE.ACTIVE
            }
        }),
        data.totalReader = await Reader.count({
            where: {
                isActive: IS_ACTIVE.ACTIVE
            }
        }),
        data.totalRentedThisMonth = await RentedBook.count({
            where: {
                isActive: IS_ACTIVE.ACTIVE,
                status: {
                    [Op.in]: [RENTED_BOOK_STATUS.BORROWED, RENTED_BOOK_STATUS.RETURNED]
                },
                [Op.and]: [
                    literal(`MONTH(borrowedDate) = MONTH(now())`)
                ]
            }
        }),
    ])
    return data
}


module.exports = {
    login,
    logout,
    changePassword,
    resetPassword,
    checkTokenForApp,
    getOverviews,
};
