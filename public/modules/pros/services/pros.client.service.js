'use strict';

//Pros service used to communicate Pros REST endpoints
angular.module('pros').factory('Pros', ['$resource',
    function ($resource) {
        return $resource('pros/:proId', {
            proId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);