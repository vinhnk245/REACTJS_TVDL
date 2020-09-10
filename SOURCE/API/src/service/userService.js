const { user } = require("@models");
const e = require("express");
const bcrypt = require("bcrypt");
const Sequelize = require('sequelize');
const Constain=require('@utils/constant.js');
const { where } = require("sequelize");
const hat = require("hat");
const Op = Sequelize.Op;
var attribute=["id","full_name","user_name","phone","role_id","modified_at","created_at","token"];
async function listUser(full_name,user_name,phone,role_id) {

    var users = await user.findAll(
      {
        attributes:attribute,
        where:{
          is_active:1,
          user_name:{[Op.substring]:user_name?user_name:""},
          full_name:{[Op.substring]:full_name?full_name:""},
          phone:{[Op.substring]:phone?phone:""},
         role_id:role_id?{[Op.eq]:role_id}:{[Op.not]:null},
         is_active:Constain.IS_ACTIVE.ACTIVE
        }
      }
    );
    return users;
 
}
async function detail(id) {
  var userDetail = await user.findOne({
    attributes:attribute,
    where: {
      id: id,
      is_active:Constain.IS_ACTIVE.ACTIVE
    },
  });
  return userDetail;
}
async function create(full_name,user_name,phone,role_id,password)
{
  let user_current=await user.findOne({
    where:{
      user_name:user_name,
      is_active:1
    }
  }
  )
  if(user_current)
  {
    throw {code:0,message:"Tài khoản đã tồn tại!"}
  }else
  {
    let user_create={
      user_name:user_name,
      full_name:full_name,
      phone:phone,
      role_id:role_id,
      password:bcrypt.hashSync(password,10)
    };
    console.log(user_create);
    user.create(user_create);
    return {code:1,message:"Tạo tài khoản thành công!"}
  }

}

async function login(user_name,password) {
  let users =await user.findOne(
   {
    where:{
      is_active:Constain.IS_ACTIVE.ACTIVE,
      user_name:user_name
    }
   }
  )
  if(users&&bcrypt.compareSync(password,users.password))
  {
    let token=await hat();
    await user.update({
      token:token},
      {
      where:{
        user_name:user_name,
        is_active:Constain.IS_ACTIVE.ACTIVE
      }
    }
    )
     return token;
  }
  else 
  throw {message:"Tài khoản hoặc mật khẩu không chính xác"};
  
}

async function update(id,full_name,user_name,phone,role_id,password)
{
  let users =await user.findOne({
    where:{
      is_active:Constain.IS_ACTIVE.ACTIVE,
      id:id
    }
  })
  if(!users)
  {
    throw {code:0,message:"Tài khoản không tồn tại"}
  }else
  {
    await user.update({
   full_name:full_name||user.full_name,
   user_name:user_name||user.user_name,
   phone:phone||user.phone,
   role_id:role_id||user.role_id,
   password:password?bcrypt.hashSync(password,10):user.password,
   modified_at:Date.now(),
   is_active:Constain.IS_ACTIVE.ACTIVE
    },
    {
      where:{
        id:id
      }
    });
    return detail(id);
  }
}
async function delete_user(id)
{
  let users =await user.findOne({
    where:{
      is_active:Constain.IS_ACTIVE.ACTIVE,
      id:id
    }
  })
  if(!users)
  {
    throw {code:0,message:"Tài khoản không tồn tại"}
  }else
  {
    await user.update({
   modified_at:Date.now(),
   is_active:Constain.IS_ACTIVE.INACTIVE
    },
    {
      where:{
        id:id
      }
    });
    return null;
}
}
module.exports = {
  listUser,
  detail,
  create,
  login,
  update,
  delete_user
};
