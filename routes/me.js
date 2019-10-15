var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

/* GET home page. */
router.get('/', verifyToken,(req, res) => {
  jwt.verify(req.token,'rossoneri',(err,authData) => {
    if(err){
      console.log(err);
      res.sendStatus(403);
    } else{
      res.json({
        message: 'Authenticated User.',
        authData
      })
    }
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req,res,next){
  // Get auth header value
  const bearerHeader = req.headers.authorization;
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    console.log('undefined');
    res.sendStatus(403);
  }
}

module.exports = router;
