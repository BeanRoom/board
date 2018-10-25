var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { target1: '/board/view', target2: '/board/write', target3: '/board/modify', target4: '/board/lists', target5: '/board/delete' });
});

module.exports = router;
