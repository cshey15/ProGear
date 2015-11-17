'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LinkGearRequest = mongoose.model('LinkGearRequest');

/**
 * Globals
 */
var user, linkGearRequest;

/**
 * Unit tests
 */
describe('LinkGearRequest Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			linkGearRequest = new LinkGearRequest({
				name: 'LinkGearRequest Name',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return linkGearRequest.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			linkGearRequest.name = '';

			return linkGearRequest.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		LinkGearRequest.remove().exec();
		User.remove().exec();

		done();
	});
});