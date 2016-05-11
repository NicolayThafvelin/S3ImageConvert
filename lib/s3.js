var AWS = require('aws-sdk');
AWS.config.update({
        accessKeyId: serverConfig.awsKey,
        secretAccessKey: serverConfig.awsSecret,
        region: serverConfig.awsRegion,
});
module.exports = new AWS.S3();