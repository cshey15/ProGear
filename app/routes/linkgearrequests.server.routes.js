'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var linkGearRequests = require('../../app/controllers/linkgearrequests.server.controller');

	// LinkGearRequests Routes
	app.route('/linkGearRequests')
		.get(linkGearRequests.list)
		.post(linkGearRequests.create);

	app.route('/linkGearRequests/:linkGearRequestId')
		.get(linkGearRequests.read)
		.put(users.hasAuthorization(['admin']), linkGearRequests.update)
		.delete(users.hasAuthorization(['admin']), linkGearRequests.delete);

	// Finish by binding the LinkGearRequest middleware
	app.param('linkGearRequestId', linkGearRequests.linkGearRequestByID);
};
