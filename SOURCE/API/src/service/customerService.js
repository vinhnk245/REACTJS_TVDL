const { customer } = require("@models");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../config/env');
const { col } = require('sequelize');
const hat = require("hat");
const bcrypt = require("bcrypt");
async function listUser() {
  try {
    var users = await customer.findAll(
      {
        attributes: ["id","phone",[sequelize.literal('if(id<3,  "true" ,  "false")'), 'test']],
      }
    );
     return users;
  } catch (error) {
    console.log(error);
    return error;
  }
}
async function detail(id) {
  var userDetail = await customer.findOne({
    attributes:["id","token","user_name","phone","role_id","created_at"],
    where: {
      id: id,
    },
  });
  return userDetail;
}
async function create(user_name,password,phone,device_id,role_id,avatar_url,province_id) {
  
  const pass=bcrypt.hashSync(password,10);
  var userDetail = await customer.create({
   user_name:user_name,
   phone:phone,
   password:pass,
   device_id:device_id,
   avatar_url:avatar_url,
   token:hat(),
   role_id:role_id,
   province_id:province_id
  });
  return detail(userDetail.id);
}

async function login(user_name,password)
{
 
   const cus= await customer.findOne(
     {
     where:{user_name:user_name}
     }
   )
   if(cus)
   {
       const checkpass=await bcrypt.compareSync(password,cus.password,function(err,res)
       {
         return res;
       })
       if(checkpass)
       {
        await customer.update(
          {
            token: hat(),
            device_id: "device_id"
          },
          {
            where: {
              id: cus.id,
            },
          }
        );
         return detail(cus.id);
       }
       else{
         let err=new Error("Sai mật khẩu");
         err.code=404;
           throw err;
       }
   }
   else
   {
    let err=new Error("Tài khoản không tồn tại");
    err.code=404;
      throw err;
   }

}
module.exports = {
  listUser,
  detail,
  login,
  create
};
