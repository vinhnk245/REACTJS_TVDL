var express = require("express");
const User = require("@models/User");
const response = require("@commons/response");
const userController = require("@controllers/userController");
const { debug } = require("../utils/constant");
const { wrapHandlerWithJSONResponse } = response;
const{ isAuthenticated}=require("../middleware/Authenticated")
var router = express.Router();

router.post("/create",isAuthenticated(), wrapHandlerWithJSONResponse(userController.create_user));
router.post("/update",isAuthenticated(), wrapHandlerWithJSONResponse(userController.update));
router.post("/delete",isAuthenticated(), wrapHandlerWithJSONResponse(userController.delete_user));
router.get("/list",isAuthenticated(), wrapHandlerWithJSONResponse(userController.list_user));
router.get("/detail",isAuthenticated(), wrapHandlerWithJSONResponse(userController.user_detail));
router.post("/login", wrapHandlerWithJSONResponse(userController.login));

module.exports = router;
