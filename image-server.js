#! /usr/bin/env node
'use strict';

global.serverConfig = require('./config');


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

var mailTransport = nodemailer.createTransport("SMTP", serverConfig.emailTransport);
var errorHandler = errormailer(mailTransport, serverConfig.emailSettings);

var app = connect()
    .use(morgan('dev'))
    // parsing the querystring
    .use(function query(req, res, next) {
        if (!req.query) {
            var parsedUrl = url.parse(req.url, true);
            req.query = parsedUrl.query;
            req.path = parsedUrl.pathname;
            req.search = parsedUrl.search;
        }

        next();
    })
    //Image middleware
    .use(imageMiddleware)
    // sending emails in case of errors
    .use(errorHandler);
// .listen(process.env.PORT || 3333);

http.createServer(app).listen(serverConfig.port);