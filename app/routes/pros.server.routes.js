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
        .put(users.hasAuthorization(['admin']), pros.update)
	    .delete(users.hasAuthorization(['admin']), pros.delete);

    app.route('/pros/:proId/gears')
	    .get(pros.getGearsForPro);

    app.route('/pros/:proId/gears/all')
        .get(pros.getGearsForProAll);

    app.route('/admin/pros/unpublished')
        .get(users.hasAuthorization(['admin']), pros.listUnpublished);

    var multiparty = require('connect-multiparty'),
        multipartyMiddleware = multiparty();
    app.route('/api/pro/:proId/upload').post(multipartyMiddleware, pros.uploadFile);

    app.param('proId', pros.proByID);
};