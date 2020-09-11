var express = require("express");
const response = require("@commons/response");
const bookCategoryController = require("@src/controllers/bookCategoryController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getListCategory", wrapHandlerWithJSONResponse(bookCategoryController.getListCategory));

module.exports = router;
