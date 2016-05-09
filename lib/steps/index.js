['headers', 'cached', 'download', 'processor', 'server', 'uploader'].forEach(function(step) {
    module.exports[step] = require("./" + step);
});