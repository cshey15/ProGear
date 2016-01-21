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
    _ = require('lodash'), 
    uuid = require('node-uuid');;


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

exports.listTop = function (req, res) {
    Pro.find({ published: true }).sort('-popularityScore').limit(6).exec(function (err, gears) {
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
    Pro.find({ published: true }).sort('-created').limit(6).exec(function (err, gears) {
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
    //TODO, add explanation and proof link to gears section
    LinkGearRequest.find({ pro: req.pro, status: 'approved' }).deepPopulate('gear').select('proofLink explanation gear').exec(function (err, pros) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        } else {
            res.json(pros);
        }
    });
};

var azure = require('azure-storage');
var blobSvc = azure.createBlobService('prozgear', 'ga2+n3Y0sSwZSSCeKLs9M0s2JNgJahvZdkOU7ixRvTHvXzkzxIAVC8r00sHBroTjgIcwJO2zoIbbnZvD80c7HA==');
blobSvc.createContainerIfNotExists('profileimages', { publicAccessLevel : 'blob' }, function (error, result, response) {
    if (!error) {
    // Container exists and allows
    // anonymous read access to blob
    // content and metadata within this container
    }
});

exports.uploadFile = function (req, res) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var file = req.files.file;
    if (!file || !req.pro) {
        return res.status(400).send({
            message: 'error'
        });
    }
    var ext = file.type.split('/')[1];
    var filename = uuid.v4() + '.' + ext;
    blobSvc.createBlockBlobFromLocalFile ('profileimages', filename, file.path, function (error, result, response) {
        console.log('upload complete');
        if (!error) {
            var oldPicture = req.pro.profilePictureUrl;
            req.pro.profilePictureUrl = 'https://prozgear.blob.core.windows.net/profileimages/' + filename;
            req.pro.save(function (err) {
                if (err) {
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var blob = oldPicture.split('https://prozgear.blob.core.windows.net/profileimages/');
                    if (blob.length > 1) {
                        blobSvc.deleteBlob('profileimages', blob[1], function (error, response) {
                            if (!error) {
                                console.log("old profile picture deleted");
                            }
                        });
                    }
                    return res.status(200).send({ message: 'upload successful' });
                }
            });
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
