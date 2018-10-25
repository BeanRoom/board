var express = require('express');
var request = require('request');
var router = express.Router();

// DB 대체
var dbData = require('../public/test/db.json');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect("/board/lists");
});

router.get('/view', function(req, res, next) {
  res.redirect("/board/lists");
});
router.get('/view/:id', function(req, res, next) {
  // DB 불러오기
  console.log(req.params.id);
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/lists");
  }
  postWriter = dbData['writer']
  if (dbData['visible'] == 0) {
    postWriter = "익명";
  }
  console.log("Board System Working");
  res.render('board/view', { title: dbData['title'], content: dbData['content'], time: dbData['time'], hits: dbData['hits'], writer: postWriter, boardNum: req.params.id });
});
router.get('/lists', function(req, res, next) {
  var board = req.query.flag;
  console.log("Board System Working");
  res.render('board/lists', { title: dbData['title'], content: dbData['content'], time: dbData['time'], hits: dbData['hits'], writer: dbData['writer'] });
});
router.get('/write', function(req, res, next) {
  console.log("Board System Working");
  res.render('board/write', {});
});
router.get('/modify', function(req, res, next) {
  console.log("Board System Working");
  res.render('board/modify', { title: dbData['title'], content: dbData['content'] });
});
router.get('/delete', function(req, res, next) {
  res.redirect("/board/lists");
});
router.get('/delete/:id', function(req, res, next) {
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/lists");
  }
  res.render('board/delete', { title: dbData['title'], nid: req.params.id });
});

router.post('/deleteDo', function(req, res, next) {
  if (typeof req.body.id === "undefined") {
    res.send("<script type='text/javascript'>window.alert('본문이 입력되지 않았습니다.');window.location=('/board/lists');</script>");
  }

  // DB 처리
  res.redirect("/board/lists");
})

router.post('/writeDo', function(req, res, next) {
  if (typeof req.body.id === "undefined") {
    res.send("<script type='text/javascript'>window.alert('본문이 입력되지 않았습니다.');window.location=('/board/lists');</script>");
  }
  res.redirect("/board/lists");
})

module.exports = router;
