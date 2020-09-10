const { debug, API_CODE, IS_ACTIVE, ROLE } = require("@utils/constant");
const bcrypt = require("bcrypt");
const { Reader } = require("@models");
const hat = require("hat");
const {wrapHandlerWithJSONResponse}=require("../commons/response")

async function login(req, res) {
  const reader = await Reader.findOne({
    where: { account: req.body.account }
  })
  if(cus)
  {
      const checkpass=await bcrypt.compareSync(password,cus.password,function(err,res)
      {
        return res;
      })
      if(checkpass)
      {
       await Reader.update(
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
  login,
};
