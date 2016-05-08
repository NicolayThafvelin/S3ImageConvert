var sharp = require('sharp');
var debug = require('debug')('steps');

module.exports = processor;

function processor(image, cached, download, callback) {
    if (cached || !download) return callback(null, false);
    
    var outStream = new BufferList(completed);
    var size = image.getSize();
    var transformer = sharp()
        .resize(size, size)
        .min();

    image.getStream().pipe(transformer).pipe(outStream);

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