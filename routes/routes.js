var LogController = require("../controllers/LogController");
var AppController = require("../controllers/AppController");
var HomeController = require("../controllers/HomeController");
var ESController= require("../controllers/ElasticSearchController");
var UserController=require("../controllers/UserController");
var BaseController=require("../controllers/BaseController");
var AdminController=require("../controllers/AdminController");
var TokenCtrl = require("../controllers/tokenCtrl");
var cookieParser = require('cookie-parser');
var db = require("../lib/db");


module.exports = function(app) {

    app.use(cookieParser())
    app.get('/',HomeController.index);  
    app.post('/login',UserController.login,BaseController.EndSession); 
    app.get('/logout',UserController.logout);
    app.get('/tokenControl', TokenCtrl.tokenControl); 

    app.get('/api/user',TokenCtrl.tokenControl,UserController.getAllUsers,BaseController.EndSession);
    app.post('/api/user/add',UserController.addUser,BaseController.EndSession);

    app.get('/api/log',TokenCtrl.tokenControl, LogController.index,BaseController.EndSession);
    app.post('/api/log/add',TokenCtrl.tokenControl, LogController.addlog,BaseController.EndSession);
    app.get('/api/log/list', TokenCtrl.tokenControl, LogController.list,BaseController.EndSession);
    app.post('/api/log/update/:log_id', TokenCtrl.tokenControl, LogController.updateLog,BaseController.EndSession);
    app.delete('/api/log/delete/:log_id',TokenCtrl.tokenControl, LogController.deleteLog,BaseController.EndSession);
    app.post('/api/log/paglist',TokenCtrl.tokenControl , LogController.pagList,BaseController.EndSession);
    app.get('/api/log/sayi',TokenCtrl.tokenControl, LogController.sayi,BaseController.EndSession);

    app.get('/api/apps', TokenCtrl.tokenControl, AppController.index,BaseController.EndSession);
    app.post('/api/apps/add',TokenCtrl.tokenControl, AppController.addApps,BaseController.EndSession);
    app.post('/api/apps/update/:app_id', TokenCtrl.tokenControl, AppController.updateApps,BaseController.EndSession);
    app.delete('/api/apps/delete/:app_id', TokenCtrl.tokenControl, AppController.deleteApps,BaseController.EndSession);

    app.post('/api/es/createIndex',  ESController.createIndex);
    app.post('/api/es/addDocument', ESController.addDocument);
    app.post('/api/es/search', TokenCtrl.tokenControl,ESController.search);
    app.get('/api/es/mapping', ESController.mapp);
    app.post('/api/es/update/:id', ESController.update);

    app.get('/api/admin/requests',AdminController.get_userRequests,BaseController.EndSession);
    app.post('/api/admin/requests/add',AdminController.add_request,BaseController.EndSession);
    app.delete('/api/admin/requests/negativeReq',AdminController.negative_answer,BaseController.EndSession);
    app.post('/api/admin/requests/positiveReq',AdminController.positive_answer,BaseController.EndSession);


    var errorHandler = function(err, req, res, next) {
        db.closeConnection();
        res.json({
            data: null,
            error: err
        });
    };
    app.use(errorHandler);
};