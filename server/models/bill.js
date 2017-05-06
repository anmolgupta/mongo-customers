 'use strict';
 /* global require,module */
 /* node:true,quotmark:false */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config.js');

var connection = mongoose.createConnection(config.mongo.db);

var billsSchema = new Schema({
  billNumber:  Number,
  billDate:Date,
  items:  [{name:String, quantity:Number, Rate:Number}],
  discount: Number,
  tax: Number,
  customerId: String
}, {minimize:false});

var Bills = connection.model('customer', billsSchema);


module.exports = Bills;