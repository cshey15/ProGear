'use strict';

//Gears service used to communicate Gears REST endpoints
angular.module('gears').factory('Gears', ['$resource',
	function($resource) {
		return $resource('gears/:gearId', { gearId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);