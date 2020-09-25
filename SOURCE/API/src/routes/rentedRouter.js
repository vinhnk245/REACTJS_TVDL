var express = require("express");
const response = require("@commons/response");
const rentedController = require("@src/controllers/rentedController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.post("/createRentedBook", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.createRentedBook));

module.exports = router;
