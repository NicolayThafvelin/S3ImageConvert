var util = require("util");
var crypto = require("crypto");

const IMAGE_FORMATS = {
    "image/svg": "svg",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif"
};
const SIZES = [
    128,
    256,
    512,
    1024,
    2048
];


module.exports = ImageModel;

function ImageModel(originalBucket, originalKey, width, height) {
    this.originalBucket = originalBucket;
    this.originalKey = originalKey;
    this.width = width || 0;
    this.height = height || 0;
    this.headers = {
        'Cache-Control': 'max-age=31556926'
            // 'Content-Type': res.ContentType,
            // 'Last-Modified': res.LastModified, max-age=31556926'
    }

    var size = Math.max(width, height);
    var i = 0,
        len = SIZES.length - 1;
    for (; i < len; i++) {
        if (SIZES[i] > size) break;
    }
    this.size = SIZES[i];
}
ImageModel.prototype = {
    getOriginalKey: function() {
        return this.originalKey;
    },

    getNewKey: function() {
        var shasum = crypto.createHash('sha1');
        shasum.update(this.originalKey + '-' + this.size);
        return shasum.digest("hex");
    },

    setHeaders: function(s3Object) {
        // 'Cache-Control': res.CacheControl,
        // 'Content-Length': res.ContentLength,
        // 'Content-Type': res.ContentType,
        // 'Last-Modified': res.LastModified,
        this.type = IMAGE_FORMATS[s3Object.ContentType];
        this.headers['Content-Type'] = s3Object.ContentType;
        this.headers['Last-Modified'] = s3Object.LastModified;
        this.headers['Content-Length'] = s3Object.ContentLength;
    },

    getHeaders: function() {
        if (this.stream && this.stream.length) {
            this.headers['Content-Length'] = this.stream.length;
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
    
    toString : function(){
        return this.originalBucket+'/'+this.originalKey+' - '+this.size;
    }
};