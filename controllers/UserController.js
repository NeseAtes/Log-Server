var mainCtrl=require('./MainController')
var db = require("../lib/db");

var addUser=function(req,res,next){
    var database=db.getDb();    
   database.collection("users").find({username:req.body.username}).count(function(err,result){
        if(err) throw err;
        if(result==0){
            mainCtrl.add(database,"users",req.body,res,next);
        }
        else{
            res.locals.data={data:false};
            next();   
        }
   });
};
var getAllUsers=function(req,res,next){
    var database=db.getDb();
    mainCtrl.getAll(database,"users",{},res,next);
};
var TokenCtrl = require("../controllers/tokenCtrl");
var bcrypt = require('bcrypt');

var login=function(req,res,next){
    var database=db.getDb();

    database.collection("users").findOne({username:req.body.username},function(err,result){
        if (err) throw err;
        else if(result!=null){
            bcrypt.compare(req.body.password, result.password, function(err, reslt) {
                if(reslt) {
                   // Passwords match
                    var userid={
                        user_id:result._id,
                        role:result.role
                    };
                    //token
                    var token=TokenCtrl.token(userid);
                    //save it 
                    res.cookie('auth',token);
                    res.locals.data = {
                        is_user:true,
                        is_admin:result.role=="admin"?true:false,
                        data: token
                    };
                    next();

              } else {
               // Passwords don't match
                return res.send({is_user:false,message: 'Please check the information' });
              } 
            });
            
        }        
        else{
            return res.send({is_user:false,message: 'Please check the information' });
        }
    });
}

var logout=function(req,res,next){
    res.clearCookie('auth');
    //db.closeConnection();
    res.send({message:'OK'})
}
module.exports.logout=logout;
module.exports.login=login;
module.exports.getAllUsers=getAllUsers;
module.exports.addUser=addUser;