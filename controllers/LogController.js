var moment = require("moment");
var esController = require("./ElasticSearchController");
//var deneme = require("./dene");

var IndexAction = function(req, res, next) {
    var userid=res.locals.data.data.user_id;  

    var logArr = [];
    var connection = res.locals.connection;

    var log_id=req.params.log_id||req.body.log_id;
    var app_name = req.query.app_name||req.body.app_name;
    var date = req.query.date||req.body.date;
    var log_level = req.query.log_level||req.body.log_level;
    console.log(req.query);
    function buildConditions()
    {
      var conditions = [];
      var values = [];

        if (typeof app_name !== 'undefined')
        {
            conditions.push("app_name = ?");
            values.push(app_name);
        }

        if (typeof date  !== 'undefined')
        {
            conditions.push("date = ?");
            values.push(date);
        }

        if (typeof log_level !== 'undefined') 
        {
            conditions.push("log_level = ?");
            values.push(log_level);
        }

      return {
        where: conditions.length ?
                 conditions.join(' AND ') : 'user_id='+"'"+userid+"'",
        values: values
      };
    }
    var conditions = buildConditions();
    var sql = 'SELECT * FROM logs WHERE ' + conditions.where;
    console.log("xx",conditions);
    
    connection.query(sql,conditions.values , function(err, logs) {
        if (err) {
            next(err);
        } else {
        for (var i in logs) {
            var log = {             
                log_id: logs[i].log_id,
                app_name: logs[i].app_name,
                date: moment(logs[i].date).format("DD.MM.YYYY"),
                description: logs[i].description,
                log_level: logs[i].log_level                     
        };
        logArr.push(log);
        console.log(req.query);
        }
        res.locals.data = {
            data: logArr
        }
        next();
        }
    });
};

var list = function(req,res,next){
    var userid=res.locals.data.data.user_id;  

    var connection = res.locals.connection;
    var sonbes = 'SELECT * FROM logs where user_id=? Order By log_id DESC LIMIT 5'
    var logbes = [];
    connection.query(sonbes,[userid], function(err, logs) {
        if (err) {
            next(err);
        } else {
        for (var i in logs) {
            var log = {             
                log_id: logs[i].log_id,
                app_name: logs[i].app_name,
                date: moment(logs[i].date).format("DD.MM.YYYY"),
                description: logs[i].description,
                log_level: logs[i].log_level                     
        };

        logbes.push(log);
        }
        res.locals.data = {
            data: logbes
        }
        next();
        }
    });
}

var pagList = function(req,res,next) {
    var connection = res.locals.connection;
    var sayfa = [];
    var ofvalue = req.query.ofvalue * 10 || req.body.ofvalue * 10;
    connection.query("SELECT * FROM logs LIMIT 20 OFFSET " + ofvalue, function(err,logs){
        if (err) {
            next(err);
        } else {
            for (var i in logs) {
                var log = {
                    log_id: logs[i].log_id,
                    app_name: logs[i].app_name,
                    date: moment(logs[i].date).format("DD.MM.YYYY"),
                    description: logs[i].description,
                    log_level: logs[i].log_level
                };
                sayfa.push(log);
            }
            res.locals.data = {
            data: sayfa
            }
            next();   
        }
    });
}

var sayfasayi = function(req,res,next){
    var connection = res.locals.connection;
    connection.query("SELECT COUNT(*) as total FROM logs",  function(err,logs){
        console.log(logs);
        if (err) {
            next(err);
        } else {
            for (var i in logs) {
                var log = {
                    sayi: logs[i].total
                };
                console.log(logs[i].total);
            }
            res.locals.data = {
            data: log
            }
            next();   
        }

    });
}

var logSer = require('../WS');
var AddLog=function(req,res,next){
    var userid=res.locals.data.data.user_id;  

    var logObj = {
        app_name: req.body.app_name == "" ? null : req.body.app_name,
        date: req.body.date == "" ? null : moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        description: req.body.description,
        log_level: req.body.log_level,
        user_id:userid
    };
    var connection = res.locals.connection;
    connection.query("Insert into logs set ?", logObj, function(err, result) {
        if (err) {
            next(err);
        } 
        else {
            console.log("db insert result: ", result);
            logObj.insertId = result.insertId;
            esController.addDocumentInner(logObj, function(error, result){
                console.log("addDocumentInner: ", error, result);
                if(error) {
                    res.locals.data = {
                        data: false,
                        error: error
                    }
                    next();
                }else {
                    res.locals.data = {
                        data: true
                    }
                    
                    next();
                }
                logSer.veri(logObj);
            }); 

        }
    });
};

var UpdateLog=function(req,res,next){

    var logObj={
        app_name: req.body.app_name == "" ? null : req.body.app_name,
        date: req.body.date == "" ? null : moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        description: req.body.description,
        log_level: req.body.log_level,
        log_id: req.params.log_id
    };
    
console.log("object",logObj);
    var connection = res.locals.connection;
    connection.query("UPDATE logs SET ? where log_id = ?", [logObj, logObj.log_id],function(err, result){
        if (err) {
            //return console.error(hata.message);
            next(err);
            //document.alert("hata");
        }
        else{
            res.locals.data={
                data: true
            //console.log("veri eklendi.")
            };
            next();
        }
    });
};

var DeleteLog=function(req,res,next){
    
    var connection = res.locals.connection;
    connection.query("Delete from logs where log_id = ?", [req.params.log_id], function(err,result){
        if (err) {
            //return console.error(hata.message);
            next(err);
        }
        else{
            res.locals.data={
                data: true            
            };
            next();
        }
    });
};
  
module.exports.index = IndexAction;
module.exports.list= list;
module.exports.addlog = AddLog;
module.exports.updateLog= UpdateLog;
module.exports.deleteLog=DeleteLog;
module.exports.pagList=pagList;
module.exports.sayi=sayfasayi;