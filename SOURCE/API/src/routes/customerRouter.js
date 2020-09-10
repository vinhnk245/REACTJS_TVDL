var express = require("express");
const response = require("@commons/response");
const customerController = require("@controllers/customerController");
const { wrapHandlerWithJSONResponse } = response;
const{isAuthenticated}=require("../utils/Authenticated");
var router = express.Router();

router.post("/login", wrapHandlerWithJSONResponse(customerController.login));

router.get("/list", isAuthenticated(),wrapHandlerWithJSONResponse(customerController.list));
router.post("/create", wrapHandlerWithJSONResponse(customerController.create));
module.exports = router;
