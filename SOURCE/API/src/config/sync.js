require("module-alias/register");
var models = require("@models");

models.sequelize
  // thêm mới mà k xóa
  // .sync({ force: true })
  //
  .sync({ force: true, alter: true })
  // xóa hết rồi thêm lại
  // .sync({ force: true })
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    throw new Error(err);
  });
