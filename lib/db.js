var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/database');
var url = "mongodb://localhost:"+conf.connection.port;
exports.getConnection = function(callback) {
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	callback(err,db);
	});
}