var express = require('express');
var request = require('request');
var router = express.Router();

// DB 대체
var dbData = require('../public/test/db.json');


/* GET home page. */
router.get('/:board', function(req, res, next) {
  var board = req.params.board;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    board = "freeboard";
  }
  //switch (board) {
  //  case "freeboard":

  //    break;
  //  case "notice":
  //    break;
  //  case "storage"
  //  default:

  //}
  res.render('board/lists', { title: dbData['title'], content: dbData['content'], time: dbData['time'], hits: dbData['hits'], writer: dbData['writer'] });
});

router.get('/:board/:id', function(req, res, next) {
  var board = req.params.board;
  var id = req.params.id;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
  }
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/" + req.params.board);
  }
  if (id === "write") {
    res.render('board/write', { board: board });
  } else {
    postWriter = dbData['writer']
    if (dbData['visible'] == 0) {
      postWriter = "익명";
    }
    console.log("Board System Working");
    res.render('board/view', { title: dbData['title'], content: dbData['content'], time: dbData['time'], hits: dbData['hits'], writer: postWriter, boardNum: req.params.id });
  }
});

router.get('/:board/:id/:mode', function(req,res,next) {
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
  }
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/freeboard");
  }
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
  }
  switch (req.params.mode) {
    case "edit":
      res.render('board/write', {});
      break;
    case "delete":
      res.render('board/delete', { title: dbData['title'], nid: req.params.id });
    default:
      break;
  }
});


router.get('/write', function(req, res, next) {
  console.log("Board System Working");

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
