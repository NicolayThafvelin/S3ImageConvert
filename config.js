module.exports = {
    port: process.env.PORT,

    targetBuckets: [
        'layup-images',
        'layup-images-mobile',
        'layup-images-tablet',
        'layup-images-desktop',
        'layup'
    ],
    resizeBucket: 'layup-resized',

    acceptedSizes: [
        128,
        256,
        512,
        1024,
        2048
    ],

    awsKey: process.env.AWS_KEY,
    awsSecret: process.env.AWS_SECRET,
    awsRegion: process.env.AWS_REGION,
   
    useCache : true,
    useWebP : true,

    emailService: process.env.EMAIL_SERVICE,
    emailAuth: JSON.parse(process.env.EMAIL_AUTH || "{}"),

    emailSettings: {
        from: process.env.ERRORMAIL_FROM,
        to: process.env.ERRORMAIL_TO,
        subject: process.env.ERRORMAIL_SUBJECT || 'Image server error'
    }
};