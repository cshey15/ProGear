'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    LinkGearRequest = mongoose.model('LinkGearRequest'),
    Pro = mongoose.model('Pro'),
	_ = require('lodash');

/**
 * Create a LinkGearRequest
 */
exports.create = function(req, res) {
	var linkGearRequest = new LinkGearRequest(req.body);
	linkGearRequest.user = req.body.user;

	linkGearRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(linkGearRequest);
		}
	});
};

/**
 * Show the current LinkGearRequest
 */
exports.read = function(req, res) {
	res.jsonp(req.linkGearRequest);
};

/**
 * Update a LinkGearRequest
 */
exports.update = function(req, res) {
	var linkGearRequest = req.linkGearRequest ;

	linkGearRequest = _.extend(linkGearRequest , req.body);

	linkGearRequest.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(linkGearRequest);
		}
	});
};

/**
 * Delete an LinkGearRequest
 */
exports.delete = function(req, res) {
	var linkGearRequest = req.linkGearRequest ;

	linkGearRequest.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(linkGearRequest);
		}
	});
};

/**
 * List of LinkGearRequests
 */
exports.list = function(req, res) { 
	LinkGearRequest.find().sort('-created').populate('user', 'displayName').populate('pro', 'pro.name').populate('gear', 'name').exec(function(err, linkGearRequests) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(linkGearRequests);
		}
	});
};

/**
 * LinkGearRequest middleware
 */
exports.linkGearRequestByID = function(req, res, next, id) { 
	LinkGearRequest.findById(id).populate('user', 'displayName').populate('pro', 'name').populate('gear', 'name').exec(function(err, linkGearRequest) {
		if (err) return next(err);
		if (! linkGearRequest) return next(new Error('Failed to load LinkGearRequest ' + id));
		req.linkGearRequest = linkGearRequest ;
		next();
	});
};

/**
 * LinkGearRequest authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.linkGearRequest.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
