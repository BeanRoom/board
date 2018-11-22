const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var router = express.Router();
// DB 대체
//var dbData = require('../public/test/db.json');
// Connection URL
const url = 'mongodb://127.0.0.1:27017';
// Database Name
var dbo;
const dbName = 'board';
MongoClient.connect(url, function(err,client) {
  assert.equal(null,err);
  console.log("연결 성공");
  dbo = client.db('test');
})

/* GET home page. */
router.get('/:board', function(req, res, next) {
  var board = req.params.board;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    board = "freeboard";
  }
  if (board === "error") {
    res.render('board/error');
    return;
  }
  console.log(board);
  dbo.collection('board').find({board: board}).toArray(function(err, result) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].visible === 0) {
        result[i].writerID = "익명";
      }
    }
    console.log(result);
    res.render('board/lists', { board: board, list: result });
  });
});

router.get('/:board/:id', function(req, res, next) {
  var board = req.params.board;
  var id = req.params.id;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
    return;
  }
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/" + req.params.board);
    return;
  }
  if (id === "write") {
    res.render('board/write', { board: board });
  } else {
    var dbData;
    try {
      dbData = dbo.collection('board').findOne({visible: 1, board: board, board_num: id});
    } catch (e) {
      res.redirect('/board/error');
      return;
    }


    var postWriter = dbData['writer']
    if (dbData['visible'] == 0) {
      postWriter = "익명";
    }
    console.log("Board System Working");
    res.render('board/view', { title: dbData['title'], content: dbData['content'], time: dbData['time'], hits: dbData['hits'], writer: postWriter, boardNum: req.params.id });
  }
});

router.get('/:board/:id/:mode', function(req,res,next) {
  var board = req.params.board;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
    return;
  }
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/freeboard");
    return;
  }
  var dbData;
  try {
    dbData = dbo.board.findOne({visible: 1, board: board, board_num: id});
  } catch (e) {
    res.redirect('/board/error');
    return;
  }
  switch (req.params.mode) {
    case "edit":
      res.render('board/edit', { board: board, title: dbData['title'], content: dbData['content'] });
      break;
    case "delete":
      res.render('board/delete', { title: dbData['title'], nid: req.params.id });
    default:
      break;
  }
});

router.get('/deleteDo/:id', function(req, res, next) {
  if (typeof req.params.id === "undefined") {
    res.send("<script type='text/javascript'>window.alert('ERROR.');window.location=('/board/lists');</script>");
    return;
  }
  dbo.board.remove({"board_num": req.params.id})
  // DB 처리
  res.redirect("/board/lists");
})

router.post('/writeDo/:id', function(req, res, next) {
  if (typeof req.params.id === "undefined") {
    res.send("<script type='text/javascript'>window.alert('ERROR.');window.location=('/board/lists');</script>");
  }
  var dbData;
  try {
    dbo.collection('meta').findOne({info: 'board'}).toArray(function(err, result) {
      dbData = result['count'] + 1;
    });
    dbo.meta.update({info:'board'}, {$set: { count: dbData }});
    dbo.board.insertOne({board: req.body.board, board_num: dbData,});
  } catch (e) {
    res.send("<script type='text/javascript'>window.alert('ERROR.');window.location=('/board/lists');</script>");
    return;
  }
  res.redirect("/board/lists");
})

module.exports = router;
