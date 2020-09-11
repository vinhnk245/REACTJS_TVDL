var express = require("express");
var router = express.Router();
router.get("/",async function (req, res) {
  res.send("Hello v21official");
});

module.exports = router;