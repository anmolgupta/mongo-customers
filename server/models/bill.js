 'use strict';
 /* global require,module */
 /* node:true,quotmark:false */
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;
var config = require('../config.js');

var connection = mongoose.createConnection(config.mongo.db);

var billsSchema = new Schema({
  billNumber:  Number,
  billDate:Date,
  items:  [{name:String, quantity:Number, rate:Number}],
  discount: Number,
  tax: Number,
  customerId: String
}, {minimize:false});

var Bills = connection.model('bills', billsSchema);


module.exports = Bills;