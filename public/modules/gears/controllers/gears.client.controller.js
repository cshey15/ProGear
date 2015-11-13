'use strict';

// Gears controller
var app = angular.module('gears');
app.controller('GearsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gears', '$modal',
	function($scope, $stateParams, $location, Authentication, Gears, $modal) {
		$scope.authentication = Authentication;
	    $scope.gearTypes = [
		{ id: 1, name: 'Keyboard' },
		{ id: 2, name: 'Mouse'}
	    ];
	    $scope.selectedGearType = null;
		// Create new Gear
		$scope.create = function() {
			// Create new Gear object
			var gear = new Gears ({
			    name: this.name,
			    type: $scope.selectedGearType.name
			});

			// Redirect after save
			gear.$save(function(response) {
				$location.path('gears/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Gear
        $scope.remove = function (gear) {
            if (confirm("Are you sure you want to delete?")) {
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
                    });
                }
            }
		};

		// Update existing Gear
		$scope.update = function() {
			var gear = $scope.gear;

			gear.$update(function() {
				$location.path('gears/' + gear._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Gears
		$scope.find = function() {
			$scope.gears = Gears.query();
		};

		// Find existing Gear
		$scope.findOne = function() {
			$scope.gear = Gears.get({ 
				gearId: $stateParams.gearId
			});
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
        }
	}
]);

app.controller('GearsController.modal', ['$scope','Gears','$modalInstance', function ($scope, Gears, $modalInstance) {
        $scope.selected = {
            gear: null
        };
        $scope.gears = Gears.query();
        $scope.ok = function () {
            $modalInstance.close($scope.selected.gear);
        };
        
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.modalSubmit = function (data) {
            //event.preventDefault();
            var gear = new Gears({
                name: data.name,
                type: data.selectedGearType.name
            });
            
            // close modal after save
            gear.$save(function (response) {
                $modalInstance.close(gear)
            }, function (errorResponse) {
                $scope.error = errorResponse.data.message;
            });
        }
    }]);