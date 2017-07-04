
// Module dependencies
const express = require('express');
const router = express.Router();
const passport = require('passport'); // Password authentication
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Admin = mongoose.model('Admin');
const Client = mongoose.model('Client');
const Trainer = mongoose.model('Trainer');
const Sport = mongoose.model('Sport');

// Create new user
router.post('/', function(req, res, next) {
	let user;
	let userData = req.body.user;
	console.log(req.body);

	// Create the correct type of user
	if (userData.usertype === 'admin') {
		console.log('creating an admin');
		user = new Admin();
	} else if (userData.usertype === 'client') {
		console.log('creating a client');
		user = new Client();
		user.zipcode = userData.zipcode;
	} else if (userData.usertype === 'trainer') {
		console.log('creating a trainer');
		user = new Trainer();
		user.contact.phone = userData.phone;
	}

	// Add general data
	if (user) {
		user.contact.email = userData.email;
		user.contact.firstname = userData.firstname;
		user.contact.lastname = userData.lastname;
		user.setPassword(userData.password);
	}

	console.log(user);

	user.save().then(function() {
		console.log('user saved!');
		return res.json({ user: user.toAuthJSON() });
	}).catch(next);
});

// Retrieve a user
router.get('/', auth.required, function(req, res, next) {
	User.findById(req.payload.id).then(function(user) {
		if (!user) { return res.sendStatus(401); }

		return res.json({ user: user.toAuthJSON() })
	}).catch(next);
});

// Retrieve all users
// router.get('/', auth.required, function(req, res, next) {
// 	User.find().then(function(users) {
// 		if (!users) { return res.sendStatus(401); }
//
// 		return res.json({ users: toAuthJSON(users) });
// 	}).catch(next);
//
// 	function toAuthJSON(users) {
// 		for (let i = 0; i < users.length; i++) {
// 			users[i] = users[i].toAuthJSON();
// 		}
// 		return users;
// 	}
// });

// Update a user
router.put('/', auth.required, function(req, res, next) {
	User.findById(req.payload.id).then(function(user) {
		if (!user) { return res.sendStatus(401); }

		let userData = req.body.user;

		// Only update fields that were actually passed
		if (typeof userData.password !== 'undefined') {
			user.setPassword(req.body.password);
		}
		if (typeof userData.contact !== 'undefined') {
			user.contact = req.body.contact;
		}
		if (typeof userData.profiles !== 'undefined') {
			user.profiles = req.body.profiles;
		}

		return user.save().then(function() {
			return res.json({ user: user.toAuthJSON() });
		});
	}).catch(next);
});

// Log in a user
router.post('/login', function(req, res, next) {
	if (!req.body.user.email) {
		return res.status(422).json({ errors: { email: "can't be blank" } });
	}
	if (!req.body.user.password) {
		return res.status(422).json({ errors: { password: "can't be blank" } });
	}

	passport.authenticate('local', { session: false }, function(err, user, info) {
		if (err) { return next(err); }
		if (!user) {
			return res.status(422).json(info);
		}

		// Success
		user.token = user.generateJWT();
		return res.json({ user: user.toAuthJSON() });
	})(req, res, next);
});

module.exports = router;
