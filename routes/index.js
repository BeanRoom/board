var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { target1: '/board/freeboard', target2: '/board/write' });
});

module.exports = router;
