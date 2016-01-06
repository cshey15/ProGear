'use strict';

module.exports = function(app) {
	// Root routing
	var core = require('../../app/controllers/core.server.controller');
    app.route('/').get(core.index);
    
    var upload = require('../../app/controllers/fileupload.server.controller'),
        multiparty = require('connect-multiparty'),
        multipartyMiddleware = multiparty();
    app.route('/api/upload').post(multipartyMiddleware, upload.uploadFile);
};