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

router.get('/', function(req, res, next) {
  res.redirect("/board/freeboard");
});

/* Functional */

router.post('/:board/writeDo', function(req, res, next) {
  try {
    dbo.collection('meta').findOne({info: 'board'}, function(err, result) {
      var counts = result.counter + 1;
      dbo.collection('meta').updateOne({info:'board'}, {$set: { counter: counts }});
      console.log(counts);
      dbo.collection('board').insertOne({board: req.params.board,
         boardNum: counts,
         title: req.body.title,
         contents: req.body.text,
         postingTime: new Date().valueOf(),
         visable: 1,
         writerID: 'startergate',
      hits: 0});
    });
  } catch (e) {
    res.send("<script type='text/javascript'>window.alert('ERROR.');window.location=('/board/freeboard');</script>");
    console.log(e);
    return;
  }
  res.redirect("/board/"+req.params.board);
});

/* GET home page. */
router.get('/:board', function(req, res, next) {
  var board = req.params.board;
  if (board === "error") {
    res.render('board/error');
    return;
  }
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
  }
  dbo.collection('board').find({board: board}).toArray(function(err, result) {
    for (var i = 0; i < result.length; i++) {
      if (result[i].visible === 0) {
        result[i].writerID = "익명";
      }
    }
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
    try {
      list = dbo.collection('board').findOne({boardNum: Number(id)}, function(err, result) {
        if (err) throw err;
        var counts = result.hits + 1;
        dbo.collection('board').updateOne({boardNum: Number(id)}, {$set: { hits: counts }});
        var postWriter = result["writerID"];
        if (result.visible == 0) {
          postWriter = "익명";
        }
        console.log("Board System Working");
        res.render('board/view', { data: result, writer: postWriter, boardNum: req.params.id });
      });
    } catch (e) {
      console.log(e);
      res.redirect('/board/error');
      return;
    }
  }
});

router.post('/:board/:id/editDo', function(req,res,next) {
  var board = req.params.board;
  if (typeof req.params.board === "undefined" || (board !== 'freeboard' && board !== 'notice' && board !== 'storage')) {
    res.redirect("/board/freeboard");
    return;
  }
  if (typeof req.params.id === "undefined") {
    res.redirect("/board/freeboard");
    return;
  }
  dbo.collection("board").updateOne({boardNum: Number(req.params.id)}, {$set: { title: req.body.title, contents: req.body.text }})
  // DB 처리
  res.redirect("/board/"+board+"/"+req.params.id);
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
  if (req.params.mode === "deleteDo") {
    dbo.collection("board").deleteOne({"boardNum": Number(req.params.id)}, function(err, obj) {
      console.log(err);
    })
    // DB 처리
    res.redirect("/board/"+board);
  }
  try {
    dbo.collection("board").findOne({boardNum: Number(req.params.id)}, function(err, result) {
      console.log(req.params.id);
      switch (req.params.mode) {
        case "edit":
          res.render('board/edit', { board: board, data: result });
          break;
        case "delete":
          res.render('board/delete', { board: board, title: result['title'], nid: req.params.id });
        default:
          break;
      }
    });
  } catch (e) {
    console.log(e);
    res.redirect('/board/error');
    return;
  }
});




module.exports = router;
