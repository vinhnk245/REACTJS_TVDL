var express = require("express");
const response = require("@commons/response");
const eventController = require("@src/controllers/eventController");
const { wrapHandlerWithJSONResponse } = response;
const { isAuthenticated } = require("../middleware/Authenticated");
var router = express.Router();

router.get("/getListEvent", wrapHandlerWithJSONResponse(eventController.getListEvent));
router.get("/getEventInfo", wrapHandlerWithJSONResponse(eventController.getEventInfo));
router.post("/createEvent", isAuthenticated(), wrapHandlerWithJSONResponse(eventController.createEvent));
router.post("/updateEvent", isAuthenticated(), wrapHandlerWithJSONResponse(eventController.updateEvent));
router.post("/deleteEvent", isAuthenticated(), wrapHandlerWithJSONResponse(eventController.deleteEvent));

module.exports = router;
