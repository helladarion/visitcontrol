// Dependencies
var express = require('express');
var app = express();
var cors = require('cors');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// MongoDB
mongoose.connect('mongodb://kingit.ddnsking.com/kingit', { user: 'kingit', pass: 'MK1m0n00$'});

// Express
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Allow Cross Origin
app.get('/api', function(req, res, next){
	res.json({msg: "This is CORS-enabled fo all origins"});
});

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", "*");
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
// 	next();
// });

// Routes
app.use('/api', require('./routes/api'));

// Start Server
app.listen(1113);
console.log('API is running on port 1113');