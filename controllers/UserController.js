
var addUser=function(req,res,next){
	var login_veri={
		username:req.body.username,
		password:req.body.password
	}
	var connection = res.locals.connection;
	connection.query("Insert into users set ?", login_veri, function(err,result){
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
	var connection = res.locals.connection;
	var userArr=[];
	var user_id=req.query.user_id;
	var username=req.query.username;
	var password=req.query.password;
	connection.query("SELECT * from users", function(err, users) {
        if (err) {
            next(err);
        } 
        else {
            for (var i in users){
                var user = {
                    user_id : users[i].user_id,
                    username : users[i].username,
                    password : users[i].password
                };
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
	var connection=res.locals.connection;
	var username=req.body.username;
	var password=req.body.password;
	connection.query("SELECT * FROM users WHERE username=? AND password=?", [username,password], function(err,users){
		if (err) throw err;
    	else{ //if user is exist
    		var userid = {
                user_id : users[0].user_id
            };               
            //token
            var token=TokenCtrl.token(userid);
            //save it 
            res.cookie('auth',token);
            res.locals.data = {
                data: token
            }
            next();
    	}
	});
}
module.exports.login=login;
module.exports.getAllUsers=getAllUsers;
module.exports.AddUser=addUser;