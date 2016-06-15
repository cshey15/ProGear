'use strict';

//Setting up route
angular.module('linkGearRequests').config(['$stateProvider',
	function($stateProvider) {
		// LinkGearRequests state routing
		$stateProvider.
		state('listlinkgearrequests', {
			url: '/linkgearrequests',
            templateUrl: 'modules/linkgearrequests/views/list-linkgearrequests.client.view.html'
		}).
		state('createLinkGearRequest', {
			url: '/linkgearrequests/create/:proId',
			templateUrl: 'modules/linkgearrequests/views/create-linkgearrequests.client.view.html'
		}).
		state('viewLinkGearRequest', {
			url: '/linkgearrequests/:linkGearRequestId',
			templateUrl: 'modules/linkgearrequests/views/view-linkgearrequests.client.view.html'
		}).
		state('editLinkGearRequest', {
			url: '/linkgearrequests/:linkGearRequestId/edit',
			templateUrl: 'modules/linkgearrequests/views/edit-linkgearrequests.client.view.html'
		});
	}
]);