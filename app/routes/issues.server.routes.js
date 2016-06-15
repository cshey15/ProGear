'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var issue = require('../../app/controllers/issues.server.controller');

	// Issue Routes
	app.route('/issues')
		.get(users.hasAuthorization(['admin']), issue.list)
		.post(issue.create);

	app.route('/issues/:issueId')
		.get(users.hasAuthorization(['admin']), issue.read)
		.put(users.hasAuthorization(['admin']), issue.update)
		.delete(users.hasAuthorization(['admin']), issue.delete);

	// Finish by binding the Issues middleware
	app.param('issueId', issue.issueByID);
};
