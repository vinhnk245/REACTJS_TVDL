const Sequelize = require('sequelize')
const Op = Sequelize.Op
const sequelize = require('../config/env.js')
const bcrypt = require("bcrypt")
const hat = require("hat")
const response = require("@commons/response")
const { success, error } = response
const { API_CODE, IS_ACTIVE, ROLE } = require('@utils/constant')
const { reader, member } = require('@models')
const memberController = require('@controllers/memberController')
const readerController = require('@controllers/readerController')

async function login(req, res, next) {
    const { account, password, deviceId } = req.body
    if(!account || !password)
        throw API_CODE.REQUIRE_FIELD

    let readerLogin = await reader.findOne({
        where: { 
            account: account,
            isActive: IS_ACTIVE.ACTIVE
        }
    })
    if(!readerLogin) {
        let memberLogin = await member.findOne({
            where: {
                account: account,
                isActive: IS_ACTIVE.ACTIVE
            }
        })
        if(!memberLogin) throw API_CODE.LOGIN_FAIL
        if(memberLogin.status === IS_ACTIVE.DEACTIVATE) throw API_CODE.ACCOUNT_DEACTIVATED

        let checkPass = await bcrypt.compareSync(
            password, 
            memberLogin.password, 
            (err, res) => {
                return res
            })
        if(!checkPass) throw API_CODE.LOGIN_FAIL

        await memberLogin.update({
            token: hat(),
            deviceId: deviceId
        })
        return await memberController.getMemberDetail(memberLogin.id)
    } else {
        if(readerLogin.status === IS_ACTIVE.DEACTIVATE) throw API_CODE.ACCOUNT_DEACTIVATED

        let checkPasswordReader = await bcrypt.compareSync(
            password, 
            readerLogin.password, 
            (err, res) => {
                return res
            })
        if(!checkPasswordReader) throw API_CODE.LOGIN_FAIL

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
        await member.update(update, where)
    } else {
        await reader.update(update, where)
    }
    return
}


module.exports = {
    login,
    logout,
};
