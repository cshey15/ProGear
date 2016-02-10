'use strict';

//Pros service used to communicate Pros REST endpoints
angular.module('pros').factory('Pros', ['$resource',
    function ($resource) {
        return {
            createResource: $resource('pros/'),
            resource: $resource('pros/:proId', {
                proId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            admin: $resource('admin/pros/unpublished/:proId', {
                proId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            getGearsForPro: function (id) {
                return $resource('pros/:proId/gears', {
                    proId: id
                }).query();
            },
            getAllGearsForPro: function (id) {
                return $resource('pros/:proId/gears/all', {
                    proId: id
                }).query();
            },
            getTop: function (id) {
                return $resource('pros/top', {
                    gearId: id
                }).query();
            },
            getRecent: function (id) {
                return $resource('pros/recent', {
                    gearId: id
                }).query();
            }
        };
    }
]);