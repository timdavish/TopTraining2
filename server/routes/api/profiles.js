
// Dependencies
const express = require('express');
const router = express.Router();
const auth = require('../auth');

// Database interaction
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Trainer = mongoose.model('Trainer');
const TrainerProfile = mongoose.model('TrainerProfile');

// Preload profile objects on routes with ':profile'
router.param('profile', function(req, res, next, id) {
	TrainerProfile.findById(id).populate('trainer').then(function(profile) {
		if (!profile) { return res.sendStatus(404); }

		req.profile = profile;

		return next();
	}).catch(next);
});

// Trainer search
router.get('/trainers', auth.optional, function(req, res, next) {
    const searchParams = req.query;

	const base = [
        { $geoNear: { // calculates and sorts by distance
            query: {
				approved: true, // Approved only
				sport: searchParams.sport.toLowerCase() // profiles with this sport only
			},
            near: {
                type: 'Point', // 2dsphere
                coordinates: [ Number(searchParams.long), Number(searchParams.lat) ] // long, lat coordinates to start search at
            },
            maxDistance: searchParams.distance * 1.609 * 1000, // m = miles * 1.609 km/mile * 1000 m/km
            distanceMultiplier: 1 * 0.621 * 0.001, // miles = m * 0.621 mile/km * 0.001 km/m
            distanceField: 'dist.calculated', // field to assign distance result
            includeLocs: 'dist.location', // field to assign location result
            // limit: searchParams.limit, // limit
            spherical: true // 2dsphere calculations
        }}
    ];
	const profiles = [
		{ $lookup: {
			from: 'users',
			localField: 'trainer',
			foreignField: '_id',
			as: 'trainer'
        }},
        { $project: {
			sport: 1,
			completed: 1,
			approved: 1,
			image: 1,
			locations: 1,
			packages: 1,
			summary: 1,
			credentials: 1,
			services: 1,
			trainer: { $arrayElemAt: ['$trainer', 0] },
			dist: 1
        }},
		{ $skip: Number(searchParams.offset) },
		{ $limit: Number(searchParams.limit) }
	];
	const count = [
		{ $count: 'count' },
		{ $project: {
			count: 1
		}}
	];

	return Promise.all([
		TrainerProfile.aggregate(base.concat(profiles)).exec(),
		TrainerProfile.aggregate(base.concat(count)).exec(),
		req.payload ? User.findById(req.payload.id) : null
	]).then(function(results) {
		const profiles = results[0];
		// Is there a better way to get count from an aggregation?
		const count = results[1][0]['count'];
		const user = results[2];

		return res.json({
			profiles: profiles,
			count: count
		});
	}).catch(next);;
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



// Change a TrainerProfile's approved status
router.put('/approve/:profile/:approve', auth.required, function(req, res, next) {
	req.profile.approved = req.params.approve;
	return req.profile.save().then(function() {
		return res.json({ profile: req.profile.toJSON() });
	}).catch(next);
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
