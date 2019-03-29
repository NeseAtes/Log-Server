app.controller('adminController', function($scope, $http,$window, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {

    if ($location.path() == '/requests') {
        $scope.dtOptions = { responsive: true, scrollX: "auto" };

        $http.get(SERVICE_URL + '/admin/requests')
        .then(
            function(response) {
                if (response.data.error)
                    console.log(response.data.error);
                $scope.reqs = response.data.data;
            },
            function(response) {
                console.log(response);
            }
            );
    }
    $scope.success = function(reqid) {
        $http.post(SERVICE_URL+'/admin/requests/positiveReq?id='+reqid)
        .then(
            function(response){
                $window.location.reload();
            }
        );
    };
    $scope.negative=function(reqid){
        $http.delete(SERVICE_URL+'/admin/requests/negativeReq?id='+reqid)
        .then(
            function(response){
                $window.location.reload();
            }
        );
    }


});