var s3 = require('../s3');
var config = require('../../config');

module.exports = cached;

function cached(image, callback) {
    return callback(null, false);
    var params = {
        Bucket: 'layup-testing',
        Key: image.getNewKey(),
    };
    console.log('GET');
    //Minimize meomory by requesting only headers to check if file exists on s3
    s3.headObject(params, function(err, res) {
        console.log('CAHCED RESULT', !err);
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