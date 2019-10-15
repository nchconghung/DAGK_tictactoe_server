var passport = require('passport');
var passportJWT = require('passport-jwt');

var ExtractJWT = passportJWT.ExtractJwt;

var LocalStrategy = require('passport-local').Strategy;
var JWTStategy = passportJWT.Strategy;

var bcrypt = require('bcrypt');
var accountModel = require('../model/account.model');

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },function(username,password,cb){
        accountModel.singleByUsername(username).then(r => {
            if (r.length === 0){
                return cb(null,false,{message: 'Incorrect Username!'});
            } 
            var ret = bcrypt.compareSync(password,r[0].password);
            if (ret){
                return cb(null,r[0],{message: 'Logged In Successfully'});
            } else {
                return cb(null,false,{message: 'Incorrect Password!'});
            }
        }).catch(err=>{
            return cb(err,false,{message: 'Something error!'});
        });
}));

passport.use(new JWTStategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('JWT'),
        secretOrKey: 'rossoneri'
    },function(jwtPayload,cb){
        console.log(jwtPayload.id);
        return accountModel.single(jwtPayload.id).then(user=>{
            return cb(null,user);
        }).catch(err=>{
            return cb(err,false);
        })
    }
));