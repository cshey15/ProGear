'use strict';

// Pros controller
var app = angular.module('pros');
app.controller('ProsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pros', 'Gears', '$modal',
    function ($scope, $stateParams, $location, Authentication, Pros, Gears, $modal) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.offset = 0;
        
        // Page changed handler
        $scope.pageChanged = function () {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
        };

        // Create new Pro
        $scope.create = function () {
            // Create new Pro object
            var pro = new Pros({
                name: this.name,
                team: this.team
            });
            // Redirect after save
            pro.$save(function (response) {
                $location.path('pros/' + response._id);
                
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing Pro
        $scope.remove = function (pro) {
            if (pro) {
                pro.$remove();
                
                for (var i in $scope.pros) {
                    if ($scope.pros [i] === pro) {
                        $scope.pros.splice(i, 1);
                    }
                }
            } else {
                $scope.pro.$remove(function () {
                    $location.path('pros');
                });
            }
        };
        
        // Update existing Pro
        $scope.update = function () {
            var pro = $scope.pro;
            
            pro.$update(function () {
                $location.path('pros/' + pro._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of Pros
        $scope.find = function () {
            $scope.pros = Pros.query();
        };
        
        // Find existing Pro
        $scope.findOne = function () {
            $scope.pro = Pros.get({
                proId: $stateParams.proId
            });
        };

        // Search for a pro
        $scope.proSearch = function (product) {
            $location.path('pros/' + product._id);
        };

        $scope.open = function (size) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalList-gear.client.view.html',
                controller: 'GearsController.modal',
                size: size
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
                $scope.pro.gearList.push(selectedItem);
            }, function () {
                
            });
        };

        $scope.openCreate = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/pros/views/modalCreate-pro.client.view.html',
                controller: 'ProsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function () {
                $scope.find();
            }, function () {
                
            });
        }

    }
]);

app.controller('ProsController.modal', ['$scope', 'Pros', '$modalInstance', function ($scope, Pros, $modalInstance) {        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.modalSubmit = function (data) {
            var pro = new Pros({
                name: data.name,
                team: data.team
            });
            
            // Redirect after save
            pro.$save(function (response) {
                $modalInstance.close()
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
    }]);