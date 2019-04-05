var mainCtrl=require('./MainController');
var db = require("../lib/db");
var mongodb = require('mongodb');

var addChartData=function(req,res,next){
	var database=db.getDb();
	var appname=req.body.app_name;
	var loglevel=req.body.log_level;
	var userid=res.locals.data.data.user_id;  

	database.collection("chart_data").find({user_id:userid,app_name:appname,log_level:loglevel})
	.toArray(function(err,result){
		var data={
				user_id:userid,
				app_name:appname,
				log_level:loglevel
			}
		if(result.length==0){
			data["count"]=1;
			mainCtrl.add(database,"chart_data",data,res,next);
		}else{
			data["count"]=result[0].count+1;
			mainCtrl.update(database,"chart_data",{app_name:appname,log_level:loglevel},data,res,next);
		}
	});
	/*res.locals.data={data:true}
	next();*/
}
var getChartData=function(req,res,next){
	var database=db.getDb();
	var userid=res.locals.data.data.user_id;  
	database.collection("chart_data").find({user_id:userid}).toArray(function(err,result){
		if(err) throw err;
		res.locals.data={chartdata:result}
		next();
	});
}
var deleteChartData=function(req,res,next){
	var database=db.getDb();
	var userid=res.locals.data.data.user_id;
	var appname=req.body.app_name;
	var loglevel=req.body.log_level;
	database.collection("chart_data").find({user_id:userid,app_name:appname,log_level:loglevel})
	.toArray(function(err1,rslt){
		if(err1) throw err1;
		var data={
				user_id:userid,
				app_name:appname,
				log_level:loglevel
			}
		if(rslt.length==0){
			return res.status(404).send({ data: false });
		}else{
			data["count"]=rslt[0].count-1;
			mainCtrl.update(database,"chart_data",{app_name:appname,log_level:loglevel},data,res,next);
		}
	});
	/*res.locals.data={data:true}
	next();*/

}
module.exports.addChartData=addChartData;
module.exports.getChartData=getChartData;
module.exports.deleteChartData=deleteChartData;