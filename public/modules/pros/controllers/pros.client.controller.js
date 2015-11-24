'use strict';
///<reference path="../../core/services/menus.client.service.js" />

// Pros controller
var app = angular.module('pros');
app.controller('ProsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pros', 'Gears', '$modal', 'LinkGearRequests', 'Menus',
    function ($scope, $stateParams, $location, Authentication, Pros, Gears, $modal, LinkGearRequests, Menus) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.offset = 0;
        
        // Page changed handler
        $scope.pageChanged = function () {
            $scope.offset = ($scope.currentPage - 1) * $scope.pageSize;
        };
        
        $scope.selectedSportFilter = undefined;
        
        $scope.setSelectedSportFilter = function (value) {
            if ($scope.selectedSportFilter === value) {
                $scope.selectedSportFilter = undefined;
            } else {
                $scope.selectedSportFilter = value;
            }
        };
        
        $scope.sportFilter = function (item) {
            return $scope.selectedSportFilter === undefined || item.sport === $scope.selectedSportFilter;
        };
        
        $scope.selectedTeamFilter = undefined;
        
        $scope.setSelectedTeamFilter = function (value) {
            if ($scope.selectedTeamFilter === value) {
                $scope.selectedTeamFilter = undefined;
            } else {
                $scope.selectedTeamFilter = value;
            }
        };
        
        $scope.teamFilter = function (item) {
            return $scope.selectedTeamFilter === undefined || item.team === $scope.selectedTeamFilter;
        };

        // Create new Pro
        $scope.create = function () {
            // Create new Pro object
            var pro = new Pros.resource({
                name: this.name,
                sport: this.sport,
                team: this.team,
                alias: this.alias,
                fbProfile: this.fbProfile,
                website: this.website
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
            if (confirm('Are you sure you want to delete?')) {
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
            if ($stateParams.unpublishedonly && $stateParams.unpublishedonly === 'true') {
                $scope.pros = Pros.admin.query();
            } else {
                $scope.pros = Pros.resource.query();
            }
        };
        
        // Find existing Pro
        $scope.findOne = function () {
            $scope.pro = Pros.resource.get({
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
                var contains = false;
                for (var i in $scope.pro.gearList) {
                    if ($scope.pro.gearList [i]._id === selectedItem._id) {
                        contains = true;
                    }
                }
                if (!contains) {
                    $scope.pro.gearList.push(selectedItem);
                }
            }, function () {
                
            });
        };

        $scope.addGear = function () {
            $scope.pro = Pros.resource.get({
                proId: $stateParams.proId
            });
            $scope.type = $stateParams.type;
            $scope.gears = Gears.resource.query();
        };
        
        $scope.gearSelect = function (item) {
            $scope.selectedGear = item;
        };
        
        $scope.createRequest = function () {
            // Create new request object
            var request = new LinkGearRequests({
                pro: $scope.pro._id,
                gear: $scope.selectedGear._id,
                proofLink: this.proofLink,
                explanation: this.explanation
            });
            
            request.$save(function (response) {
                $scope.pro.requestList.push(response);

                // Redirect after save
                $scope.pro.$update(function (response) {
                    $location.path('pros/' + response._id);
                    
                    $scope.search = '';
                    // Clear form fields
                    $scope.proofLink = '';
                    $scope.explanation = '';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
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
        };

        $scope.openCreateGear = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'modules/gears/views/modalCreate-gear.client.view.html',
                controller: 'GearsController.modal',
                size: 'sm'
            });
            modalInstance.result.then(function (gear) {
                $scope.selectedGear = gear;
            }, function () {
                
            });
        };

        $scope.removeGear = function (gear) {
            for (var i in $scope.pro.gearList) {
                if ($scope.pro.gearList [i] === gear) {
                    $scope.pro.gearList.splice(i, 1);
                }
            }
        };
    }]);

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
                $modalInstance.close();
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }]);
