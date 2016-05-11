var util = require("util");
var crypto = require("crypto");

var IMAGE_FORMATS = {
    "image/svg": "svg",
    "image/svg+xml": "svg",
    "image/jpg" : "jpg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif"
};

module.exports = ImageModel;

function ImageModel(originalBucket, originalKey, size, s3Headers, acceptWebP) {
    this.originalBucket = originalBucket;
    this.originalKey = originalKey;
    this.acceptWebP = acceptWebP;

    this.headers = {
        'Cache-Control': 'max-age=31556926'
    };
    this.setHeaders(s3Headers);

    var sizes = serverConfig.acceptedSizes,
        i = 0,
        len = sizes.length - 1;
    for (; i < len; i++) {
        if (sizes[i] > size) break;
    }

    this.size = sizes[i];
}
ImageModel.prototype = {
    getOriginalKey: function() {
        return this.originalKey;
    },

    getNewKey: function() {
        var shasum = crypto.createHash('sha1');
        shasum.update(this.originalKey + '-' + this.size + this.type + (this.useWebP() ? '-webp' : ''));
        return shasum.digest("hex");
    },

    useWebP: function() {
        return this.type !== 'svg' && this.acceptWebP;
    },

    setHeaders: function(s3Object) {
        this.type = IMAGE_FORMATS[s3Object.ContentType];
        this.headers['Content-Type'] = s3Object.ContentType;
        this.headers['Last-Modified'] = s3Object.LastModified;
        this.headers['Content-Length'] = s3Object.ContentLength;
        if(s3Object.ContentEncoding){
            this.headers['Content-Encoding'] = s3Object.ContentEncoding;
        }
    },

    setGzip: function(isGziped) {
        this.gzip = true;
        this.headers['Content-Encoding'] = 'gzip';
    },

    isGzip: function() {
        return this.gzip;
    },

    getHeaders: function() {
        if (this.stream && this.stream.length) {
            this.headers['Content-Length'] = this.stream.length;
        }
        if (this.useWebP()) {
            this.headers['Content-Type'] = 'image/webp';
        }
        
        return this.headers;
    },
    setStream: function(stream) {
        this.stream = stream;
    },

    getStream: function() {
        return this.stream;
    },

    getSize: function() {
        return this.size;
    },

    pipe: function(target) {
        if (this.stream) {
            this.stream.pipe(target);
        }
    },

    toString: function() {
        return this.originalBucket + '/' + this.originalKey + ' - ' + this.size;
    }
};