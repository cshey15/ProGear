'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var linkGearRequests = require('../../app/controllers/linkGearRequests.server.controller');

	// LinkGearRequests Routes
	app.route('/linkGearRequests')
		.get(users.requiresLogin, users.hasAuthorization('admin'), linkGearRequests.list)
		.post(users.requiresLogin, linkGearRequests.create);

	app.route('/linkGearRequests/:linkGearRequestId')
		.get(linkGearRequests.read)
		.put(users.requiresLogin, linkGearRequests.update)
		.delete(users.requiresLogin, linkGearRequests.hasAuthorization, linkGearRequests.delete);

	// Finish by binding the LinkGearRequest middleware
	app.param('linkGearRequestId', linkGearRequests.linkGearRequestByID);
};
