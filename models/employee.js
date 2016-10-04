// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var employeeSchema = new mongoose.Schema({
	name: 					String,
	username: 				String,
	password: 				String,
	lastLogin: 				String, 
	accessLevel: 			Number // Lvl 0 is full access, lvl 1 for administrative, and lvl2 for simple access

});

// Return Model
module.exports = restful.model('Employee', employeeSchema);