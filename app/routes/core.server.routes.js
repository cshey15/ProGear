'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
    app.route('/').get(core.index);

    var multiparty = require('connect-multiparty'),
        multipartyMiddleware = multiparty();
    app.route('/api/upload').post(multipartyMiddleware, core.uploadFile);
};