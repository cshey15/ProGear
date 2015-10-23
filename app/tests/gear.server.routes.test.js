'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Gear = mongoose.model('Gear'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, gear;

/**
 * Gear routes tests
 */
describe('Gear CRUD tests', function() {
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

		// Save a user to the test db and create new Gear
		user.save(function() {
			gear = {
				name: 'Gear Name'
			};

			done();
		});
	});

	it('should be able to save Gear instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gear
				agent.post('/gears')
					.send(gear)
					.expect(200)
					.end(function(gearSaveErr, gearSaveRes) {
						// Handle Gear save error
						if (gearSaveErr) done(gearSaveErr);

						// Get a list of Gears
						agent.get('/gears')
							.end(function(gearsGetErr, gearsGetRes) {
								// Handle Gear save error
								if (gearsGetErr) done(gearsGetErr);

								// Get Gears list
								var gears = gearsGetRes.body;

								// Set assertions
								(gears[0].user._id).should.equal(userId);
								(gears[0].name).should.match('Gear Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Gear instance if not logged in', function(done) {
		agent.post('/gears')
			.send(gear)
			.expect(401)
			.end(function(gearSaveErr, gearSaveRes) {
				// Call the assertion callback
				done(gearSaveErr);
			});
	});

	it('should not be able to save Gear instance if no name is provided', function(done) {
		// Invalidate name field
		gear.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gear
				agent.post('/gears')
					.send(gear)
					.expect(400)
					.end(function(gearSaveErr, gearSaveRes) {
						// Set message assertion
						(gearSaveRes.body.message).should.match('Please fill Gear name');
						
						// Handle Gear save error
						done(gearSaveErr);
					});
			});
	});

	it('should be able to update Gear instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gear
				agent.post('/gears')
					.send(gear)
					.expect(200)
					.end(function(gearSaveErr, gearSaveRes) {
						// Handle Gear save error
						if (gearSaveErr) done(gearSaveErr);

						// Update Gear name
						gear.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Gear
						agent.put('/gears/' + gearSaveRes.body._id)
							.send(gear)
							.expect(200)
							.end(function(gearUpdateErr, gearUpdateRes) {
								// Handle Gear update error
								if (gearUpdateErr) done(gearUpdateErr);

								// Set assertions
								(gearUpdateRes.body._id).should.equal(gearSaveRes.body._id);
								(gearUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Gears if not signed in', function(done) {
		// Create new Gear model instance
		var gearObj = new Gear(gear);

		// Save the Gear
		gearObj.save(function() {
			// Request Gears
			request(app).get('/gears')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Gear if not signed in', function(done) {
		// Create new Gear model instance
		var gearObj = new Gear(gear);

		// Save the Gear
		gearObj.save(function() {
			request(app).get('/gears/' + gearObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', gear.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Gear instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Gear
				agent.post('/gears')
					.send(gear)
					.expect(200)
					.end(function(gearSaveErr, gearSaveRes) {
						// Handle Gear save error
						if (gearSaveErr) done(gearSaveErr);

						// Delete existing Gear
						agent.delete('/gears/' + gearSaveRes.body._id)
							.send(gear)
							.expect(200)
							.end(function(gearDeleteErr, gearDeleteRes) {
								// Handle Gear error error
								if (gearDeleteErr) done(gearDeleteErr);

								// Set assertions
								(gearDeleteRes.body._id).should.equal(gearSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Gear instance if not signed in', function(done) {
		// Set Gear user 
		gear.user = user;

		// Create new Gear model instance
		var gearObj = new Gear(gear);

		// Save the Gear
		gearObj.save(function() {
			// Try deleting Gear
			request(app).delete('/gears/' + gearObj._id)
			.expect(401)
			.end(function(gearDeleteErr, gearDeleteRes) {
				// Set message assertion
				(gearDeleteRes.body.message).should.match('User is not logged in');

				// Handle Gear error error
				done(gearDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Gear.remove().exec();
		done();
	});
});