var sharp = require('sharp');
var debug = require('debug')('steps');
var BufferList = require('bl');
var replacestream = require("replacestream");
var zlib = require('zlib');
var SVGO = require('svgo');

module.exports = processor;

function processor(image, cached, download, callback) {
    if (cached || !download) return callback(null, false);

    var outStream = new BufferList(completed);

    if (image.type === 'svg') {

        var re = /<i:pgf[^R]([\s\S])*?<\/i:pgf>/g;
        image.setGzip(true);
        return image.getStream()
            .pipe(replacestream(re, ''))
            .pipe(doSvgo(function(svg) {
                stdout = new BufferList(svg.data);
                stdout.pipe(zlib.createGzip()).pipe(outStream);
            }));
    }


    var size = image.getSize();
    var transformer = sharp()
        .resize(size, size)
        .min()
        .withoutEnlargement();

    if (image.useWebP()) {
        transformer.webp();
    }

    image.getStream().pipe(transformer).pipe(outStream);

    /////////////////////////////

    function completed(err) {
        if (err) {
            debug('Failed conversion of image:' + image.toString() + ' with message:\n' + err);
            return callback(err);
        }

        image.setStream(outStream);
        callback(null, true);
    }

    function onerror(err) {
        if (err) {
            debug('Failed conversion of image:' + image.toString() + ' with message:\n' + err);
        } else {
            debug('Failed conversion of image::' + image.toString() + ' without message');
        }

        done(500);
    }

    //obj.stream.pipe(resizer).pipe(obj.outStream);
}

function doSvgo(callback) {
    var svgo = new SVGO();
    return BufferList(function(err, buf, cb) {
        svgo.optimize(String(buf), callback);
    });
}