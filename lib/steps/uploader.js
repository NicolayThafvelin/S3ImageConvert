var s3 = require('../s3');
var debug = require('debug')('steps');

module.exports = uploader;

function uploader(image, processedImage, callback) {
    if (!processedImage) return callback();
    var dest = image.getNewKey();
    var headers = image.getHeaders();

    var params = {
        ACL: 'public-read',
        Key: dest,
        Bucket: serverConfig.resizeBucket,
        Body: image.getStream(),
        ContentType: headers['Content-Type'],
        ContentLength: headers['Content-Length'],
        CacheControl: 'max-age=31556926'
    };
    
    if(image.isGzip()){
        params.ContentEncoding = 'gzip';
    }

    s3.upload(params, function(err, res) {
        if (err) {
            debug('Upload to S3 failed:\n' + err);
        }
        callback(err);
    });


}