var MongoClient = require('mongodb').MongoClient;
var conf = require('../config/database');
var url = "mongodb://localhost:"+conf.connection.port;
exports.getConnection = function(callback) {
	MongoClient.connect(url, function(err, db) {
  	if (err) throw err;
  	callback(err,db);
	});
}
module.exports = {

  connectToServer: function( callback ) {
    MongoClient.connect( url, function( err, db ) {
      console.log("1")

      _db = db.db(conf.connection.database);
      _con=db;
      return callback( err );
    } );
  },

  getDb: function() {
    console.log("2")
    return _db;
  },
  closeConnection:function(err){
  	_con.close();
  }

};