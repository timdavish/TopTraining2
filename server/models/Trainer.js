
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = mongoose.model('User');

// Schema
const options = {
	discriminatorKey: 'usertype',
	timestamps: true
};

const TrainerSchema = new Schema({
	completed_app: { type: Boolean, required: true, default: false },
	profiles: [{ type: ObjectId, ref: 'TrainerProfile' }],
	rating: {
		average: { type: Number, required: [true, "can't be blank"], default: 0	},
		count: { type: Number, required: [true, "can't be blank"], default: 0 },
		reviews: [{
			author: { type: String, required: [true, "can't be blank"] },
			rating: { type: Number, required: [true, "can't be blank"], enum: [1, 2, 3, 4, 5], default: 5 },
			date: { type: Date, required: [true, "can't be blank"], default: Date.now },
			type: { type: String, required: [true, "can't be blank"], enum: ['Verified Purchase', 'Client', 'Testimonial'], default: 'Client' },
			content: { type: String }
		}]
	}
}, options);

// Index our searchable locations
TrainerSchema.index({"profiles.locations.geometry": "2dsphere"});

// JSONify trainer data for admin
TrainerSchema.methods.toAdminJSON = function(user) {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		completed_app: this.completed_app,
		profiles: this.profiles.map(function(profile) { console.log(profile.toJSON()); return profile.toJSON(); }),
		rating: this.rating,
		updatedAt: this.updatedAt,
		createdAt: this.createdAt
	};
};

// JSONify trainer data for auth
TrainerSchema.methods.toAuthJSON = function() {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		completed_app: this.completed_app,
		profiles: this.profiles.map(function(profile) { return profile.toJSON(); }),
		rating: this.rating
	};
};

// JSONify trainer data for profile
TrainerSchema.methods.toProfileJSON = function() {
	return {
		contact: this.contact,
		profiles: this.profiles.map(function(profile) { return profile.toJSON(); }),
		rating: this.rating
	};
};

// Add a new trainer profile
TrainerSchema.methods.addProfile = function(profile) {
	if (this.profiles.find(p => { return p.sport === profile.sport; }) === undefined) {
		this.profiles.push(profile);
	}
	return this.save();
};

// Remove a trainer profile
TrainerSchema.methods.removeProfile = function(sport) {
	this.profiles = this.profiles.filter(p => { return p.sport !== sport; });
	return this.save();
};

// Set mongoose model
User.discriminator('Trainer', TrainerSchema);
