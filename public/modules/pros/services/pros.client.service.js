'use strict';

//Pros service used to communicate Pros REST endpoints
angular.module('pros').factory('Pros', ['$resource',
    function ($resource) {
        return {
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