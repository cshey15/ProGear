'use strict';

// LinkGearRequests controller
angular.module('linkGearRequests').controller('LinkGearRequestsController', ['$scope', '$stateParams', '$location', 'Authentication', 'LinkGearRequests',
    function ($scope, $stateParams, $location, Authentication, LinkGearRequests) {
        $scope.authentication = Authentication;
        
        // Create new LinkGearRequest
        $scope.create = function () {
            // Create new LinkGearRequest object
            var linkGearRequest = new LinkGearRequests.resource({
                name: this.name
            });
            
            // Redirect after save
            linkGearRequest.$save(function (response) {
                $location.path('linkGearRequests/' + response._id);
                
                // Clear form fields
                $scope.name = '';
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Remove existing LinkGearRequest
        $scope.remove = function (linkGearRequest) {
            if (confirm('Are you sure you want to delete?')) {
                if (linkGearRequest) {
                    linkGearRequest.$remove();

                    for (var i in $scope.linkGearRequests) {
                        if ($scope.linkGearRequests[i] === linkGearRequest) {
                            $scope.linkGearRequests.splice(i, 1);
                        }
                    }
                } else {
                    $scope.linkGearRequest.$remove(function() {
                        $location.path('linkGearRequests');
                    });
                }
            }
        };
        
        // Update existing LinkGearRequest
        $scope.update = function () {
            var linkGearRequest = $scope.linkGearRequest;
            
            linkGearRequest.$update(function () {
                $location.path('linkGearRequests/' + linkGearRequest._id);
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        };
        
        // Find a list of LinkGearRequests
        $scope.find = function () {
            $scope.linkGearRequests = LinkGearRequests.resource.query();
        };
        
        // Find existing LinkGearRequest
        $scope.findOne = function () {
            $scope.linkGearRequest = LinkGearRequests.resource.get({
                linkGearRequestId: $stateParams.linkGearRequestId
            });
        };
        
        $scope.setStatus = function (linkGearRequest, status) {
            if (linkGearRequest.status !== status) {
                linkGearRequest.status = status;
                
                linkGearRequest.$update(function (response) {
                    //$location.path('pros/' + response.pro._id);
                    $scope.message = status + ' successful!';
                }, function (errorResponse) {
                    $scope.error = errorResponse.data.message;
                }); 
            }
        };
    }
]);