'use strict';

//LinkGearRequests service used to communicate LinkGearRequests REST endpoints
angular.module('linkGearRequests').factory('LinkGearRequests', ['$resource',
	function($resource) {
		return $resource('linkGearRequests/:linkGearRequestId', { linkGearRequestId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);