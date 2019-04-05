app.controller('dashboardController', function($scope, $http) {
	$scope.labels=[];
	$scope.series=[];
	$scope.options={legend:{display: true}};
	$scope.data=[];
	$http.get('http://localhost:3000/api/chart').then(function(resp){
		var chartdata;
		var maxsLogLevel=0;

		for (var i = 0; i < resp.data.chartdata.length; i++) {
			chartdata=resp.data.chartdata[i];
			$scope.labels.push(chartdata.app_name);
			$scope.series.push(chartdata.log_level);

			$scope.labels=$scope.labels.filter(distinct);
			$scope.series=$scope.series.filter(distinct);

			if(chartdata.log_level>maxsLogLevel){
				if(chartdata.log_level-maxsLogLevel!=0){
					for (var i = 0; i < (chartdata.log_level-maxsLogLevel); i++) {
						$scope.data.push([]);
					}					
				maxsLogLevel=chartdata.log_level;
				}
			}
			const index = $scope.labels.findIndex(item => item === chartdata.app_name);
			const loglevel_index=$scope.series.findIndex(item => item === chartdata.log_level);
			var length=$scope.data[loglevel_index].length;
			if(length<=index){
				for (var i = length; i < index; i++) {
					$scope.data[loglevel_index].push(0);
				}
				$scope.data[loglevel_index].splice(index, 0,chartdata.count);
			}else{
				$scope.data[loglevel_index].splice(index, 0,chartdata.count);
			}
			

		}
	});
	
	const distinct=(value,index,self)=>{
		return self.indexOf(value)===index;
	}
});
