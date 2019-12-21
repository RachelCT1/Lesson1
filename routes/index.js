let express = require('express');
let router = express.Router();

let sql_operation = require("./operation");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//添加数据库查询的路由
router.get("/query", function(req, res, next) {
  sql_operation.query(req, res, next);
});

router.get('/test', function(req, res, next) {
  res.render('first', { title: 'Express' });
});

module.exports = router;
