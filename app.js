var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var RedisStore = require('connect-redis')(session);
var redis = require("redis");
var redisClient = redis.createClient();
var fs = require('fs');
var app = express();

var useradmin = {username:123,password:123,id:"111"}





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


var sessionOptions = {
  secret:"asdsdadsdadas",
  resave:true,
  rolling: true,
  saveUninitialized:true,
  cookie: {
    maxAge: 30*1000,
    httpOnly: true,
    secure: false,
  },
  store: new RedisStore({
    client: redisClient,
    ttl:  30
  })
}

app.use(session(sessionOptions))

// var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})
// app.use(logger('short',{stream:accessLogStream}));
// app.use(logger('combined', {stream: accessLogStream}))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
// app.post('/login',passport.authenticate('local',{
//      successRedirect: '/',
//      failureRedirect: '/login2'
// },function(req,res){
//   // console.log(req.user);
//   console.log("22222");
//   res.send("33333")
// }))

const sleep = ms => new Promise(r => setTimeout(r, ms))
app.get('/login',(req,res)=>{
  // res.send("未登录")
  res.type('html');   
  res.write('loading...<br>')

  return sleep(2000).then(function() {
    res.write(`timer: 2000ms<br>`)
    return sleep(5000)
  })
  .then(function() {
    res.write(`timer: 5000ms<br>`)
  }).then(function() {
    res.end()
  })
})




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
