'use strict';

//LinkGearRequests service used to communicate LinkGearRequests REST endpoints
angular.module('issues').factory('Issues', ['$resource',
	function($resource) {
		return $resource('issues/:issueId', { issueId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);