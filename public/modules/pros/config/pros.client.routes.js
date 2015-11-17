'use strict';

//Setting up route
angular.module('pros').config(['$stateProvider',
    function ($stateProvider) {
        // Pros state routing
        $stateProvider.
		state('listPros', {
            url: '/pros',
            templateUrl: 'modules/pros/views/pros.client.view.html'
        }).
		state('createPro', {
            url: '/pros/create',
            templateUrl: 'modules/pros/views/create-pro.client.view.html'
        }).
		state('viewPro', {
            url: '/pros/:proId',
            templateUrl: 'modules/pros/views/view-pro.client.view.html'
        }).
        state('addGear', {
            url: '/pros/:proId/addGear?type',
            templateUrl: 'modules/pros/views/addGear-pro.client.view.html'
        }).
		state('editPro', {
            url: '/pros/:proId/edit',
            templateUrl: 'modules/pros/views/edit-pro.client.view.html'
        });
    }
]);