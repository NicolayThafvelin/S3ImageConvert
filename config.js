module.exports = {
    port : process.env.port || 3333,
    targetBuckets: [
        'layup-images',
        'layup'
    ],
    resizeBucket: 'layup-testing',
    awsKey : 'AKIAJAD6INMSJCHYV6CA',
    awsSecret: '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',
    awsRegion : 'eu-west-1',
    
    emailTransport: {
        service: 'Sendgrid', // use well known service
        auth : {
            key: 'cipio',
            secret: 'Sk3TksEU3GGtZzaK',
        }
    },

    emailSettings: {
        from: process.env.ERRORMAIL_FROM || 'post@layup.io',
        to: process.env.ERRORMAIL_TO || 'nicolay@layup.io',
        subject: process.env.ERRORMAIL_SUBJECT || 'Image server error'
    }
};