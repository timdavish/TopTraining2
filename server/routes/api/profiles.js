
// Module dependencies
const express = require('express');
const router = express.Router();
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Client = mongoose.model('Client');
const Trainer = mongoose.model('Trainer');

// Preload user profile object
router.param('userId', function(req, res, next, id) {
	User.findById(id).then(function(user) {
		if (!user) { return res.sendStatus(404); }

		req.profile = user;

		return next();
	}).catch(next);
});

router.get('/trainer/:userId', auth.optional, function(req, res, next) {
	if (req.profile.usertype === 'trainer') {
		if (req.payload) {
			User.findById(req.payload.id).then(function(user) {
				if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }

				return res.json({ profile: req.profile.toProfileJSONFor(user) });
			}).catch(next);
		} else {
			return res.json({ profile: req.profile.toProfileJSONFor(false) });
		}
	} else {
		return res.sendStatus(401);
	}
});

router.post('/trainer/:userId/save', auth.required, function(req, res, next) {
	const profileId = req.profile._id;

	User.findById(req.payload.id).then(function(user) {
		if (!user || user.usertype !== 'client') { return res.sendStatus(401); }

		return user.saveTrainer(profileId).then(function() {
			return res.json({ profile: req.profile.toProfileJSONFor(user) });
		});
	}).catch(next);
});

router.delete('/trainer/:userId/unsave', auth.required, function(req, res, next) {
	const profileId = req.profile._id;

	User.findById(req.payload.id).then(function(user) {
		if (!user || user.usertype !== 'client') { return res.sendStatus(401); }

		return user.unsaveTrainer(profileId).then(function() {
			return res.json({ profile: req.profile.toProfileJSONFor(user) });
		});
	}).catch(next);
});

router.get('/client/:userId', auth.required, function(req, res, next) {
	if (req.profile.usertype === 'client') {
		return res.json({ profile: req.user.toProfileJSON() });
	} else {
		return res.sendStatus(401);
	}
});

modules.exports = router;
