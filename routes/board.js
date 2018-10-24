var express = require('express');
var router = express.Router();
var postTitle = "a";
var postContent = "a";
var postTime = "a";
var postHits = 10;
var postWriter = "a";
var visible = 1;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/board/view");
});

router.get('/view', function(req, res, next) {
  if (visible == 0) {
    postWriter = "익명";
  }
  console.log(postWriter);
  res.render('board/view', { title: postTitle, content: postContent, time: postTime, hits: postHits, writer: postWriter });
});
router.get('/lists', function(req, res, next) {
  if (visible == 0) {
    postWriter = "익명";
  }
  console.log(postWriter);
  res.render('board/lists', { title: postTitle, content: postContent, time: postTime, hits: postHits, writer: postWriter });
});

module.exports = router;
