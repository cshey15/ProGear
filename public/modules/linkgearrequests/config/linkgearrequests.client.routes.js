'use strict';

//Setting up route
angular.module('linkGearRequests').config(['$stateProvider',
	function($stateProvider) {
		// LinkGearRequests state routing
		$stateProvider.
		state('listLinkGearRequests', {
			url: '/linkGearRequests',
			templateUrl: 'modules/linkGearRequests/views/list-linkGearRequests.client.view.html'
		}).
		state('createLinkGearRequest', {
			url: '/linkGearRequests/create/:proId',
			templateUrl: 'modules/linkGearRequests/views/create-linkGearRequest.client.view.html'
		}).
		state('viewLinkGearRequest', {
			url: '/linkGearRequests/:linkGearRequestId',
			templateUrl: 'modules/linkGearRequests/views/view-linkGearRequest.client.view.html'
		}).
		state('editLinkGearRequest', {
			url: '/linkGearRequests/:linkGearRequestId/edit',
			templateUrl: 'modules/linkGearRequests/views/edit-linkGearRequest.client.view.html'
		});
	}
]);