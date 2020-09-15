var express = require("express");
const response = require("@commons/response");
const bookController = require("@src/controllers/bookController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getListBook", isAuthenticated(), wrapHandlerWithJSONResponse(bookController.getListBook));
router.get("/getBookInfo", isAuthenticated(), wrapHandlerWithJSONResponse(bookController.getBookInfo));
router.post("/createBook", isAuthenticated(), wrapHandlerWithJSONResponse(bookController.createBook));
router.post("/updateBook", isAuthenticated(), wrapHandlerWithJSONResponse(bookController.updateBook));
router.post("/deleteBook", isAuthenticated(), wrapHandlerWithJSONResponse(bookController.deleteBook));

module.exports = router;
