const Sequelize = require("sequelize");
const { debug } = require("../utils/constant");
const CONSTANT = require("../utils/constant");

// const env = {
//   host: process.env.DB_HOST || "13.251.27.111",
//   user: process.env.DB_USER || "vinhnk",
//   password: process.env.DB_PASSWORD || "V21official",
//   database: process.env.DB_NAME || "duonglieu_library_test"
// }
const env = {
  host: process.env.DB_HOST || "35.197.150.231",
  user: process.env.DB_USER || "tvdl-db",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "duonglieu_library_test"
}

const sequelize = new Sequelize(env.database, env.user, env.password, {
  host: env.host,
  dialect: "mysql",
  logging: console.log,
  query: { raw: false },
  dialectOptions: {
    dateStrings: true,
    // typeCast: true,
    typeCast: function (field, next) {
      if (field.type == 'DATETIME' || field.type == 'TIMESTAMP') {
        return new Date(field.string() + 'Z');
      }
      return next();
    }
  }, //for reading from database
  timezone: "+07:00", //for writing to database
  pool: {
    max: 30,
    min: 0,
    acquire: 60000,
    idle: 5000
  },
  define: {
    // rejectOnEmpty: Promise.reject({
    //   code: CONSTANT.API_CODE.NOT_FOUND
    // })
    hooks: true
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Server already');
  })
  .catch((err) => {
    console.log('Can not connect to the database: ', err);
  });


module.exports = sequelize;



