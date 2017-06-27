
// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var methods = require('methods');
var bodyParser = require('body-parser');
var session = require('express-session');
var cors = require('cors');
var passport = require('passport');
var errorhandler = require('errorhandler');
var mongoose = require('mongoose');

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

// Use errorhandler in development
if (!isProduction) {
	app.use(errorhandler());
}

// Connect to our mongodb
if (isProduction) {
	mongoose.connect(process.env.MONGODB_URI);
} else {
	mongoose.connect('mongodb://localhost/TT');
	mongoose.set('debug', true);
}

// require('./config/passport');
// require('./models/User');
// require('./models/Article');
// require('./models/Comment');

app.use(require('./routes'));

// Catch 404 and forward to a error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// Error handlers
if (isProduction) {
	// Production error handler (no stacktraces leaked to user)
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.json({'errors': {
			message: err.message,
			error: {}
		}});
	});
} else {
	// Development error handler (prints stacktrace)
	app.use(function(err, req, res, next) {
		console.log(err.stack);

		res.status(err.status || 500);
		res.json({'errors': {
			message: err.message,
			error: err
		}});
	});
}

// Start server
var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});
