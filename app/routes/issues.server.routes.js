'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var issue = require('../../app/controllers/issues.server.controller');

	// Issue Routes
	app.route('/issues')
		.get(users.requiresLogin, issue.list)
		.post(issue.create);

	app.route('/issues/:issueId')
		.get(users.requiresLogin, issue.read)
		.put(users.requiresLogin, issue.update)
		.delete(users.requiresLogin, issue.delete);

	// Finish by binding the Issues middleware
	app.param('issueId', issue.issueByID);
};
