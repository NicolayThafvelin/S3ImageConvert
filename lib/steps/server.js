module.exports = server;

function server(image, processedImage, res, callback) {
    var stream = image.getStream();
    if (!stream) {
        res.statusCode = 404;
        res.end();
    } else {
        // obj.debug('server...');
        var headers = image.getHeaders();
        // copy the original header to the response
        for (var header in headers) {
            res.setHeader(header, headers[header]);
        }
        stream.pipe(res);
    }

    callback();
}