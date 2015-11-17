'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	LinkGearRequest = mongoose.model('LinkGearRequest'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, linkGearRequest;

/**
 * LinkGearRequest routes tests
 */
describe('LinkGearRequest CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new LinkGearRequest
		user.save(function() {
			linkGearRequest = {
				name: 'LinkGearRequest Name'
			};

			done();
		});
	});

	it('should be able to save LinkGearRequest instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new LinkGearRequest
				agent.post('/linkGearRequests')
					.send(linkGearRequest)
					.expect(200)
					.end(function(linkGearRequestSaveErr, linkGearRequestSaveRes) {
						// Handle LinkGearRequest save error
						if (linkGearRequestSaveErr) done(linkGearRequestSaveErr);

						// Get a list of LinkGearRequests
						agent.get('/linkGearRequests')
							.end(function(linkGearRequestsGetErr, linkGearRequestsGetRes) {
								// Handle LinkGearRequest save error
								if (linkGearRequestsGetErr) done(linkGearRequestsGetErr);

								// Get LinkGearRequests list
								var linkGearRequests = linkGearRequestsGetRes.body;

								// Set assertions
								(linkGearRequests[0].user._id).should.equal(userId);
								(linkGearRequests[0].name).should.match('LinkGearRequest Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save LinkGearRequest instance if not logged in', function(done) {
		agent.post('/linkGearRequests')
			.send(linkGearRequest)
			.expect(401)
			.end(function(linkGearRequestSaveErr, linkGearRequestSaveRes) {
				// Call the assertion callback
				done(linkGearRequestSaveErr);
			});
	});

	it('should not be able to save LinkGearRequest instance if no name is provided', function(done) {
		// Invalidate name field
		linkGearRequest.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new LinkGearRequest
				agent.post('/linkGearRequests')
					.send(linkGearRequest)
					.expect(400)
					.end(function(linkGearRequestSaveErr, linkGearRequestSaveRes) {
						// Set message assertion
						(linkGearRequestSaveRes.body.message).should.match('Please fill LinkGearRequest name');
						
						// Handle LinkGearRequest save error
						done(linkGearRequestSaveErr);
					});
			});
	});

	it('should be able to update LinkGearRequest instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new LinkGearRequest
				agent.post('/linkGearRequests')
					.send(linkGearRequest)
					.expect(200)
					.end(function(linkGearRequestSaveErr, linkGearRequestSaveRes) {
						// Handle LinkGearRequest save error
						if (linkGearRequestSaveErr) done(linkGearRequestSaveErr);

						// Update LinkGearRequest name
						linkGearRequest.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing LinkGearRequest
						agent.put('/linkGearRequests/' + linkGearRequestSaveRes.body._id)
							.send(linkGearRequest)
							.expect(200)
							.end(function(linkGearRequestUpdateErr, linkGearRequestUpdateRes) {
								// Handle LinkGearRequest update error
								if (linkGearRequestUpdateErr) done(linkGearRequestUpdateErr);

								// Set assertions
								(linkGearRequestUpdateRes.body._id).should.equal(linkGearRequestSaveRes.body._id);
								(linkGearRequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of LinkGearRequests if not signed in', function(done) {
		// Create new LinkGearRequest model instance
		var linkGearRequestObj = new LinkGearRequest(linkGearRequest);

		// Save the LinkGearRequest
		linkGearRequestObj.save(function() {
			// Request LinkGearRequests
			request(app).get('/linkGearRequests')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single LinkGearRequest if not signed in', function(done) {
		// Create new LinkGearRequest model instance
		var linkGearRequestObj = new LinkGearRequest(linkGearRequest);

		// Save the LinkGearRequest
		linkGearRequestObj.save(function() {
			request(app).get('/linkGearRequests/' + linkGearRequestObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', linkGearRequest.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete LinkGearRequest instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new LinkGearRequest
				agent.post('/linkGearRequests')
					.send(linkGearRequest)
					.expect(200)
					.end(function(linkGearRequestSaveErr, linkGearRequestSaveRes) {
						// Handle LinkGearRequest save error
						if (linkGearRequestSaveErr) done(linkGearRequestSaveErr);

						// Delete existing LinkGearRequest
						agent.delete('/linkGearRequests/' + linkGearRequestSaveRes.body._id)
							.send(linkGearRequest)
							.expect(200)
							.end(function(linkGearRequestDeleteErr, linkGearRequestDeleteRes) {
								// Handle LinkGearRequest error error
								if (linkGearRequestDeleteErr) done(linkGearRequestDeleteErr);

								// Set assertions
								(linkGearRequestDeleteRes.body._id).should.equal(linkGearRequestSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete LinkGearRequest instance if not signed in', function(done) {
		// Set LinkGearRequest user 
		linkGearRequest.user = user;

		// Create new LinkGearRequest model instance
		var linkGearRequestObj = new LinkGearRequest(linkGearRequest);

		// Save the LinkGearRequest
		linkGearRequestObj.save(function() {
			// Try deleting LinkGearRequest
			request(app).delete('/linkGearRequests/' + linkGearRequestObj._id)
			.expect(401)
			.end(function(linkGearRequestDeleteErr, linkGearRequestDeleteRes) {
				// Set message assertion
				(linkGearRequestDeleteRes.body.message).should.match('User is not logged in');

				// Handle LinkGearRequest error error
				done(linkGearRequestDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		LinkGearRequest.remove().exec();
		done();
	});
});