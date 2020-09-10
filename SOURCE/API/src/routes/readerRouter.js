var express = require("express");
const response = require("@commons/response");
const readerController = require("@src/controllers/readerController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.post("/login", wrapHandlerWithJSONResponse(readerController.login));
// router.post("/createReder", isAuthenticated(), wrapHandlerWithJSONResponse(readerController.createReder));

module.exports = router;
