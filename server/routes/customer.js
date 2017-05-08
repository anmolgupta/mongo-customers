 'use strict';
 /* global require,module,console */
 /* node:true,quotmark:false */
 var express = require('express');
 var winston = require('winston');
 var appRouter = express.Router();
 var Customer = require('../models/customer.js');

 appRouter.post('/query', (req, res) => {

 	var skip = 0;
 	var limit = 20;
 	var query = {};
 	var body = req.body;

 	if(body.name){
 		query.name = new RegExp('.*' + body.name + '.*', 'i');
 	}
 	if(body.mobile){
 		query.mobile = new RegExp('.*' + body.mobile + '.*', 'i');
 	}
 	if(body.phone){
 		query.mobile = new RegExp('.*' + body.phone + '.*', 'i');
 	}
 	if(body.limit){
 		limit = body.limit;
 	}
 	if(body.offset){
 		skip = body.offset;
 	}

 	//TODO:: Address and DOB

 	Customer.find(query).sort({_id:-1}).limit(limit).skip(skip).exec().then((results)=>{
 		return res.send(results);
 	}, (err)=>{
 		winston.error(err);
 		return res.status(500).send(err);
 	});
 });

 appRouter.post('/', (req, res) => {

 	Customer.create(req.body).then((customer) => res.send(customer.toJSON()), (err) => {
 		winston.error(err);
 		return res.status(500).send(err);
 	});

 });


 appRouter.put('/', (req, res) => {
 	var customer = req.body;
 	console.log(JSON.stringify(customer));
 	Customer.update({
 			_id: customer._id
 		}, customer).exec()
 		.then((data) => {
 			// returns previous object which is a result of find query
 			return res.send();
 		}, (err) => {
 			winston.error(err);
 			return res.status(500).send(err);
 		});


 });

 appRouter.delete('/', (req, res) => {
 	var id = req.query.id;
 	Customer.remove({
 		_id: id
 	}).then((data) => {
 		//sends 
 		// {
 		//   "ok": 1,
 		//   "n": 1
 		// }
 		res.send(data);
 	}, (err) => {
 		winston.error(err);
 		res.status(500).send(err);
 	});
 });


 module.exports = appRouter;