var spawn = require("child_process").spawn;
var BufferList = require('bl');
var sharp = require('sharp');
var gm = require('gm').subClass({
    imageMagick: true
});

var bufferSettings = {
    bufferStream: true
};

module.exports = processor;

function processor(image, cached, download, callback) {
    if (cached || !download) return callback(null, false);

    var outStream = new BufferList(completed);
    var transformer = sharp()
        .resize(image.getSize())
        .min();
        
    image.getStream().pipe(transformer).pipe(outStream);

    function completed(err) {
        if (err) return callback(err);

        image.setStream(outStream);
        callback(null, true);
    }

    function onerror(err) {
        if (err) {
            debug('Failed conversion of file ' + func.url + ' with message:\n' + err);
        } else {
            debug('Failed conversion of file ' + func.url + ' without message');
        }

        done(500);
    }

    //obj.stream.pipe(resizer).pipe(obj.outStream);
}