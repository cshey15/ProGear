'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
        $urlRouterProvider.otherwise('/pros');
        
        $stateProvider.
        state('uploadGears', {
        	url: '/admin/bulkupload',
        	templateUrl: 'modules/core/views/bulkUpload.client.view.html'
        });

		// Home state routing
		//$stateProvider.
		//state('home', {
		//	url: '/',
		//	templateUrl: 'modules/core/views/home.client.view.html'
		//});
	}
]);