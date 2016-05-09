var s3 = require('../s3');

module.exports = downloader;

function downloader(image, cached, callback) {
    if (cached) return callback(null, false);

    var params = {
        Bucket: image.originalBucket,
        Key: image.getOriginalKey()
    };

    image.setStream(s3.getObject(params).createReadStream());
    callback(null, true);
}