var s3 = require('../s3');
module.exports = uploader;

function uploader(image, processedImage, callback) {
    if (!processedImage) return callback();
    var dest = image.getNewKey();
    var headers = image.getHeaders();
    
    var params = {
        ACL: 'public-read',
        Key: dest,
        Bucket: 'layup-testing',
        Body: image.getStream(),
        ContentType: headers['Content-Type'],
        ContentLength: headers['Content-Length'],
        CacheControl: 'max-age=31556926'
    };

    // obj.debug("dest path: " + dest);

    s3.upload(params, function(err, res) {
        console.log('PUT STREAM', err, res);
        if (err) {
            obj.debug(err);
            return;
        }

        if (res.statusCode !== 200) {
            // obj.debug("Upload to S3 returned code " + res.statusCode + " instead of 200");
        }
        
        callback();
    });

    
}