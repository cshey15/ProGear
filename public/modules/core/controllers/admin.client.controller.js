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
                website: data[6],
                profilePictureUrl: data[7],
                published: data[8]
            });

            pro.$save(function (response) {
                $scope.responseList[i] = response._id;
            }, function (errorResponse) {
                $scope.responseList[i] = errorResponse.data.message;
            });
        }
        
        
        $scope.bulkUploadGears = function (data) {
            parse(data, GearsParser, "Gears");
        }

        var GearsParser = function (data, i) {
            var gear = new Gears.createResource({
                _id: data[0],
                name: data[1],
                type: data[2],
                amazonLink: data[3],
                website: data[4],
                published: data[5]
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
        
        var requestParser = function (data, i) {
            var request = new LinkGearRequests.createResource({
                _id:data[0],
                pro: data[1],
                gear: data[2],
                proofLink: data[3],
                explanation: data[4],
                status: data[5]
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
                var line = lines[i].split('\t');
                //replace empty values with undefined so that the server doesn't get confused.
                for (var x = 0; x < line.length; x++) {
                    if (line[x] === "") {
                        line[x] = undefined;
                    }
                }
                response[i] = new parser(line, i);
            }
        }
    }
]);