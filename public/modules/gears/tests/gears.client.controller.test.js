'use strict';

(function() {
	// Gears Controller Spec
	describe('Gears Controller Tests', function() {
		// Initialize global variables
		var GearsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Gears controller.
			GearsController = $controller('GearsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Gear object fetched from XHR', inject(function(Gears) {
			// Create sample Gear using the Gears service
			var sampleGear = new Gears({
				name: 'New Gear'
			});

			// Create a sample Gears array that includes the new Gear
			var sampleGears = [sampleGear];

			// Set GET response
			$httpBackend.expectGET('gears').respond(sampleGears);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gears).toEqualData(sampleGears);
		}));

		it('$scope.findOne() should create an array with one Gear object fetched from XHR using a gearId URL parameter', inject(function(Gears) {
			// Define a sample Gear object
			var sampleGear = new Gears({
				name: 'New Gear'
			});

			// Set the URL parameter
			$stateParams.gearId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/gears\/([0-9a-fA-F]{24})$/).respond(sampleGear);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.gear).toEqualData(sampleGear);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Gears) {
			// Create a sample Gear object
			var sampleGearPostData = new Gears({
				name: 'New Gear'
			});

			// Create a sample Gear response
			var sampleGearResponse = new Gears({
				_id: '525cf20451979dea2c000001',
				name: 'New Gear'
			});

			// Fixture mock form input values
			scope.name = 'New Gear';

			// Set POST response
			$httpBackend.expectPOST('gears', sampleGearPostData).respond(sampleGearResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Gear was created
			expect($location.path()).toBe('/gears/' + sampleGearResponse._id);
		}));

		it('$scope.update() should update a valid Gear', inject(function(Gears) {
			// Define a sample Gear put data
			var sampleGearPutData = new Gears({
				_id: '525cf20451979dea2c000001',
				name: 'New Gear'
			});

			// Mock Gear in scope
			scope.gear = sampleGearPutData;

			// Set PUT response
			$httpBackend.expectPUT(/gears\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/gears/' + sampleGearPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid gearId and remove the Gear from the scope', inject(function(Gears) {
			// Create new Gear object
			var sampleGear = new Gears({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Gears array and include the Gear
			scope.gears = [sampleGear];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/gears\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleGear);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.gears.length).toBe(0);
		}));
	});
}());