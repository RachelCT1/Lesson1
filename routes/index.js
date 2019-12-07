let express = require('express');
let router = express.Router();

let sql_operation = require("./operation");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/query", function(req, res, next) {
  sql_operation.query(req, res, next);
});

module.exports = router;
