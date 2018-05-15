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
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy
passport.serializeUser(function(user, done) {
  console.log('3、将用户的id序列化进session中')
  done(null, user.id);
});
 
passport.deserializeUser(function(id, done) {
  console.log("4、在session中获取用户")
    done(null, useradmin);
});




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
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log("1、获取上传的数据")
      if(useradmin.username == username&&useradmin.password == password){
        console.log('2、验证证据返回回调')
        return done(null,useradmin,"测试数据")
      }else{
        return done(null,false)
      }
  }
));

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
app.post('/login', function(req,res,next){
  console.log("进来了")
  passport.authenticate('local', function(err, user, info) {
    console.log("2.1、回调执行",info)
    if (err) return next(err);
    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.send("卡了")
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      res.json({ msg: '登录成功！' });
    });
  })(req,res,next)
}
);

app.get('/login',(req,res)=>{
  res.send("未登录")
})
var isAuthenticated = function(req, res, next) {
  console.log(req.isAuthenticated())
  if (req.isAuthenticated()) return next();
  res.send("没有登录")
};

app.get('/logined',isAuthenticated,function(req,res){
  console.log(req.user);
  res.send('ok')
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
