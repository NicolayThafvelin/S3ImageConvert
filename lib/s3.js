var AWS = require('aws-sdk');

module.exports = new AWS.S3({params: {
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: 'eu-west-1',
  bucket : process.env.S3_BUCKET
}});