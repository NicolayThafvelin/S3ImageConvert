module.exports = {
    targetBuckets: [
        'layup-images',
        'layup'
    ],
    resizeBucket: 'layup-testing',
    awsSecret: '',
    
    emailAuth: {
        key: 'cipio',
        secret: 'Sk3TksEU3GGtZzaK',
    },

    emailSettings: {
        from: process.env.ERRORMAIL_FROM || 'post@layup.io',
        to: process.env.ERRORMAIL_TO || 'nicolay@layup.io',
        subject: process.env.ERRORMAIL_SUBJECT || 'Image server error'
    }
};