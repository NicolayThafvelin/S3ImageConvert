var AWS = require('aws-sdk');

module.exports = new AWS.S3({
    params: {
        accessKeyId: serverConfig.awsKey,
        secretAccessKey: serverConfig.awsSecret,
        region: serverConfig.awsRegion,
        bucket: serverConfig.resizeBucket
    }
});