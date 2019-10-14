var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('1612240 - Nguyễn Công Hưng', { title: 'PTUDWNC-CQ2016/31' });
});

module.exports = router;
