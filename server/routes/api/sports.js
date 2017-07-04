
// Module dependencies
const express = require('express');
const router = express.Router();
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const Sport = mongoose.model('Sport');

// Create new sport
router.post('/', auth.required, function(req, res, next) {
	let sport = new Sport();

	sport.sport = req.body.sport;

	sport.save().then(function() {
		return res.json({ sport: sport.toJSON() });
	}).catch(next);
});

// Retrieve all sports
router.get('/', auth.optional, function(req, res, next) {
	Sport.find().then(function(sports) {
		if (!sports) { return res.sendStatus(401); }

		return res.json({ sports: toJSON(sports) });
	}).catch(next);

	function toJSON(sports) {
		for (let i = 0; i < sports.length; i++) {
			sports[i] = sports[i].toJSON();
		}
		return sports;
	}
});

module.exports = router;
