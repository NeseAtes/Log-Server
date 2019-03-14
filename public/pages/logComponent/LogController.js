app.controller('LogController', function($scope, $http, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {
    $scope.logs = [];
    $scope.users =[];

    $scope.viewby = 10;
    $scope.currentPage = 4;

    $scope.itemsPerPage = $scope.viewby;
    $scope.maxSize = 5;


    $scope.pageChanged = function() {
    console.log('Page changed to: ' + $scope.currentPage);
    };

    $scope.getAllLogs=function(){ 
        if ($location.path() == '/log') {
        //$scope.dtOptions = { responsive: true, scrollX: "hide",scrollY: "auto", searching: false};

        $http.get(SERVICE_URL + '/log')
        .then(
            function(response) 
            {
                if (response.data.error)
                    console.log(response.data.error);
                    $scope.logs = response.data.data;
                    $scope.users = response.data.data;
                    //console.log("logs", $scope.logs);
    console.log($scope.users)
    $scope.totalItems = $scope.users.length;
    console.log($scope.users.length);
            },
            function(response) {
                console.log(response);
            }
        );
        }
    }

    $scope.getAllLogs()

    


    $scope.yolla = function(){
        
        var data = {
            value : $scope.elastic
        };
        console.log($scope.elastic);
        $http.post("http://localhost:3000/api/es/search", JSON.stringify(data))
        .then(function(resp){
            console.log("ES sonuc: ", resp.data.hits);
        $scope.logs=[];
            console.log($scope.logs); 
            if ($scope.elastic == "") {
                $scope.getAllLogs()
            }
            else{
                for (var i = 0; i < resp.data.hits.length; i++) {
               var a = resp.data.hits[i]._source;
               console.log(resp.data.hits[i]._source);
               $scope.logs.push(a);
            }
            }           
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