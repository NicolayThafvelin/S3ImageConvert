#! /usr/bin/env node

'use strict';
var config = require('./config');
try {
    var localConfig = require('./localConfig');
    for (var key in localConfig) {
        config[key] = localConfig[key];
    }
} catch (e) {}

global.serverConfig = config;

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
    service: serverConfig.emailService,
    auth: serverConfig.emailAuth
});
var errorHandler = errormailer(mailTransport, serverConfig.emailSettings);

var app = connect()
    .use(morgan('dev'))
    // parsing the querystring
    .use(function query(req, res, next) {
        if (!req.query) {
            var parsedUrl = url.parse(req.url, true);
            req.query = parsedUrl.query;
            req.path = decodeURI(parsedUrl.pathname).replace(/\+/g,' ').replace(/%2B/g, '+');
            req.search = parsedUrl.search;
        }

        next();
    })
    .use(function(req, res, next){
        if(req.path === '/health') {
            res.statusCode = 200;
            res.end();
        }else{
            next();
        }
    })
    //Image middleware
    .use(imageMiddleware)
    // sending emails in case of errors
    .use(errorHandler);
// .listen(process.env.PORT || 3333);

http.createServer(app).listen(serverConfig.port || 3000);
console.info('Server running on: localhost:' + serverConfig.port || 3000);