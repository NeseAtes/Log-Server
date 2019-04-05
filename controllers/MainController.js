var esController = require("./ElasticSearchController");
var chartController = require("./ChartController");
var logSer = require('../WS');
var add=function(database,tablename,data,res,next){
    database.collection(tablename).insertOne(data, function(err,result){
        if (err) {
            console.log("error",err)
           next(err);
        }
        else{
            if(tablename=="logs"){
                data.insertId=result._id;
                esController.addDocumentInner(data);
                logSer.veri(data);
            }
            res.locals.data ={
                data : true
            };
            next();
        }
    });
}
var getAll=function(database,tablename,conditions,res,next){
    database.collection(tablename).find(conditions).toArray(function(err,result){
        if(err) throw err;
        else{

            res.locals.data={
                data: result
            };

            next();
        }
    });
}
var update=function(database,tablename,query,val,res,next){
	database.collection(tablename).update(query,val,function(err,result){
        if(err) throw err;
        else{
            res.locals.data={
                data: true
            };
            next();
        }
    });
}
var deleteData=function(database,tablename,id,res,next){
    database.collection(tablename).deleteOne(id,function(err,obj){
        if(err) throw err;
        else{
            res.locals.data={
                data: true            
            };
            next();
        }
    });
}
module.exports.add=add;
module.exports.getAll=getAll;
module.exports.update=update;
module.exports.deleteData=deleteData;
