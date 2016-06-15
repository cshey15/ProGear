'use strict';
///<reference path="../../core/services/menus.client.service.js" />

// Pros controller
var app = angular.module('pros');
app.controller('ProsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Pros', 'Gears', '$modal', 'LinkGearRequests', 'Menus', 'Upload', 'Notification',
    function ($scope, $stateParams, $location, Authentication, Pros, Gears, $modal, LinkGearRequests, Menus, Upload, Notification) {
        $scope.authentication = Authentication;
        $scope.currentPage = 1;
        $scope.pageSize = 12;
        $scope.offset = 0;
        $scope.gearTypes = [ //TODO: extract this somehow it is in multiple places. 
            'Keyboard', 'Mouse'
        ];
        
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
            if (!$scope.file) {
                $scope.error = 'Please enter a photo';
            }
            else {
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
                    $scope.upload($scope.file, response._id).then(function (resp) {
                        $location.path('pros/' + response._id);
                        Notification.success('Thanks! Your submission was successful.');
                    }, function (resp) {
                        $scope.error = resp.status;
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                });
            }
        };
        
        $scope.upload = function (file, proid) {
            return Upload.upload({
                url: '/api/pro/' + proid + '/upload',
                method: 'POST',
                data: { 'type': 'pro', 'id': proid },
                file: file
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
                if ($scope.file) {
                    $scope.upload($scope.file, pro._id).then(function (resp) {
                        $location.path('pros/' + pro._id);
                        Notification.success('Update Successful!');
                    }, function (resp) {
                        $scope.error = resp.status;
                        console.log('Error status: ' + resp.status);
                    }, function (evt) {
                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    });
                } else {
                    $location.path('pros/' + pro._id);
                }
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
            }, function () {
                if ($scope.pro.published) {
                    $scope.gearList = Pros.getGearsForPro($stateParams.proId);
                } else {
                    $scope.gearList = Pros.getAllGearsForPro($stateParams.proId);
                }
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
        
        $scope.clearSelectedGear = function () {
            $scope.selectedGear = null;
            $scope.search = null;
        }
        
        $scope.createRequest = function () {
            // Create new request object
            var request = new LinkGearRequests.resource({
                pro: $scope.pro._id,
                gear: $scope.selectedGear._id,
                proofLink: this.proofLink,
                explanation: this.explanation
            });
            
            request.$save(function (response) {
                $scope.pro.requestList.push(response);
                $location.path('pros/' + $scope.pro._id);
                Notification.success('Thanks! Your submission has been added!');
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        var cleanURL = function (url) {
            var parser = document.createElement('a');
            try {
                parser.href = url;
                return parser.href;
            } catch (e) {
                return false;
            }
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
                $scope.gears.push(gear)
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
        
        $scope.removeGear = function (gear) {
            for (var i in $scope.pro.gearList) {
                if ($scope.pro.gearList [i] === gear) {
                    $scope.pro.gearList.splice(i, 1);
                }
            }
        };

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
