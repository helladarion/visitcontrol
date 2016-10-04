// Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

// Schema
var visitSchema = new mongoose.Schema({
	clientID: 		String,
	employee: 		String,
	month: 			Number,
	day: 			Number,
	year: 			Number,
	startHour: 		Number, // stores the value in minutes
	finishHour: 	Number  // stores the value in minutes
	

});

// Return Model
module.exports = restful.model('Visits', visitSchema);