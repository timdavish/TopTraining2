
// Dependencies
const express = require('express');
const http = require('http');
const path = require('path');
const methods = require('methods');
const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const errorhandler = require('errorhandler');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // Adjust mongoose promise

const isProduction = process.env.NODE_ENV === 'production';

require('./models/Sport');
require('./models/User');
require('./models/Admin');
require('./models/Client');
require('./models/Trainer');

require('./config/passport');

// Create global app object
let app = express();

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

app.use(require('./routes'));

// Catch 404 and forward to a error handler
app.use(function(req, res, next) {
	let err = new Error('Not Found');
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
// const httpPort = 3000;
// const httpServer = http.createServer(app);
// httpServer.listen(process.env.PORT || 3000, function() {
// 	console.log('Listening on port ' + httpServer.address().port);
// });
let server = app.listen(process.env.PORT || 3000, function() {
	console.log('Listening on port ' + server.address().port);
});
