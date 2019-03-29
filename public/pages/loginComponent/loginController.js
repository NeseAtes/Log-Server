app.controller('loginController', function($scope, $http,$cookies,$window,$location,$localStorage,SERVICE_URL) {
	$scope.showBtn=function(){
		console.log("cookie:" , $cookies.get('auth')); 
		if(typeof($cookies.get('auth'))=='string'){
			$scope.show= true;
		}
		else{
			$scope.show= false;
		}
	}
	$scope.alert="";
	$scope.register=function(){
		if($scope.username==undefined||$scope.password==undefined||$scope.password2==undefined){
			$scope.alert="All fields must be filled";
		}
		else if($scope.password!=$scope.password2){
			$scope.alert="password fields must be same";
		}
		else{
			var data={
			username:$scope.username,
			password:$scope.password,
			role:"normal"
			};
			$http.post("http://localhost:3000/api/admin/requests/add",JSON.stringify(data))
			.then(function(resp){
				if(resp.data.data){
				 	$scope.alert="request saved";
				 	$window.location.reload();
				 }
				else
				 	$scope.alert="Opps.. There is a problem"
			});
		}

	}
	
	$scope.signin=function(){
		 var data={
			username:$scope.username,
			password:$scope.password
		}
		$http.post("http://localhost:3000/login", data)
		.then(function(resp){
			$window.location.reload();

			if(resp.data.is_user){
				$location.path("/");
			}	
			if(resp.data.is_admin){
				$localStorage.is_admin=true;
			}
			//if user is an admin show registers page
		});
	}
	$scope.signout=function(){
		$http.get("http://localhost:3000/logout")
		.then(function(resp){
			if(resp.data.message=='OK'){
				$window.location.reload();
				$localStorage.$reset();
			}
		});
	}
	$scope.showBtn();
});