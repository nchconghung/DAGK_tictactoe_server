var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var accountModel = require('../model/account.model');
/* GET users listing. */
router.post('/register', function(req, res, next) {
  var saltRounds = 10;
  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    var account = {
      username: req.body.username,
      password: hash
    };
    accountModel.add(account).then(id=>{
      res.json({idUser: id,msg: 'account created successfully!'});
    }).catch(err=>{
      res.json({msg: 'account create failed',error: err});
    });
  });
  
});

module.exports = router;
