var express = require("express");
const response = require("@commons/response");
const memberController = require("@src/controllers/memberController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getMemberInfo", isAuthenticated(), wrapHandlerWithJSONResponse(memberController.getMemberInfo));
router.post("/createMember", isAuthenticated(), wrapHandlerWithJSONResponse(memberController.createMember));
router.post("/updateMember", isAuthenticated(), wrapHandlerWithJSONResponse(memberController.updateMember));
router.post("/deleteMember", isAuthenticated(), wrapHandlerWithJSONResponse(memberController.deleteMember));

module.exports = router;
