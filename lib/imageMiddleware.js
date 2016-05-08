var steps = require("./steps");
var async = require("async");
var ImageModel = require('./imageModel');

var pathReg = new RegExp('^\/(' + serverConfig.targetBuckets.join('|') + ')\/\\d{1,4}\/\\d{1,4}\/.*');
module.exports = Middleware;

/**
 * Checks if path is in format /{targetBucket}/{width}/{height}/{aws-key}
 * width and height must be digit < 10000
 * 
 * @param {string} path (description)
 * @returns {boolean} true if path is valied
 */
function isValidPath(path) {
    console.log(path);
    return pathReg.test(path);
}

function Middleware(req, res, next) {
    var reqId = req.headers['x-request-id'];

    if (!isValidPath(req.path)) {
        res.statusCode = 404;
        return res.end();
    }

    var path = req.path.split('/');
    var targetBucket = path[1];
    var width = parseInt(path[2]);
    var height = parseInt(path[3]);
    var originalKey = path[4];

    async.autoInject({
        image: function(callback) {
            callback(null, new ImageModel(targetBucket, originalKey, width, height));
        },
        res: function(callback) {
            callback(null, res);
        },
        cached: ['image', steps.cached],
        download: ['image', 'cached', steps.download],
        processedImage: ['image', 'cached', 'download', steps.processor],
        server: ['image', 'processedImage', 'res', steps.server],
        upload: ['image', 'processedImage', steps.uploader]
    }, function(err) {
        console.log('IM HERE', err);
    });
}