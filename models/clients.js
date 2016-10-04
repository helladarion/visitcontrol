// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var clientSchema = new mongoose.Schema({
	name: 				String,
	hours: 				Number, //Store in Minutes
	numVisits: 			Number, //Store in Minutes
	contractNumber: 	Number  //Stores the number os the contract or bid/proposal

});

// Return Model
module.exports = restful.model('Clients', clientSchema);