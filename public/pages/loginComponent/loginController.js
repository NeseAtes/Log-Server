app.controller('loginController', function($scope, $http,$window,$location, SERVICE_URL) {
	$scope.signin=function(){
		 var data={
			username:$scope.input_username,
			password:$scope.input_password
		}
		$http.post("http://localhost:3000/login", JSON.stringify(data))
		.then(function(resp){
			//if cookie is already exist ??
			//cookie is not exist define a cookie 
			console.log(resp)
			if(resp.data.is_user==true){
				$location.path("/");
			}else{
				$window.location.reload();
			}
		});
	}
});