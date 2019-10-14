var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json('1612240 - Nguyễn Công Hưng');
});

module.exports = router;
