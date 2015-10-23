'use strict';

module.exports = function(app) {
    var pros = require('../../app/controllers/pros.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/pros')
        .get(pros.list)
        .post(pros.create);

    // the proId param is added to the params object for the request
    app.route('/pros/:proId')
        .get(pros.read)
        .put(users.requiresLogin, pros.update)
	    .delete(users.requiresLogin, pros.delete);

    app.param('proId', pros.proByID);
};