var app = angular.module('myApp',['ngRoute','ngStorage', 'ngCookies',
  'datatables', 'ngFileUpload' ,'ui.bootstrap','dibari.angular-ellipsis','chart.js' ]);
angular.forEach(config,function(key,value) {
  app.constant(value,key);
});
app.config(function($routeProvider,$locationProvider){
  $locationProvider.hashPrefix('');
  $routeProvider.when('/',{
    templateUrl:'./pages/dashboardComponent/dashboard.html',
    controller:'dashboardController'
  }).when('/log', {
    templateUrl: './pages/logComponent/log.html',
    controller: 'LogController'
  }).when('/app', {
    templateUrl: './pages/appComponent/app.html',
    controller: 'AppController'
  }).when('/broadcast', {
  	templateUrl: './pages/socketComponent/webSocket.html',
  	controller: 'webSocketController'
  }).when('/login',{
    templateUrl:'./pages/loginComponent/login.html',
    controller:'loginController'
  }).when('/requests',{
    templateUrl:'./pages/adminComponent/admin_requests.html',
    controller:'adminController'
  });
});

app.controller('mainController',function($scope,$localStorage){
  $scope.isAdmin=function(){
    $scope.is_admin=$localStorage.is_admin;
    return $scope.is_admin;
  }
});