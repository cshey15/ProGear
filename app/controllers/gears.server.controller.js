'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
    Gear = mongoose.model('Gear'),
    Pro = mongoose.model('Pro'),
    LinkGearRequest = mongoose.model('LinkGearRequest'),
	_ = require('lodash');

/**
 * Create a Gear
 */
exports.create = function(req, res) {
	var gear = new Gear(req.body);
	gear.user = req.user;

	gear.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gear);
		}
	});
};

/**
 * Show the current Gear
 */
exports.read = function(req, res) {
	res.jsonp(req.gear);
};

/**
 * Update a Gear
 */
exports.update = function(req, res) {
	var gear = req.gear ;

	gear = _.extend(gear , req.body);

	gear.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gear);
		}
	});
};

/**
 * Delete an Gear
 */
exports.delete = function(req, res) {
	var gear = req.gear ;

	gear.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gear);
		}
	});
};

/**
 * List of Gears
 */
exports.list = function(req, res) { 
	Gear.find({ published: true }).sort('-created').populate('user', 'displayName').populate('pro').exec(function(err, gears) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(gears);
		}
	});
};

exports.listTop = function (req, res) {
    Gear.find({ published: true }).sort('-popularityScore').limit(6).exec(function (err, gears) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gears);
        }
    });
};

exports.listRecent = function (req, res) {
    Gear.find({ published: true }).sort('-created').limit(6).exec(function (err, gears) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gears);
        }
    });
};

exports.listUnpublished = function (req, res) {
    Gear.find({ published: false }).sort('-created').populate('user', 'displayName').populate('pro').exec(function (err, gears) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.jsonp(gears);
        }
    });
};

exports.getProsForGear = function (req, res) {
    LinkGearRequest.find({ gear: req.gear, status: 'approved' }).deepPopulate('pro').select('pro').exec(function (err, pros) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pros);
        }
    });
};

/**
 * Gear middleware
 */
exports.gearByID = function(req, res, next, id) { 
	Gear.findById(id).populate('user', 'displayName').populate('pro').exec(function(err, gear) {
		if (err) return next(err);
		if (! gear) return next(new Error('Failed to load Gear ' + id));
		req.gear = gear ;
		next();
	});
};

/**
 * Gear authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.gear.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
