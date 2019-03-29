var mainCtrl=require('./MainController')
var mongodb = require('mongodb');
var db = require("../lib/db");

var IndexAction = function(req, res, next) {
    var database=db.getDb();
    var userid=res.locals.data.data.user_id; 
    mainCtrl.getAll(database,"app_detail",{"user_id":userid},res,next);
};   

var AddApps=function(req,res,next){
    var userid=res.locals.data.data.user_id;  
    var app_veri=req.body;
    app_veri["user_id"]=userid;
    var database=db.getDb();
    mainCtrl.add(database,"app_detail",app_veri,res,next);
};

var UpdateApps=function(req,res,next){
    var database=db.getDb();
    var myquery={_id:new mongodb.ObjectId(req.params.app_id)}
    var app_veri={};
    database.collection("app_detail").find(myquery).toArray(function(err,result){
        if(err) throw err;
        app_veri["app_ip"]=req.body.app_ip==undefined?result[0].app_ip:req.body.app_ip;
        app_veri["hostname"]=req.body.hostname==undefined?result[0].hostname:req.body.hostname;
        app_veri["version"]=req.body.version==undefined?result[0].version:req.body.version;
        app_veri["user_id"]=result[0].user_id;

        mainCtrl.update(database,"app_detail",myquery,app_veri,res,next);
    });
};

var DeleteApps=function(req,res,next){
    var database=db.getDb();
    var id={_id:new mongodb.ObjectId(req.params.app_id)}
    mainCtrl.deleteData(database,"app_detail",id,res,next);
};

module.exports.index = IndexAction;
module.exports.addApps=AddApps;
module.exports.deleteApps=DeleteApps;
module.exports.updateApps=UpdateApps;