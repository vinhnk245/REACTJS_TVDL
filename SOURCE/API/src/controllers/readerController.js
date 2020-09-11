const { debug, API_CODE, IS_ACTIVE, ROLE } = require("@utils/constant");
const bcrypt = require("bcrypt");
const { Reader } = require("@models");
const hat = require("hat");
const {wrapHandlerWithJSONResponse}=require("../commons/response")

async function getReaderInfo(req, res) {
  
}


module.exports = {
  getReaderInfo,
};
