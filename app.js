var express = require('express');
var session = require('express-session');
var path = require('path');
var _  = require('lodash');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var moment = require('moment');
var bodyParser = require('body-parser');
var appconfig = require('./config/app');
var port = process.env.PORT || appconfig.port;
var app = express();

var ws = require('./WS.js');
ws.init(app);

var db_connection=require('./lib/db');
var bcrypt = require('bcrypt');

db_connection.connectToServer(function(err){
  if(err) console.log(err)
  var data={
    username:"admin",
    password:"admin",
    role:"admin"
  }
  var database=db_connection.getDb();
    bcrypt.hash(data.password, 10, function(err, hash) {
      // Store hash in database
      data.password=hash;
      database.collection("users").insertOne(data, function(err,result){
        if(err)
          console.log(err)
       });
    });
  
});


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/*app.use(express.static(path.join(__dirname, 'public')));


app.set('views', 'pug');*/

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static('public'))


require('./routes/routes.js')(app); 

/*app.use(function(req, res, next) {
  next(createError(404));
});*/

//var es = require('./controllers/ElasticSearchController');

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
   console.log(err);
  //console.log(res);
  
  res.send(err);
});

app.listen(port);
console.log('The server is on: ' + port);