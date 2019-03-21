app.controller('LogController', function($scope, $http, $interval, SERVICE_URL, DTOptionsBuilder, DTColumnDefBuilder, $location) {
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
        $scope.users=[];
            console.log($scope.logs); 
            if ($scope.elastic == "") {
                $scope.getAllLogs()
            }
            else{
                for (var i = 0; i < resp.data.hits.length; i++) {
               var a = resp.data.hits[i]._source;
               console.log(resp.data.hits[i]._source);
               $scope.logs.push(a);
               $scope.users.push(a);
            }
            }           
            $scope.logs=[];
            $scope.users=[];

            for (var i = 0; i < resp.data.hits.length; i++) {
               var a = resp.data.hits[i]._source;
               $scope.logs.push(a);
               $scope.users.push(a);
            } 
        },function(err){
            console.log("ES err: ", err);
        });
    }

    
    /*var i = 1;
    $scope.ellipsisText = "But wait, there's more";

    $scope.paragraphText = "Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. But, in a larger sense, we can not dedicate, we can not consecrate, we can not hallow, this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced.";

    $interval(function() {
        $scope.incrementing = "But wait, there's more x" + i;
        i++;
    }, 1000);

    $scope.showFullText = function() {
        alert('On click function');
    };*/


});