var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
var accountModel = require('../model/account.model');

var jwt = require('jsonwebtoken');
var passport = require('passport');

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

router.post('/login',function(req,res,next){
  passport.authenticate('local',{session: false},(err,user,infor)=>{
    if (err || !user){
      console.log(err);
      return res.status(401).json({
        message: infor ? infor.message : "Login Failed",
        user: user
      })
    };
    req.login(user,{session: false},(err)=>{
      if (err){
        res.send(err);
      }
      var obj = {
        id: user.Id,
        username: user.username
      };
      var token = jwt.sign(obj,'rossoneri');
      return res.json({user: user,token: token});
    })
  })(req,res);
});


module.exports = router;
