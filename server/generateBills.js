'use strict';
/* global require*/
/* global process, console, authenticated */
/* jshint node: true, quotmark: false */

var Customers = require('./models/customer.js');
var Bills = require('./models/bill.js');
var q = require('q');
var winston = require('winston');
var currentTimestamp = new Date().getTime();
var previousTimestamp = currentTimestamp - (1000 * 60 * 60 * 24 * 365);

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomNumber(len) {
	return parseInt((Math.random() * 10000) % len);
}

function getCustomers() {

	return new Promise((resolve, reject) => {
		Customers.find({}).select({
			_id: 1
		}).exec().then((results) => {
			resolve(results);
		}, (err) => {
			reject(err);
		});
	});
}

function getRandomAlphabets(length){

    var candidates = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";

    var result = '';
    for (var i = length; i > 0; --i) {
        result += candidates[Math.floor(Math.random() * candidates.length)];
    }

    return result;

}

function getItems() {
	var items = [];
	for (let i = 1; i <= 10; i++) {

		var item = {
			name: getRandomAlphabets(getRandomNumber(10)+1),
			quantity: getRandomNumber(10) + 1,
			rate: getRandomNumber(1000) + 1
		};

		items.push(item);
	}

	return items;
}

getCustomers.then(function(customers) {
	if (!customers.length) {
		return;
	}

	var ps = [];

	for (let i = 1; i <= 10000; i++) {

		var items = getItems();

		var bill = {
			billNumber: i,
			billDate: new Date(getRandomInt(previousTimestamp, currentTimestamp)),
			discount: getRandomNumber(70) + 1,
			items: items,
			tax: getRandomNumber(30) + 1,
			customerId: customers[getRandomNumber(customers.length)]._id
		};

		ps.push(Bills.create(bill));
	}
	return q.allSettled(ps);

}).then(function(results) {

	for (let result in results) {
		if (result.state !== "fulfilled") {
			winston.error(result.reason);
		}
	}
}).finally(function() {
	process.exit();
});