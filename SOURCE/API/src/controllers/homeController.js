const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../config/env.js');
const bcrypt = require("bcrypt");
const hat = require("hat");
const response = require("@commons/response");
const { success, error } = response;
const { API_CODE, IS_ACTIVE, ROLE } = require('@utils/constant');
const { reader, member } = require('@models');

async function login(req, res, next) {
    const { account, password, deviceId } = req.body
    if(!account || !password)
        return error(API_CODE.REQUIRE_FIELD)

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
        if(!memberLogin) return error(API_CODE.LOGIN_FAIL)

        if(memberLogin.status === IS_ACTIVE.DEACTIVATE) return error(API_CODE.ACCOUNT_DEACTIVATED)

        let checkPass = await bcrypt.compareSync(
            password, 
            memberLogin.password, 
            (err, res) => {
                return res
            })
        if(!checkPass) return error(API_CODE.LOGIN_FAIL)

        await memberLogin.update({
            token: hat(),
            deviceId: deviceId
        });
        return memberLogin.dataValues
          
    } else {

        if(readerLogin.status === IS_ACTIVE.DEACTIVATE) return error(API_CODE.ACCOUNT_DEACTIVATED)

        let checkPasswordReader = await bcrypt.compareSync(
            password, 
            readerLogin.password, 
            (err, res) => {
                return res
            })
        if(!checkPasswordReader) return error(API_CODE.LOGIN_FAIL)

        await readerLogin.update({
            token: hat(),
            deviceId: deviceId
        });
        return readerLogin.dataValues

    }
}


module.exports = {
    login,
};
