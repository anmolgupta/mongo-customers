'use strict';
/* global require*/
/* global process, console, authenticated */
/* jshint node: true, quotmark: false */
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var config = require('./config.js');

var bodyParser = require('body-parser');


app.use(require('morgan')('dev'));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public','app')));
app.get("/",function(req, res) {
	console.log("inside index.html");
    res.sendFile(path.join(__dirname,'public','app','index.html'));
}); 

app.use('/customers', require('./routes/customer.js'));
app.use('/customers/bills', require('./routes/customers_bills.js'));

http.createServer(app).listen(config.port);