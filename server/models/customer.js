 'use strict';
 /* global require,module */
 /* node:true,quotmark:false */
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;
var Schema = mongoose.Schema;
var config = require('../config.js');

var connection = mongoose.createConnection(config.mongo.db);

var customerSchema = new Schema({
  name:  String,
  mobile: String,
  phone:   String,
  address: [{ flat: String,street:String, state:String, pincode: String }],
  dob: { type: Date},
  email: String
}, {minimize:false});

var Customer = connection.model('customer', customerSchema);


module.exports = Customer;

