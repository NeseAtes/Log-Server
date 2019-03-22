var IndexAction = function(req, res, next) {
    var appArr = [];
    var database=res.locals.database;
    var userid=res.locals.data.data.user_id;  
    database.collection("app_detail").find({}).toArray(function(err,result){
        if(err) throw err;
        else{
            for(var i in result){
                var app=result[i];
                appArr.push(app);
            }
            res.locals.data={
                data:appArr
            }
            next();
        }
    }); 
};   

var AddApps=function(req,res,next){
    var userid=res.locals.data.data.user_id;  
    var app_veri={
        app_ip:req.body.app_ip == "" ? null : req.body.app_ip,
        hostname:req.body.hostname,
        version:req.body.version,
        user_id:userid   
    };

    var database=res.locals.database;
    database.collection("app_detail").insertOne(app_veri,function(err,result){
        if(err) throw err;
        else{
            res.locals.data={data:true};
            next();
        }
    });
};
var mongodb = require('mongodb');

var UpdateApps=function(req,res,next){
    var database=res.locals.database;
    var myquery={_id:new mongodb.ObjectId(req.params.app_id)}
    var app_veri={};
    if(req.body.app_ip!="")
        newVal["app_ip"]=req.body.app_ip;
    if(req.body.hostname!="")
        newVal["hostname"]=req.body.hostname;
    if(req.body.version!="")
        newVal["version"]=req.body.version;
    database.collection("app_detail").update(myquery,app_veri,function(err,result){
        if (err) {
            next(err);
        }
        else{
            res.locals.data={
                data : true
            };
            next();
        }
    });
};

var DeleteApps=function(req,res,next){
    var database=res.locals.database;
    var id={_id:new mongodb.ObjectId(req.params.app_id)}
    database.collection("app_detail").deleteOne(id,function(err,obj){
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
module.exports.addApps=AddApps;
module.exports.deleteApps=DeleteApps;
module.exports.updateApps=UpdateApps;