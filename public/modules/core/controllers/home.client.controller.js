'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', 'Pros','Gears',
	function($scope, Authentication, Pros, Gears) {
		// This provides Authentication context.
        $scope.authentication = Authentication;

        $scope.find = function () {         
            $scope.topGears = Gears.getTop();
            $scope.recentGears = Gears.getRecent();
            
            $scope.topPros = Pros.getTop();
            $scope.recentPros = Pros.getRecent();
        };
	}
]);