 'use strict';
 /* global require,module,console */
 /* node:true,quotmark:false */
 var express = require('express');
 var winston = require('winston');
 var q = require('q');
 var appRouter = express.Router();
 var Customer = require('../models/customer.js');
 var Bill = require('../models/bill.js');

 appRouter.get('/', (req, res) => {

 	var customerPromise = Customer.find({}).exec();

 	var group = {
 		$group: {
 			_id: '$customerId',
 			dateTimestamp: {
 				$max: '$dateTimeStamp'
 			},
 			latest: {
 				$last: "$$CURRENT"
 			}
 		}
 	};

 	var project = {
 		$project: display
 	};

 	var query = [group, project];

 	var billPromise = Bill.aggregate(query).exec();

 	q.all([billPromise, customerPromise]).then((results) => {

 		console.log(results);
 		res.send();

 	}, (err) => {
 		winston.error(err);
 		return res.status(500).send(err);
 	});
 });

 module.exports = appRouter;