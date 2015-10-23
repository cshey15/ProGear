'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var gears = require('../../app/controllers/gears.server.controller');

	// Gears Routes
	app.route('/gears')
		.get(gears.list)
		.post(users.requiresLogin, gears.create);

	app.route('/gears/:gearId')
		.get(gears.read)
		.put(users.requiresLogin, gears.hasAuthorization, gears.update)
		.delete(users.requiresLogin, gears.hasAuthorization, gears.delete);

	// Finish by binding the Gear middleware
	app.param('gearId', gears.gearByID);
};
