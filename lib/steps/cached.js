var s3 = require('../s3');
var config = require('../../config');
var debug = require('debug')('steps');
module.exports = cached;

function cached(image, callback) {
    var params = {
        Bucket: serverConfig.resizeBucket,
        Key: image.getNewKey(),
    };
    //Minimize meomory by requesting only headers to check if file exists on s3
    s3.headObject(params, function(err, res) {
        //If no err then file exists, then set headers and create read stream from s3object
        if (!err) {
            image.setHeaders(res);
            image.setStream(s3.getObject(params).createReadStream());
            callback(null, true);
        } else {
            callback(null, false);
        }
    });
}