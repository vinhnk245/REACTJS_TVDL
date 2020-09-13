var express = require("express");
const response = require("@commons/response");
const readerController = require("@src/controllers/readerController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getReaderInfo", isAuthenticated(), wrapHandlerWithJSONResponse(readerController.getReaderInfo));
router.post("/createReader", isAuthenticated(), wrapHandlerWithJSONResponse(readerController.createReader));
router.post("/updateReader", isAuthenticated(), wrapHandlerWithJSONResponse(readerController.updateReader));
router.post("/deleteReader", isAuthenticated(), wrapHandlerWithJSONResponse(readerController.deleteReader));

module.exports = router;
