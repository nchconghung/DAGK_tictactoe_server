var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var bodyParser = require('body-parser');
// var FacebookStrategy = require('passport-facebook');
// var passport = require('passport');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var meRouter = require('./routes/me');

var app = express();

var server;
var  io;

const _RoomManager =  require('./ioManager/RoomManager')
const _ClientManager = require('./ioManager/ClientManager')
const makeHandlers = require('./ioManager/handler')

const RoomManager = _RoomManager()
const ClientManager = _ClientManager()

require('./middlewares/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use('/uploads', express.static('uploads'));

// var fbCallback = function (accessToken, refreshToken, profile, cb) {
//   console.log(accessToken, refreshToken, profile);
// };

// passport.use(new FacebookStrategy({
//     clientID: '2418898788385348',
//     clientSecret: '789ba259888102de0cd6a90c47038ce1',
//     callbackURL: 'http://localhost:4000/auth/facebook/callback',
//     profileFields: ['emails']
//   }, 
//   fbCallback));

// app.route('/auth/facebook/callback').get(passport.authenticate('facebook', function (err, user, infor) {
//   console.log(err, user, infor);
// }));

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/me', meRouter);

app.use(function (req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

server = require('http').createServer(app);
io = require('socket.io')(server);

io.on('connection',function(client){
  const {
    handleLeave,
    handleRegister,
    handleFind,
    // handleMessage,
    handleTurn,
    handleUndo,
    handleUndoAccept,
    handleGiveUp,
    handleTie,
    handleTieAccept,
    handleDisconnect,
    handleNewGame
  } = makeHandlers(client,ClientManager,RoomManager);
  console.log('client connected...',client.id);

  client.on('register',handleRegister)

  client.on('find',handleFind)

  client.on('leave',handleLeave)

  // client.on('message',handleMessage)
  client.on('newgame',handleNewGame)
  client.on('turn',handleTurn)

  client.on('undo-request',handleUndo)

  client.on('undo-accept',handleUndoAccept)

  client.on('give-up',handleGiveUp)

  client.on('tie-request',handleTie)

  client.on('tie-accept',handleTieAccept)

  client.on('disconnect',function(){
    console.log('client disconnect...',client.id)
    handleDisconnect()
  })

  client.on('error',function(err){
    console.log('received error from client: ',client.id)
    console.log(err)
  })
})

// app.set('port', process.env.PORT || 4000);

// app.listen(app.get('port'))

//app.listen(4000);

// var port = normalizePort(process.env.PORT || '4000');
// app.set('port', port);

/**
 * Create HTTP server.
 */

// server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */



server.listen(4000,function(err){
  if (err) throw err
  console.log('listening on port 4000')
});

module.exports = app;
