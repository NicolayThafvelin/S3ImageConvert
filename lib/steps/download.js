var s3 = require('../s3');

module.exports = downloader;

function downloader(image, cached, callback) {
    if (cached) return callback(null, false);

    var params = {
        Bucket: image.originalBucket,
        Key: image.getOriginalKey()
    };
    //Minimize meomory by requesting only headers to check if file exists on s3
    s3.headObject(params, function(err, res) {
        //If no err then file exists, then set headers and create read stream from s3object
        if (!err) {
            image.setHeaders(res);
            image.setStream(s3.getObject(params).createReadStream());
        }
        callback(null, !err);
    });
}