// Dependencies
var express = require('express');
var router = express.Router();

// Models

var Clients = require('../models/clients');
var Employee = require('../models/employee');
var Product = require('../models/visits');


// Routes
Clients.methods(['get', 'put', 'post', 'delete']);
Clients.register(router, '/clients');

Employee.methods(['get', 'put', 'post', 'delete']);
Employee.register(router, '/employee');

Product.methods(['get', 'put', 'post', 'delete']);
Product.register(router, '/visits');



// Return Router
module.exports = router;