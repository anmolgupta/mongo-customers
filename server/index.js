'use strict';
/* global require*/
/* global process, console, authenticated */
/* jshint node: true, quotmark: false */
var express = require('express');
var http = require('http');
var app = express();
var config = require('./config.js');
var bodyParser = require('body-parser');

app.use(require('morgan')('dev'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use('/customers', require('./routes/customer.js'));

http.createServer(app).listen(config.port);