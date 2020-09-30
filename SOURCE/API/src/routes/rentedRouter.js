var express = require("express");
const response = require("@commons/response");
const rentedController = require("@src/controllers/rentedController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getRentedBookHistory", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.getRentedBookHistory));
router.get("/getRentedBookDetail", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.getRentedBookDetail));
router.get("/getTopBorrowedBook", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.getTopBorrowedBook));
router.post("/createRentedBook", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.createRentedBook));
router.post("/updateRentedBook", isAuthenticated(), wrapHandlerWithJSONResponse(rentedController.updateRentedBook));

module.exports = router;
