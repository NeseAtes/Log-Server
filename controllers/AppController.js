var IndexAction = function(req, res, next) {
    var appArr = [];
    var connection = res.locals.connection;
    var userid=res.locals.data.data.user_id;  

    var app_id=req.params.app_id;
    var app_ip=req.query.app_ip;
    var hostname=req.query.hostname;
    var version=req.query.version;

    connection.query("SELECT * from app_detail where user_id=?",[userid],function(err, apps) {
        if (err) {
            next(err);
        } 
        else {
            for (var i in apps){
                var app = {
                    app_id : apps[i].app_id,
                    app_ip : apps[i].app_ip,
                    hostname : apps[i].hostname,
                    version : apps[i].version,
                };
                appArr.push(app);
            }
            res.locals.data = {
                data: appArr
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

    var connection = res.locals.connection;
    connection.query("Insert into app_detail set ? ", app_veri, function(err,result){
        if (err) {
           next(err);
        }
        else{
            res.locals.data ={
                data : true
            };
            next();
        }
    
    });
};

var UpdateApps=function(req,res,next){
    var app_veri={
        app_ip: req.body.app_ip == "" ? null : req.body.app_ip,
        hostname: req.body.hostname,
        version: req.body.version,
        app_id: req.params.app_id
    };

console.log("object",app_veri);

    var connection = res.locals.connection;
    connection.query("Update app_detail set ? where app_id = ?", [app_veri, app_veri.app_id], function(err,result){
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
    var connection = res.locals.connection;
    connection.query("Delete from app_detail where app_id = ? ", [req.params.app_id] , function(err, result){
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

module.exports.index = IndexAction;
module.exports.addApps=AddApps;
module.exports.deleteApps=DeleteApps;
module.exports.updateApps=UpdateApps;