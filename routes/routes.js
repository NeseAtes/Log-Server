var LogController = require("../controllers/LogController");
var BaseController = require("../controllers/BaseController");
var AppController = require("../controllers/AppController");
var HomeController = require("../controllers/HomeController");
var ESController= require("../controllers/ElasticSearchController");
var UserController=require("../controllers/UserController");
var TokenCtrl = require("../controllers/tokenCtrl");
var cookieParser = require('cookie-parser')

module.exports = function(app) {

    app.use(cookieParser())

    app.get('/',TokenCtrl.tokenControl,HomeController.index);  
    app.post('/login',BaseController.InitSession,UserController.login,BaseController.EndSession);  
    app.get('/api/user',TokenCtrl.tokenControl,BaseController.InitSession,UserController.getAllUsers,BaseController.EndSession);
    app.post('/api/user/add',TokenCtrl.tokenControl,BaseController.InitSession,UserController.AddUser,BaseController.EndSession);
    app.get('/api/log', BaseController.InitSession, LogController.index, BaseController.EndSession );
    app.post('/api/log/add', BaseController.InitSession, LogController.addlog, BaseController.EndSession);
    app.get('/api/log/list', BaseController.InitSession, LogController.list, BaseController.EndSession);
    app.get('/api/apps', TokenCtrl.tokenControl,BaseController.InitSession, AppController.index, BaseController.EndSession );
    app.post('/api/apps/add',TokenCtrl.tokenControl,BaseController.InitSession, AppController.addApps,BaseController.EndSession);
    app.post('/api/apps/update/:app_id', TokenCtrl.tokenControl,BaseController.InitSession, AppController.updateApps, BaseController.EndSession);
    app.delete('/api/apps/delete/:app_id', TokenCtrl.tokenControl,BaseController.InitSession, AppController.deleteApps, BaseController.EndSession);
    app.post('/api/log/update/:log_id', BaseController.InitSession, LogController.updateLog, BaseController.EndSession);
    app.delete('/api/log/delete/:log_id', BaseController.InitSession, LogController.deleteLog, BaseController.EndSession);
    app.post('/api/es/createIndex',  ESController.createIndex);
    app.post('/api/es/addDocument', ESController.addDocument);
    app.post('/api/es/search', ESController.search);
    app.post('/api/es/mapping', ESController.mapp);
    app.post('/api/es/update/:id', ESController.update);
    app.get('/tokenControl', TokenCtrl.tokenControl);
   
    var errorHandler = function(err, req, res, next) {
        if (res.locals.connection) {
            res.locals.connection.release();
        }
        res.json({
            data: null,
            error: err
        });
    };
    app.use(errorHandler);
};

//module.exports = function(wsapp){}