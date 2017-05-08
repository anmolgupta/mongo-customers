 'use strict';
 /* global require,module,console */
 /* node:true,quotmark:false */
 var express = require('express');
 var winston = require('winston');
 var q = require('q');
 var _ = require('underscore');
 var appRouter = express.Router();
 var Customer = require('../models/customer.js');
 var Bill = require('../models/bill.js');


 appRouter.get('/', (req, res) => {


 	var group = {
 		$group: {
 			_id: {
 				customerId: '$customerId',
 				_id: "$_id",
 				discount: "$discount",
 				tax: "$tax"
 			},
 			total: {
 				$sum: '$price'
 			}
 		}
 	};

 	var unwind = {
 		$unwind: "$items"
 	};

 	var project = {
 		$project: {
 			_id: 1,
 			customerId: 1,
 			price: {
 				$multiply: ['$items.rate', '$items.quantity']
 			},
 			discount: 1,
 			tax: 1
 		}
 	};

 	var project1 = {
 		$project: {
 			_id: 1,
 			total: 1,
 			discountAmount: {
 				$divide: [{
 					$multiply: ['$total', '$_id.discount']
 				}, 100]
 			}
 		}
 	};

 	var project2 = {

 		$project: {
 			_id: 1,
 			total: 1,
 			discountAmount: 1,
 			taxAmount: {
 				$divide: [{
 					$multiply: ['$discountAmount', '$_id.tax']
 				}, 100]
 			}
 		}
 	};


 	var project3 = {
 		$project: {
 			_id: 1,
 			total: 1,
 			discountAmount: 1,
 			taxAmount: 1,
 			finalTotal: {
 				$subtract: [{
 					$add: ['$total', '$taxAmount']
 				}, '$discountAmount']
 			}
 		}
 	};

 	var group2 = {
 		$group: {
 			_id: '$_id.customerId',
 			total: {
 				$sum: '$finalTotal'
 			},
 			count: {
 				$sum: 1
 			}
 		}
 	};

 	var project4 = {
 		$project: {
 			_id: 1,
 			total: 1,
 			count: 1,
 			avgAmount: {
 				$divide: ['$total', "$count"]
 			}
 		}
 	};

 	var query = [unwind, project, group, project1, project2, project3, group2, project4];

 	var customerPromise = Customer.find({}).exec();
 	var billPromise = Bill.aggregate(query).exec();
 	q.all([customerPromise, billPromise]).then((results) => {

 		var customers = results[0];
 		var bills = results[1];

 		var text = `"Customer Name","Mobile","Phone","Email","NoOfBills","Amount","Avg Amount"\n`;

 		_.each(customers, (customer) =>{

 			var bill = _.findWhere(bills, {_id:""+customer._id}) || {};

 			text+=`"${customer.name}","${customer.mobile}","${customer.phone}","${customer.email}","${bill.count}","${bill.total}","${bill.avgAmount}"\n`;

 		});


 		res.set({
 			"Content-type": "text/csv",
 			"Content-Disposition": "attachment; filename=report.csv"
 		});
 		res.send(text);

 	}, (err) => {
 		winston.error(err);
 		return res.status(500).send(err);
 	});
 });

 module.exports = appRouter;