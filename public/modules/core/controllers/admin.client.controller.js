'use strict';

angular.module('core').controller('AdminController', ['$scope', 'Authentication', 'Pros', 'Gears', 'LinkGearRequests',
    function ($scope, Authentication, Pros, Gears, LinkGearRequests) {
        $scope.authentication = Authentication;
        $scope.responseList = [];
        $scope.bulkUploadPros = function (data) {
            parse(data, ProsParser, "Pros");

        }
        
        var ProsParser = function (data, i) {
            var pro = new Pros.createResource({
                _id: data[0],
                name: data[1],
                sport: data[2],
                team: data[3],
                alias: data[4],
                fbProfile: data[5],
                website: data[6]
            });

            pro.$save(function (response) {
                $scope.responseList[i] = response._id;
            }, function (errorResponse) {
                $scope.responseList[i] = errorResponse.data.message;
            });
        }
        
        
        $scope.bulkUploadGears = function (data) {
            console.log("Starting bulk upload Gears-");
            
            var lines = data.split("\n");
            for (var i = 0; i < lines.length; i++) {
                console.log('line: ' + lines[i]);
            }
        }

        var GearsParser = function (data, i) {
            var gear = new Gears.resource({
                name: data[0],
                type: data[1],
                amazonLink: data[2],
                website: data[3]
            });
            
            gear.$save(function (response) {
                $scope.responseList[i] = response._id;
            }, function (errorResponse) {
                $scope.responseList[i] = errorResponse.data.message;
            });
        }

        $scope.bulkUploadRequests = function (data) {
            parse(data, requestParser, 'Requests');
        }
        
        var requestParser = function (line) {
            var request = new LinkGearRequests({
                pro: data[0],
                gear: data[1],
                proofLink: data[2],
                explanation: data[3]
            });
            
            request.$save(function (response) {
                $scope.responseList[i] = response._id;
            }, function (errorResponse) {
                $scope.responseList[i] = errorResponse.data.message;
            });
        }
        
        function parse(data, parser, name) {
            console.log("Starting bulk upload for: " + name);
            $scope.responseList = [];
            var lines = data.split("\n");
            var length = lines.length;
            console.log("found " + length + " lines");
            var response = [];
            for (var i = 0; i < length; i++) {
                console.log("parsed " + (i+1) + "/" + length + " lines");
                var line = lines[i].split(',');
                //replace empty values with undefined so that the server doesn't get confused.
                for (var x = 0; x < line.length; x++) {
                    if (line[x] === "") {
                        line[x] = undefined;
                    }
                }
                response[i] = parser(line, i);
            }
        }
    }
]);