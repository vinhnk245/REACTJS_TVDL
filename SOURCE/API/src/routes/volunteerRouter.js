var express = require("express");
const response = require("@commons/response");
const volunteerController = require("@src/controllers/volunteerController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.post("/volunteerRegistration", wrapHandlerWithJSONResponse(volunteerController.volunteerRegistration));
router.get("/getListVolunteerRegistration", isAuthenticated(), wrapHandlerWithJSONResponse(volunteerController.getListVolunteerRegistration));
router.post("/acceptRequestVolunteer", isAuthenticated(), wrapHandlerWithJSONResponse(volunteerController.acceptRequestVolunteer));
router.post("/rejectRequestVolunteer", isAuthenticated(), wrapHandlerWithJSONResponse(volunteerController.rejectRequestVolunteer));

module.exports = router;
