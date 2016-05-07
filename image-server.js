#! /usr/bin/env node
global.serverConfig = require('./config');

'use strict';
const PORT = 5000;
// curl http://localhost:3000//w90/for/http://www.logotypes101.com/logos/755/6C6C997C421ED4073E95E25E43BF51B0/ciaode.png

if (process.env.NEW_RELIC_LICENSE_KEY) {
    require('newrelic');
}


var connect = require("connect");
var imageMiddleware = require("./lib/imageMiddleware");
var errormailer = require("errormailer");
var nodemailer = require("nodemailer");
var morgan = require('morgan');
var http = require('http');
var AWS = require('aws-sdk');
var url = require('url');



var mailTransport = nodemailer.createTransport("SMTP", {
    service: 'Sendgrid', // use well known service
    auth: serverConfig.email
});

var errorHandler = errormailer(mailTransport, {
    from: process.env.ERRORMAIL_FROM,
    to: process.env.ERRORMAIL_TO,
    subject: process.env.ERRORMAIL_SUBJECT
});

var app = connect()
    .use(morgan('dev'))
    // parsing the querystring
    .use(function query(req, res, next) {
        console.log(req.query);
        if (!req.query) {
            var parsedUrl = url.parse(req.url, true);
            req.query = parsedUrl.query;
            req.path = parsedUrl.pathname;
            req.search = parsedUrl.search;
        }

        next();
    });

if (process.env.ENABLE_ERROR_PATH === 'true') {

    // send an email to verify if there is an error
    app.use(function(req, res, next) {
        if (req.url === "/" + (process.env.ERROR_PATH || "test-error")) {
            throw new Error("This is a test");
        }

        next();
    });
}

app
// doing the image magick :)
// every URL request is handled by the middleware
    .use(imageMiddleware)
    // sending emails in case of errors
    .use(errorHandler);
// .listen(process.env.PORT || 3333);

http.createServer(app).listen(3000);