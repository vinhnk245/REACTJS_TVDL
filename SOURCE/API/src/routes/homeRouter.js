var express = require("express");
const response = require("@commons/response");
const homeController = require("@src/controllers/homeController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.post("/login", wrapHandlerWithJSONResponse(homeController.login));
router.post("/logout", isAuthenticated(), wrapHandlerWithJSONResponse(homeController.logout));
router.post("/changePassword", isAuthenticated(), wrapHandlerWithJSONResponse(homeController.changePassword));
router.post("/resetPassword", isAuthenticated(), wrapHandlerWithJSONResponse(homeController.resetPassword));

module.exports = router;
