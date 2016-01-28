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

var regexForASIN = new RegExp('http://www.amazon.com/([\\w-]+/)?(dp|gp/product)/(\\w+/)?(\\w{10})');
function extractASIN(url) {
    return url.match(regexForASIN);
}

var aws = require('aws-lib');
var prodAdv = aws.createProdAdvClient('AKIAJLWWNMTUDDWMMKVA', 'I83qtp2IInF4M/74nN9ZDx9ON4nUW3zehAcoS7LM', 'prsge-20');
function save(req, res, gear) {
    gear.lastUpdated = Date.now();
    if (gear.amazonLink && !gear.asin) {
        var matches = extractASIN(gear.amazonLink);
        if (matches) {
            gear.asin = matches[4];
        }
    }
    
    if (gear.asin) {
        // maybe move this to offline process
        prodAdv.call('ItemLookup', { ItemId: gear.asin, ResponseGroup: 'ItemAttributes,Images' }, function (err, result) {
            if (!err && result && result.Items && result.Items.Item) {
                gear.features = result.Items.Item.ItemAttributes.Feature;
                gear.profilePictureUrl = result.Items.Item.MediumImage.URL;
                gear.amazonLink = result.Items.Item.DetailPageURL;
                gear.name = result.Items.Item.ItemAttributes.Title;
            } else {
                console.log('Error getting product');
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            }
            
            gear.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(gear);
                }
            });
        });
    } else {
        gear.save(function (err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(gear);
            }
        });
    }
}

/**
 * Create a Gear
 */
exports.create = function (req, res) {
    var gear = new Gear(req.body);
    gear.user = req.user;
    save(req, res, gear);
};



/**
 * Show the current Gear
 */

exports.read = function (req, res) {
    res.jsonp(req.gear);
};

exports.getDetails = function (req, res) { //Possible TODO: move this to save/update and save info into our database?
    var gear = req.gear;
    if (gear.asin) {
        prodAdv.call('ItemLookup', { ItemId: gear.asin, ResponseGroup: 'ItemAttributes,Reviews,Images' }, function (err, result) {
            if (!err && result && result.Items && result.Items.Item) {
                res.send({ item: result.Items.Item });
            } else {
                res.jsonp({}); // Todo- default values?
            }
        });
    }
};

/**
 * Update a Gear
 */
exports.update = function (req, res) {
    var gear = req.gear;
    
    gear = _.extend(gear , req.body);
    save(req, res, gear);

};

/**
 * Delete an Gear
 */
exports.delete = function (req, res) {
    var gear = req.gear;
    
    gear.remove(function (err) {
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
exports.list = function (req, res) {
    Gear.find({ published: true }).sort('-created').populate('user', 'displayName').populate('pro').exec(function (err, gears) {
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
exports.gearByID = function (req, res, next, id) {
    Gear.findById(id).populate('user', 'displayName').populate('pro').exec(function (err, gear) {
        if (err) return next(err);
        if (!gear) return next(new Error('Failed to load Gear ' + id));
        req.gear = gear;
        next();
    });
};

/**
 * Gear authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.gear.user.id !== req.user.id) {
        return res.status(403).send('User is not authorized');
    }
    next();
};
