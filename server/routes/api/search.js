
// Module dependencies
const express = require('express');
const router = express.Router();
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Trainer = mongoose.model('Trainer');

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

module.exports = router;
