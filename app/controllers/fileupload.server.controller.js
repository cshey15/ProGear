'use strict';

exports.uploadFile = function (req, res) {
    // We are able to access req.files.file thanks to 
    // the multiparty middleware
    var file = req.files.file;
    // TODO - save the file to azure or amazon s3
    console.log(file.name);
    console.log(file.type);
};