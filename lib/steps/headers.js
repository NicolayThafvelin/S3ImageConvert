var s3 = require('../s3');

module.exports = headers;

function headers(bucket, key, callback) {
    var params = {
        Bucket: bucket,
        Key: key
    };
    //Minimize meomory by requesting only headers to check if file exists on s3
    s3.headObject(params, callback);
}