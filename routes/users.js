var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt');
const _accountModel = require('../model/account.model');
var accountModel = _accountModel()
var jwt = require('jsonwebtoken');
var passport = require('passport');

var multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }


}
const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});

router.post('/register', function (req, res, next) {
  console.log(req.body);
  var saltRounds = 10;
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    var account = {
      username: req.body.username,
      password: hash
    };
    accountModel.add(account).then(id => {
      // resolve({oke:true,text: ()=>});
      res.json({ ok: true, data: id, message: 'Account created successfully!' });
    }).catch(err => {
      console.log(err);
      res.status(400).json({ ok: false, message: 'Username is already taken.' });
    });
  });

});

router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, infor) => {
    if (err || !user) {
      console.log("fail");
      // reject("Login Failed: username or password is incorrect.");
      return res.json({
        ok: false,
        message: user ? infor.message : "Username or Password is incorrect."
      })
    };
    req.login(user, { session: false }, (err) => {
      if (err) {
        // res.send(err);
        return res.json({
          ok: false,
          message: "Login Failed."
        })
      }
      var obj = {
        id: user.id,
        username: user.username
      };
      var token = jwt.sign(obj, 'rossoneri');
      var resp = {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        token: token
      }
      // var token = jwt.sign(obj, 'rossoneri');
      // resolve({ ok: true, text: () => Promise.resolve(JSON.stringify(responseJSON)) });
      return res.json({ ok: true, user: resp });
    })
  })(req, res);
});

router.post('/update', upload.single('avatar'), function (req, res, next) {
  var inforReq = JSON.parse(req.body.infor);
  var _id = parseInt(inforReq.id);
  var password = inforReq.password;
  var fullName = inforReq.fullName;
  var avatar = req.file;
  var infor = {
    id: _id
  };
  if (fullName !== undefined) { infor.fullName = fullName };
  if (avatar !== undefined) { infor.avatar = avatar.path };
  if (password !== undefined) {
    var saltRounds = 10;
    bcrypt.hash(password, saltRounds, function (err, hash) {
      infor.password = hash;
      return updateInfor(infor, _id,res);
    })
  } else {
    return updateInfor(infor, _id,res);
  }

})

var updateInfor = (infor, _id,res) => {
  console.log(infor);
  accountModel.update(infor).then(id => {
    accountModel.single(_id).then(user => {
      var user = user[0];
      var obj = {
        id: user.id,
        username: user.username
      };
      var token = jwt.sign(obj, 'rossoneri');
      var resp = {
        id: user.id,
        username: user.username,
        fullName: user.fullName || '',
        avatar: user.avatar || '',
        token: token
      }
      return res.json({ ok: true, user: resp });
    })
  });
}
module.exports = router;
