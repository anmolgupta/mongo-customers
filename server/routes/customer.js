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

 	if(req.query.name){
 		query.name = new RegExp('.*' + req.query.name + '.*', 'i');
 	}
 	if(req.query.mobile){
 		query.mobile = new RegExp('.*' + req.query.mobile + '.*', 'i');
 	}
 	if(req.query.phone){
 		query.mobile = new RegExp('.*' + req.query.phone + '.*', 'i');
 	}
 	if(req.query.limit){
 		limit = req.query.limit;
 	}
 	if(req.query.skip){
 		skip = req.query.skip;
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

 	Customer.create(req.body).then((customer) => {

 		return res.send(customer.toJSON());

 	}, (err) => {
 		winston.error(err);
 		return res.status(500).send(err);

 	});

 });


 appRouter.put('/', (req, res) => {
 	var customer = req.body;

 	Customer.update({
 			_id: customer.id
 		}, customer).exec()
 		.then(() => {
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