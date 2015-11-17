'use strict';

(function() {
	// LinkGearRequests Controller Spec
	describe('LinkGearRequests Controller Tests', function() {
		// Initialize global variables
		var LinkGearRequestsController,
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

			// Initialize the LinkGearRequests controller.
			LinkGearRequestsController = $controller('LinkGearRequestsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one LinkGearRequest object fetched from XHR', inject(function(LinkGearRequests) {
			// Create sample LinkGearRequest using the LinkGearRequests service
			var sampleLinkGearRequest = new LinkGearRequests({
				name: 'New LinkGearRequest'
			});

			// Create a sample LinkGearRequests array that includes the new LinkGearRequest
			var sampleLinkGearRequests = [sampleLinkGearRequest];

			// Set GET response
			$httpBackend.expectGET('linkGearRequests').respond(sampleLinkGearRequests);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.linkGearRequests).toEqualData(sampleLinkGearRequests);
		}));

		it('$scope.findOne() should create an array with one LinkGearRequest object fetched from XHR using a linkGearRequestId URL parameter', inject(function(LinkGearRequests) {
			// Define a sample LinkGearRequest object
			var sampleLinkGearRequest = new LinkGearRequests({
				name: 'New LinkGearRequest'
			});

			// Set the URL parameter
			$stateParams.linkGearRequestId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/linkGearRequests\/([0-9a-fA-F]{24})$/).respond(sampleLinkGearRequest);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.linkGearRequest).toEqualData(sampleLinkGearRequest);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(LinkGearRequests) {
			// Create a sample LinkGearRequest object
			var sampleLinkGearRequestPostData = new LinkGearRequests({
				name: 'New LinkGearRequest'
			});

			// Create a sample LinkGearRequest response
			var sampleLinkGearRequestResponse = new LinkGearRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New LinkGearRequest'
			});

			// Fixture mock form input values
			scope.name = 'New LinkGearRequest';

			// Set POST response
			$httpBackend.expectPOST('linkGearRequests', sampleLinkGearRequestPostData).respond(sampleLinkGearRequestResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the LinkGearRequest was created
			expect($location.path()).toBe('/linkGearRequests/' + sampleLinkGearRequestResponse._id);
		}));

		it('$scope.update() should update a valid LinkGearRequest', inject(function(LinkGearRequests) {
			// Define a sample LinkGearRequest put data
			var sampleLinkGearRequestPutData = new LinkGearRequests({
				_id: '525cf20451979dea2c000001',
				name: 'New LinkGearRequest'
			});

			// Mock LinkGearRequest in scope
			scope.linkGearRequest = sampleLinkGearRequestPutData;

			// Set PUT response
			$httpBackend.expectPUT(/linkGearRequests\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/linkGearRequests/' + sampleLinkGearRequestPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid linkGearRequestId and remove the LinkGearRequest from the scope', inject(function(LinkGearRequests) {
			// Create new LinkGearRequest object
			var sampleLinkGearRequest = new LinkGearRequests({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new LinkGearRequests array and include the LinkGearRequest
			scope.linkGearRequests = [sampleLinkGearRequest];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/linkGearRequests\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleLinkGearRequest);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.linkGearRequests.length).toBe(0);
		}));
	});
}());