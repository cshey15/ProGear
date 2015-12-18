'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    errorHandler = require('./errors.server.controller'),
    Pro = mongoose.model('Pro'),
    LinkGearRequest = mongoose.model('LinkGearRequest'),
    RequestHandler = require('./linkgearrequests.server.controller.js'),
    GearHandler = require('./gears.server.controller.js'),
    _ = require('lodash');


/**
 * Create a Pro
 */
exports.create = function(req, res) {
    var pro = new Pro(req.body);
    pro.user = req.user;
    pro.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.status(201).json(pro);
        }
    });
};

/**
 * Show the current Pro
 */
exports.read = function(req, res) {
    res.jsonp(req.pro);
};

/**
 * Update a Pro
 */
exports.update = function(req, res) {
    var pro = req.pro;
    //pro.gearList = req.pro.gearList;
    pro = _.extend(pro, req.body);
    
    pro.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pro);
        }
    });
};

exports.addGearRequest = function (req, res) {
    var pro = req.pro;
    var request = new RequestHandler(req.body);
    
    request.save(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            pro.requestList.push(request);
            pro.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.json(pro);
                }
            });
        }
    });
};

/**
 * Delete an Pro
 */
exports.delete = function(req, res) {
    var pro = req.pro;
    
    pro.remove(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pro);
        }
    });
};

/**
 * List of Pros
 */
exports.list = function(req, res) {
    Pro.find({ published: true }).populate('user', 'displayName').deepPopulate('requestList.gear').exec(function (err, pros) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pros);
        }
    });
};

exports.listUnpublished = function (req, res) {
    Pro.find({ published: false }).populate('user', 'displayName').deepPopulate('requestList.gear').exec(function (err, pros) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pros);
        }
    });
};

exports.getGearsForPro = function (req, res) {
    LinkGearRequest.find({ pro: req.pro, status: 'approved' }).deepPopulate('gear').select('gear').exec(function (err, pros) {
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
 * Pro middleware
 */
exports.proByID = function (req, res, next, id) {
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({
            message: 'Pro is invalid'
        });
    }
    
    Pro.findById(id).populate('user', 'displayName').deepPopulate('requestList.gear').exec(function (err, pro) {
        if (err) return next(err);
        if (!pro) {
            return res.status(404).send({
                message: 'Pro not found'
            });
        }
        req.pro = pro;
        next();
    });
};

/**
 * Pro authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.pro.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
