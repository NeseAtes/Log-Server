var mainCtrl=require('./MainController')
var UserCtrl=require('./UserController')
var db = require("../lib/db");
var mongodb = require('mongodb');
var bcrypt = require('bcrypt');


var get_userRequests=function(req,res,next){
    var database=db.getDb();
    mainCtrl.getAll(database,"user_register_requests",{},res,next);
}
var add_request=function(req,res,next){
	var database=db.getDb();
	bcrypt.hash(req.body.password, 10, function(err, hash) {
	  // Store hash in database
	  req.body.password=hash;
	  mainCtrl.add(database,"user_register_requests",req.body,res,next);
	});
}
var positive_answer=function(req,res,next){
	var database=db.getDb();
	var req_id={_id:new mongodb.ObjectId(req.query.id)}
	database.collection("user_register_requests").findOne(req_id,function(err,result){
		if(err) throw err;
		req.body=result;
		UserCtrl.addUser(req,res,next);
		mainCtrl.deleteData(database,"user_register_requests",req_id,res,next);
	});
}
var negative_answer=function(req,res,next){
	var database=db.getDb();
	var req_id={_id:new mongodb.ObjectId(req.query.id)};
	mainCtrl.deleteData(database,"user_register_requests",req_id,res,next);
}
module.exports.get_userRequests=get_userRequests;
module.exports.add_request=add_request;
module.exports.positive_answer=positive_answer;
module.exports.negative_answer=negative_answer;
