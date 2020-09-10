const { debug, apiCode, IS_ACTIVE, ROLE } = require("@utils/constant");
const customerService = require("../service/customerService");
const bcrypt = require("bcrypt");
const { user } = require("@models");
const hat = require("hat");
const {wrapHandlerWithJSONResponse}=require("../commons/response")
// login
async function login(req, res) {
 return customerService.login(req.body.user_name,req.body.password);
}

async function list(req, res) {
  return customerService.listUser();
}
async function create(req, res) {
  const {user_name,password,phone,device_id,role_id,avatar_url,province_id}=req.body;
  return customerService.create(user_name,password,phone,device_id,role_id,avatar_url,province_id);
}

module.exports = {
  list,
  login,
  create  
};
