'use strict';

// Issues controller
angular.module('issues').controller('IssuesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Issues',
    function ($scope, $stateParams, $location, Authentication, Issues) {
        $scope.authentication = Authentication;
        
        // Create new Issue
        $scope.create = function () {
            // Create new Issue object
            var issue = new Issues({
                name: this.name,
                email: this.email,
                comment: this.comment
            });
            
            // Redirect after save
            issue.$save(function (response) {
                $location.path('issues/' + response._id);
                
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing Issue
        $scope.remove = function (issue) {
            if (issue) {
                issue.$remove();
                
                for (var i in $scope.issues) {
                    if ($scope.issues [i] === issue) {
                        $scope.issues.splice(i, 1);
                    }
                }
            } else {
                $scope.issue.$remove(function () {
                    $location.path('issues');
                });
            }
        };
        
        // Update existing Issue
        $scope.update = function () {
            var issue = $scope.issue;
            
            issue.$update(function () {
                $location.path('issues/' + issue._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of Issues
        $scope.find = function () {
            $scope.issues = Issues.query();
        };
        
        // Find existing Issue
        $scope.findOne = function () {
            $scope.issue = Issues.get({
                issueId: $stateParams.issueId
            });
        };
        
        $scope.setStatus = function (issue, status) {
            if (issue.status !== status) {
                issue.status = status;
                
                issue.$update(function (response) {
                    //$location.path('pros/' + response.pro._id);
                    $scope.message = status + ' successful!';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }); 
            }
        };
    }
]);

app.controller('IssuesController.modal', ['$scope', 'Issues', '$modalInstance', '$stateParams', function ($scope, Issues, $modalInstance, $stateParams) {
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
        
        $scope.modalSubmit = function (data) {
            var issue = new Issues({
                name: data.name,
                email: data.email,
                comment: data.comment,
                gear: $stateParams.gearId,
                pro: $stateParams.proId
            });
            
            // Redirect after save
            issue.$save(function (response) {
                $modalInstance.close(true);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
    }]);