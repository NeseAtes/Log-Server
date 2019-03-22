var addUser=function(req,res,next){
    var database=res.locals.database;
    database.collection("users").insertOne(req.body, function(err,result){
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
var getAllUsers=function(req,res,next){
    var database=res.locals.database;
    var userArr=[];
    database.collection("users").find({}).toArray(function(err, result) {
        if (err) throw err;

        else {
            for (var i in result){
                var user = result[i];
                userArr.push(user);
            }
            res.locals.data = {
                data: userArr
            }
            next();
        }
    });
};
var TokenCtrl = require("../controllers/tokenCtrl");
var login=function(req,res,next){
    var database=res.locals.database;
    database.collection("users").findOne(req.body,function(err,result){
        if (err) throw err;
        else if(result!=null){
            var userid={
                user_id:result._id
            };
            //token
            var token=TokenCtrl.token(userid);
            //save it 
            res.cookie('auth',token);
            res.locals.data = {
                is_user:true,
                data: token
            };
            next();
        }        
        else{
            return res.send({is_user:false,message: 'Please check the information' });
        }
    });
}
var logout=function(req,res,next){
    res.clearCookie('auth');
    
    res.send({message:'OK'})
}
module.exports.logout=logout;
module.exports.login=login;
module.exports.getAllUsers=getAllUsers;
module.exports.AddUser=addUser;