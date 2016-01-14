'use strict';

module.exports = function(app) {
    var pros = require('../../app/controllers/pros.server.controller');
    var users = require('../../app/controllers/users.server.controller');

    app.route('/pros')
        .get(pros.list)
        .post(pros.create);

    app.route('/pros/top')
		.get(pros.listTop);
    
    app.route('/pros/recent')
		.get(pros.listRecent);

    // the proId param is added to the params object for the request
    app.route('/pros/:proId')
        .get(pros.read)
        .put(users.requiresLogin, pros.update)
	    .delete(users.requiresLogin, pros.delete);

    app.route('/pros/:proId/gears')
	    .get(pros.getGearsForPro);

    app.route('/admin/pros/unpublished')
        .get(pros.listUnpublished);
    
    app.param('proId', pros.proByID);
};