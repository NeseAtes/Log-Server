var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("log");
  dbo.createCollection("logs", function(err, res) {
    if (err) throw err;
    console.log("Logs Collection created!");
  });
  dbo.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Users Collection created!");
  });
  dbo.createCollection("app_detail", function(err, res) {
    if (err) throw err;
    console.log("App detail Collection created!");
  });
  db.close();

});