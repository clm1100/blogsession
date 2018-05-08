var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  res.json({a:req.session,b:req.sessionID,id:process.pid})
  // req.session.user = JSON.stringify({name:"3343434werw"})
  // res.send("222")
});

module.exports = router;
