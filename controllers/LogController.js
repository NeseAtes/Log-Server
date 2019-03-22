var moment = require("moment");
var esController = require("./ElasticSearchController");

var IndexAction = function(req, res, next) {
    var userid=res.locals.data.data.user_id;  

    var logArr = [];
    var log_id=req.params.log_id||req.body.log_id;
    var app_name = req.query.app_name||req.body.app_name;
    var date = req.query.date||req.body.date;
    var log_level = req.query.log_level||req.body.log_level;
    function buildConditions()
    {
        var logConditions={user_id:userid};

        if (typeof app_name !== 'undefined')
            logConditions["app_name"]=app_name;
        if (typeof date  !== 'undefined')
            logConditions["date"]=date;
        if (typeof log_level !== 'undefined')
            logConditions["log_level"]=log_level;

      return logConditions;
    }
    var conditions = buildConditions();
    var database=res.locals.database;
    database.collection("logs").find(conditions)
    .toArray(function(err,result){
        if (err) {
            next(err);
        } else {
        for (var i in result) {
            var log = {             
                log_id: result[i].log_id,
                app_name: result[i].app_name,
                date: moment(result[i].date).format("DD.MM.YYYY"),
                description: result[i].description,
                log_level: result[i].log_level                     
        };
        logArr.push(log);
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
    var database=res.locals.database;
    var logbes = [];

    database.collection("logs").
    find({user_id:userid}).limit(5).sort({_id:-1}).
    toArray(function(err,result){
        if (err) {
            next(err);
        } else {
        for (var i in result) {
            var log = {             
                log_id: result[i]._id,
                app_name: result[i].app_name,
                date: moment(result[i].date).format("DD.MM.YYYY"),
                description: result[i].description,
                log_level: result[i].log_level                     
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
    var database=res.locals.database;
    var userid=res.locals.data.data.user_id;  
    var sayfa = [];

    var ofvalue = req.query.ofvalue * 10 || req.body.ofvalue * 10;
    database.collection("logs").find({user_id:userid}).skip(ofvalue).limit(20).toArray(function(err,result){
        if(err){
            console.log(err)
        }
        else{
            for (var i in result) {
                var log = {
                    log_id: result[i].log_id,
                    app_name: result[i].app_name,
                    date: moment(result[i].date).format("DD.MM.YYYY"),
                    description: result[i].description,
                    log_level: result[i].log_level
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
    var database=res.locals.database;
    var userid=res.locals.data.data.user_id;  

    database.logs.find({user_id:userid}).count(function(err,result){
        if(err) throw err;
        else{
            var log={
                sayi:result
            };
            res.locals.data={
                data:log
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
    var database=res.locals.database;
    database.collection("logs").insertOne(logObj,function(err,result){
        if(err) throw err;
        else{
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
var mongodb = require('mongodb');

var UpdateLog=function(req,res,next){
    var database=res.locals.database;
    var myquery={_id:new mongodb.ObjectId(req.params.log_id)}
    var newVal={};
    if(req.body.app_name!="")
        newVal["app_name"]=req.body.app_name;
    if(req.body.date!="")
        newVal["date"]=moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
    if(req.body.description!="")
        newVal["description"]=req.body.description;
    if(req.body.log_level!="")
        newVal["log_level"]=req.body.log_level;
    database.collection("logs").update(myquery,newVal,function(err,result){
        if(err) throw err;
        else{
            res.locals.data={
                data: true
            };
            next();
        }
    });
    
};
var DeleteLog=function(req,res,next){
    var database=res.locals.database;
    var id={_id:new mongodb.ObjectId(req.params.log_id)}
    database.collection("logs").deleteOne(id,function(err,obj){
        if(err) throw err;
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