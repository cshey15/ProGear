'use strict';

// Gears controller
angular.module('gears').controller('GearsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Gears',
	function($scope, $stateParams, $location, Authentication, Gears) {
		$scope.authentication = Authentication;

		// Create new Gear
		$scope.create = function() {
			// Create new Gear object
			var gear = new Gears ({
				name: this.name
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
		$scope.remove = function(gear) {
			if ( gear ) { 
				gear.$remove();

				for (var i in $scope.gears) {
					if ($scope.gears [i] === gear) {
						$scope.gears.splice(i, 1);
					}
				}
			} else {
				$scope.gear.$remove(function() {
					$location.path('gears');
				});
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
	}
]);