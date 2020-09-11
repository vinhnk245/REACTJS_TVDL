require("module-alias/register");
var models = require("@models");

models.sequelize
  // thêm mới mà k xóa
  // .sync({ force: false })
  //
  .sync({ force: false, alter: true })
  // xóa hết rồi thêm lại
  // .sync({ force: true })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    throw new Error(err);
  });
