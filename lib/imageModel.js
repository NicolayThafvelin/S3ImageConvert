var util = require("util");
var crypto = require("crypto");

var IMAGE_FORMATS = {
    "image/svg": "svg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif"
};

module.exports = ImageModel;

function ImageModel(originalBucket, originalKey, size, useWebP) {
    this.originalBucket = originalBucket;
    this.originalKey = originalKey;
    this.useWebP = useWebP;
    this.headers = {
        'Cache-Control': 'max-age=31556926'
    };

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
        shasum.update(this.originalKey + '-' + this.size + (this.useWebP ? '-webp' : ''));
        return shasum.digest("hex");
    },

    setHeaders: function(s3Object) {
        this.type = IMAGE_FORMATS[s3Object.ContentType];
        this.headers['Content-Type'] = s3Object.ContentType;
        this.headers['Last-Modified'] = s3Object.LastModified;
        this.headers['Content-Length'] = s3Object.ContentLength;
    },

    getHeaders: function() {
        if (this.stream && this.stream.length) {
            this.headers['Content-Length'] = this.stream.length;
        }
        if(this.useWebP){
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