app.controller('LogController', function($scope, $http, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {
    
    $scope.logs = [];
    $scope.filters = [];

    if ($location.path() == '/log') {
        $scope.dtOptions = { responsive: true, scrollX: "auto" };

        $http.get(SERVICE_URL + '/log')
        .then(
            function(response) 
            {
                if (response.data.error)
                    console.log(response.data.error);
                    $scope.logs = response.data.data;
                    //console.log("logs", $scope.logs);
            },
            function(response) {
                console.log(response);
            }
        );
    }
    
    $scope.yolla = function(){
        
        var data = {
            value : $scope.elastic
        };
        //$scope.tmp = angular.fromJson(evt.data.hits);
        console.log($scope.elastic);
        $http.post("http://localhost:3000/api/es/search", JSON.stringify(data))
        .then(function(resp){
            console.log("ES sonuc: ", resp.data.hits);
            $scope.logs=[];
            
            for (var i = 0; i < resp.data.hits.length; i++) {
               var a = resp.data.hits[i]._source;
               $scope.logs.push(a);
            } 

        },function(err){
            console.log("ES err: ", err);
        });
    }

});