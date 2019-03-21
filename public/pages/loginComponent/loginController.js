app.controller('loginController', function($scope, $http,$cookies,$window,$location,SERVICE_URL) {
	$scope.showBtn=function(){
		console.log("cookie:" , $cookies.get('auth')); 
		if(typeof($cookies.get('auth'))=='string'){
			$scope.show= true;
		}
		else{
			$scope.show= false;
		}
		console.log($scope.show)
	}
	$scope.signin=function(){
		 var data={//if true
			username:$scope.input_username,
			password:$scope.input_password
		}
		$http.post("http://localhost:3000/login", JSON.stringify(data))
		.then(function(resp){
			//if cookie is already exist ??
			//cookie is not exist define a cookie
			$window.location.reload();

			if(resp.data.is_user==true){
				$location.path("/");
			}	

		});

	}
	$scope.signout=function(){//if false
		$http.get("http://localhost:3000/logout")
		.then(function(resp){
			if(resp.data.message=='OK'){
				$window.location.reload();
			}
		});
	}
	$scope.showBtn();


});