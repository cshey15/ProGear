'use strict';

// Gears controller
var app = angular.module('gears');
app.controller('GearsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gears', '$modal', '$sce', 'Notification',
    function ($scope, $stateParams, $location, Authentication, Gears, $modal, $sce, Notification) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.offset = 0;
        
        // Page changed handler
        $scope.pageChanged = function () {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
        };
        
        $scope.gearTypes = [ //TODO: extract this somehow it is in multiple places.
            'Keyboard', 'Mouse'
        ];
        $scope.selectedGearType = $stateParams.type;
        
        $scope.selectedTypeFilter = undefined;

        $scope.setFilterGearType = function (value) {
            if ($scope.selectedTypeFilter === value) {
                $scope.selectedTypeFilter = undefined;
            } else {
                $scope.selectedTypeFilter = value;
            }
        };
        
        $scope.byType = function (entry) {
            return $scope.selectedTypeFilter === undefined || entry.type === $scope.selectedTypeFilter;
        };

        // Create new Gear
        $scope.create = function () {
            // Create new Gear object
            var gear = new Gears.resource({
                name: this.name,
                type: $scope.selectedGearType,
                amazonLink: this.amazonLink,
                website: this.website
            });
            
            // Redirect after save
            gear.$save(function (response) {
                $location.path('gears/' + response._id);
                Notification.success('Gear added!');
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing Gear
        $scope.remove = function (gear) {
            if (confirm('Are you sure you want to delete?')) {
                if (gear) {
                    gear.$remove();
                    
                    for (var i in $scope.gears) {
                        if ($scope.gears [i] === gear) {
                            $scope.gears.splice(i, 1);
                        }
                    }
                } else {
                    $scope.gear.$remove(function () {
                        $location.path('gears');
                        Notification.success('Gear Removed');
                    });
                }
            }
        };
        
        // Update existing Gear
        $scope.update = function () {
            var gear = $scope.gear;
            
            gear.$update(function () {
                $location.path('gears/' + gear._id);
                Notification.success('Gear Updated!');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of Gears
        $scope.find = function () {
            if ($stateParams.unpublishedonly && $stateParams.unpublishedonly === 'true') {
                $scope.gears = Gears.admin.query();
            } else {
                $scope.gears = Gears.resource.query();
            }
        };
        
        // Find existing Gear
        $scope.findOne = function () {
            $scope.gear = Gears.resource.get({
                gearId: $stateParams.gearId
            });
            $scope.relatedPros = Gears.getProsForGear($stateParams.gearId);
            $scope.$watch('relatedPros', function () {
                console.log('hey, myVar has changed!');
            });
        };

        // go to gear
        $scope.gearSearch = function (product) {
            $location.path('gears/' + product._id);
        };

        $scope.openCreate = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalCreate-gear.client.view.html',
                controller: 'GearsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function (newGear) {
                $scope.find();
            }, function () {
                
            }); 
        };

        $scope.shouldRender = function (user) {
            if (user) {
                for (var userRoleIndex in user.roles) {
                    if ('admin' === user.roles[userRoleIndex]) {
                        return true;
                    }
                }
            }
            return false;
        };
        
        // Should refactor this with pro
        $scope.reportIssue = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/issues/views/modalCreate-issue.client.view.html',
                controller: 'IssuesController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function (issue) {
                // Thanks
                if (issue) {
                    Notification.success('Thanks! Your issue has been reported. We will will get right on it!');
                }
            }, function () {
            });
        };
}]);

app.controller('GearsController.modal', ['$scope','Gears','$modalInstance', '$stateParams', function ($scope, Gears, $modalInstance, $stateParams) {
        $scope.selected = {
            gear: null
        };
        $scope.data = {};
        $scope.data.selectedGearType = $stateParams.type;

        $scope.gears = Gears.resource.query();
        $scope.ok = function () {
            $modalInstance.close($scope.selected.gear);
        };
        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.modalSubmit = function (data) {
            //event.preventDefault();
            if (!data) {
                data = {};
            }
            var gear = new Gears.resource({
                name: data.name,
                type: data.selectedGearType,
                amazonLink: data.amazonLink,
                website: data.website
            });
            
            // close modal after save
            gear.$save(function (response) {
                $modalInstance.close(response);
            }, function (errorResponse) {
                $scope.modalerror = errorResponse.data.message;
            });
        };

        // Search for a pro
        $scope.gearSearch = function (product) {
            $scope.selected.gear = product;
        };
    }]);
