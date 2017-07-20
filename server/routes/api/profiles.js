
// Dependencies
const express = require('express');
const router = express.Router();
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const User = mongoose.model('User');
const TrainerProfile = mongoose.model('TrainerProfile');

// Preload user profile object
router.param('userId', function(req, res, next, id) {
	User.findById(id).then(function(user) {
		if (!user) { return res.sendStatus(404); }

		req.profile = user;

		return next();
	}).catch(next);
});

// Trainer search
router.get('/trainers', auth.optional, function(req, res, next) {
    var searchParams = req.body;

	// Edit our search params
	searchParams.sport = searchParams.sport.toLowerCase();
	searchParams.lat = parseFloat(searchParams.lat);
	searchParams.long = parseFloat(searchParams.long);
    searchParams.searchDistance = 100; // miles

    Trainer.aggregate([
        { $geoNear: { // calculates and sorts by distance
            query: {
                usertype: 'Trainer', // trainers only
				approved: true, // Approved only
                'profiles.sport': searchParams.sport // trainers who train this sport only
            },
            near: {
                type: 'Point', // 2dsphere
                coordinates: [ searchParams.long, searchParams.lat ] // long, lat coordinates to start search at
            },
            maxDistance: searchParams.searchDistance * 1.609 * 1000, // m = miles * 1.609 km/mile * 1000 m/km
            distanceMultiplier: 1 * 0.621 * 0.001, // miles = m * 0.621 mile/km * 0.001 km/m
            distanceField: 'dist.calculated', // field to assign distance result
            includeLocs: 'dist.location', // field to assign location result
            limit: 10, // limit
            spherical: true // 2dsphere calculations
        }}
		// ,
        // { $project: { // Choose which data fields make it through
        //     accounts: 0 // we don't want account (login) info
        // }},
        // { $group: { // Group
        //     _id: null, // Don't group by anything
        //     count: { $sum: 1 }, // Keep a count
        //     trainers: { $push: "$$ROOT" } // Keep all trainer data
        // }},
    ]).then(function(trainers) {
		if (req.payload) {
			User.findById(req.payload.id).then(function(user) {
				if (!user) { return res.json({ trainers: toProfileJSONFor(false, trainers) }); }

				return res.json({ trainers: toProfileJSONFor(user, trainers) });
			});
		} else {
			return res.json({ trainers: toProfileJSONFor(false, trainers) });
		}
		return res.json(trainers);
	}).catch(next);

	function toProfileJSONFor(user, trainers) {
		for (let i = 0; i < trainers.length; i++) {
			trainers[i] = trainers[i].toProfileJSONFor(user);
		}
		return trainers;
	}
});

router.get('/trainer/:userId', auth.optional, function(req, res, next) {
	if (req.profile.usertype === 'Trainer') {
		if (req.payload) {
			User.findById(req.payload.id).then(function(user) {
				if (!user) { return res.json({ profile: req.profile.toProfileJSONFor(false) }); }

				return res.json({ profile: req.profile.toProfileJSONFor(user) });
			});
		} else {
			return res.json({ profile: req.profile.toProfileJSONFor(false) });
		}
	} else {
		return res.sendStatus(401);
	}
});

router.post('/trainer', auth.required, function(req, res, next) {
	User.findById(req.payload.id).then(function(user) {
		if (!user || user.usertype !== 'Trainer') { return res.sendStatus(401); }

		const profile = new TrainerProfile(req.body.profile);

		profile.trainer = user;

		return profile.save().then(function() {
			user.completed_app = true;

			return user.addProfile(profile).then(function() {
				return res.json({ profile: profile });
			});
		});
	}).catch(next);
});

router.delete('/trainer/:userId/unsave', auth.required, function(req, res, next) {
	const profileId = req.profile._id;

	User.findById(req.payload.id).then(function(user) {
		if (!user || user.usertype !== 'Client') { return res.sendStatus(401); }

		return user.unsaveTrainer(profileId).then(function() {
			return res.json({ profile: req.profile.toProfileJSONFor(user) });
		});
	}).catch(next);
});

router.get('/client/:userId', auth.required, function(req, res, next) {
	if (req.profile.usertype === 'Client') {
		return res.json({ profile: req.user.toProfileJSON() });
	} else {
		return res.sendStatus(401);
	}
});

module.exports = router;
