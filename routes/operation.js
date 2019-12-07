let $sql = require('./sql');
let MysqlPool = require('./mysql_pool');

let mysqlPool = new MysqlPool();
let pool = mysqlPool.getPool();

module.exports = {
    query: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query(req.query.sql, function(err, result) {
                if(err){
                    console.log(err);
                    res.send(err)
                }
                res.send(result);
                connection.release();
            });
        });
    },
    add: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            let param = req.query || req.params;

            connection.query($sql.insert, [param.name, param.age], function(err, result) {
                if(err) {
                    res.send(err);
                }else{
                    res.send('add success');
                }
                // 释放连接
                connection.release();
            });
        });
    },
    update: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            let param = req.query || req.params;

            connection.query($sql.update, [param.name, param.age, +param.id], function(err, result) {
                if(err) {
                    res.send(err);
                }else{
                    res.send('update success');
                }

                connection.release();
            });
        });
    },
    delete: function (req, res, next) {
        pool.getConnection(function(err, connection) {
            connection.query($sql.delete, function(err, result) {
                if(err) {
                    res.send(err);
                }else{
                    res.send('delete success');
                }
                connection.release();
            });
        });
    }
};
