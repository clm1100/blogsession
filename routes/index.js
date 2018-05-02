var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // res.json({a:req.session,b:req.sessionID,id:process.pid})
  res.send("222")
});

module.exports = router;
