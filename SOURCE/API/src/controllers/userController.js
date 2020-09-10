const { debug, apiCode, IS_ACTIVE, ROLE } = require("@utils/constant");
const userService = require("../service/userService");
const bcrypt = require("bcrypt");
const { user } = require("@models");
const hat = require("hat");
// login


async function create_user(req, res) {
    let {full_name,user_name,phone,role_id,password}=req.body;
    var data = await userService.create(full_name,user_name,phone,role_id,password);
    return data;
}
async function list_user(req, res) {
  let {full_name,user_name,phone,role_id}=req.query;
  var data = await userService.listUser(full_name,user_name,phone,role_id);
  return data;
}
async function user_detail(req, res) {
  let {id}=req.query;
  var data = await userService.detail(id);
  return data;
}
async function login(req, res) {
  let {user_name,password}=req.body;
  var data = await userService.login(user_name,password);
  return data;
}
async function update(req, res) {
  let {id,full_name,user_name,phone,role_id,password}=req.body;
  var data = await userService.update(id,full_name,user_name,phone,role_id);
  return data;
}
async function delete_user(req, res) {
  let {id}=req.body;
  var data = await userService.delete_user(id);
  return data;
}


module.exports = {
  create_user,
  list_user,
  user_detail,
  login,
  update,
  delete_user
};
