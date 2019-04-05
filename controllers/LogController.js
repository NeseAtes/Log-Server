var moment = require("moment");
var mainCtrl=require('./MainController')
var chartCtrl=require('./ChartController')
var mongodb = require('mongodb');
var logSer = require('../WS');
var db = require("../lib/db");

var IndexAction = function(req, res, next) {
    function buildConditions()
    {
        var logConditions={"user_id":res.locals.data.data.user_id};

        var log_id=req.params.log_id||req.body.log_id;
        var app_name = req.query.app_name||req.body.app_name;
        var date = req.query.date||req.body.date;
        var log_level = req.query.log_level||req.body.log_level;
        if (app_name != undefined)
            logConditions["app_name"]=app_name;
        if (date  != undefined)
            logConditions["date"]=date;
        if (log_level != undefined)
            logConditions["log_level"]=log_level;

      return logConditions;
    }

    var database=db.getDb();
    var conditions = buildConditions();

    mainCtrl.getAll(database,"logs",conditions,res,next);

}

var list = function(req,res,next){
    var userid=res.locals.data.data.user_id;  
    var database=db.getDb();

    database.collection("logs").
    find({user_id:userid}).limit(5).sort({_id:-1}).toArray(function(err,result){
        if (err) {
            next(err);
        } else {
        res.locals.data = {
            data: result
        }
        next();
        }
    });
}

var pagList = function(req,res,next) {
    var database=db.getDb();
    var userid=res.locals.data.data.user_id;  

    var ofvalue = req.query.ofvalue * 10 || req.body.ofvalue * 10;
    database.collection("logs").find({user_id:userid}).skip(ofvalue).limit(20).toArray(function(err,result){
        if(err){
            console.log(err)
        }
        else{
            res.locals.data = {
                data: result
            }
            next(); 
        }
    });
}

var AddLog=function(req,res,next){
    var userid=res.locals.data.data.user_id;  

    var logObj = {
        app_name: req.body.app_name == "" ? null : req.body.app_name,
        date: req.body.date == "" ? null : moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD'),
        description: req.body.description,
        log_level: req.body.log_level,
        user_id:userid
    };
    var database=db.getDb();
    mainCtrl.add(database,"logs",logObj,res,next);
    chartCtrl.addChartData(req,res,next);
};

var UpdateLog=function(req,res,next){
    var database=db.getDb();
    var myquery={_id:new mongodb.ObjectId(req.params.log_id)}
    var newVal={};
    database.collection("logs").find(myquery).toArray(function(err,result){
        if(err) throw err;
        console.log(result[0])
        newVal["app_name"]=req.body.app_name==undefined?result[0].app_name:req.body.app_name;
        newVal["date"]=req.body.date==undefined?result[0].date:moment(req.body.date, 'DD.MM.YYYY').format('YYYY-MM-DD');
        newVal["description"]=req.body.description==undefined?result[0].description:req.body.description;
        newVal["log_level"]=req.body.log_level==undefined?result[0].log_level:req.body.log_level;
        newVal["user_id"]=result[0].user_id;
        mainCtrl.update(database,"logs",myquery,newVal,res,next);
          
        if(req.body.log_level!=undefined){
            var data={body:newVal};
            chartCtrl.addChartData(data,res,next);
            data.body.log_level=result[0].log_level;
            chartCtrl.deleteChartData(data,res,next); 
        }  
    });
};
var DeleteLog=function(req,res,next){
    var database=db.getDb();
    var id={_id:new mongodb.ObjectId(req.params.log_id)}
    database.collection("logs").find(id).toArray(function(err,result){
        if(err) throw err;
        console.log(result)
        req.body=result[0];
        chartCtrl.deleteChartData(req,res,next);
    });
    mainCtrl.deleteData(database,"logs",id,res,next); 
};
  
module.exports.index = IndexAction;
module.exports.list= list;
module.exports.addlog = AddLog;
module.exports.updateLog= UpdateLog;
module.exports.deleteLog=DeleteLog;
module.exports.pagList=pagList;
