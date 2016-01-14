'use strict';

//Gears service used to communicate Gears REST endpoints
angular.module('gears').factory('Gears', ['$resource',
    function ($resource) {
        var resource = $resource('gears/:gearId', {
            gearId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
        return {
            resource: resource,
            admin: $resource('admin/gears/unpublished/:gearId', {
                gearId: '@_id'
            }, {
                update: {
                    method: 'PUT'
                }
            }),
            getProsForGear: function (id) {
                return $resource('gears/:gearId/pros', {
                    gearId: id
                }).query();
            },
            getTop: function (id) {
                return $resource('gears/top', {
                    gearId: id
                }).query();
            },
            getRecent: function (id) {
                return $resource('gears/recent', {
                    gearId: id
                }).query();
            }
        };
	}
]);