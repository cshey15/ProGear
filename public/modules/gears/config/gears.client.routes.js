'use strict';

//Setting up route
angular.module('gears').config(['$stateProvider',
	function($stateProvider) {
		// Gears state routing
		$stateProvider.
		state('listGears', {
			url: '/gears?unpublishedonly',
			templateUrl: 'modules/gears/views/list-gears.client.view.html'
		}).
		state('createGear', {
			url: '/gears/create',
			templateUrl: 'modules/gears/views/create-gear.client.view.html'
		}).
		state('viewGear', {
			url: '/gears/:gearId',
			templateUrl: 'modules/gears/views/view-gear.client.view.html'
		}).
		state('editGear', {
			url: '/gears/:gearId/edit',
			templateUrl: 'modules/gears/views/edit-gear.client.view.html'
		});
	}
]);