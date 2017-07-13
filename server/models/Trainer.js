
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
	profiles: [{
		sport: { type: String, required: [true, "can't be blank"], lowercase: true },
		completed: { type: Boolean, required: true, default: false },
		approved: { type: Boolean, required: true, default: false },
		image: { type: String },
		locations: [{
			priority: { type: Number, required: [true, "can't be blank"], default: 1 },
			formatted_address: { type: String, required: [true, "can't be blank"] },
			geometry: {
				type: { type: String, required: [true, "can't be blank"], enum: 'Point', default: 'Point' },
				coordinates: { type: [Number], required: [true, "can't be blank"], default: [-122.3, 47.6] }
			}
		}],
		packages: [{
			type: { type: String, required: [true, "can't be blank"], lowercase: true, enum: ['private', 'small', 'large'] },
			sessions: { type: Number, enum: [1, 2, 5, 10], default: 1 },
			length: { type: Number, default: '60' },
			price: { type: Number, default: 0 }
		}],
		summary: { type: String },
		credentials: {
			experience: { type: String },
			school: { type: String }
		},
		services: {
			ages: [{ name: { type: String }, selected: { type: Boolean } }],
			positions: { type: String },
			specialties: { type: String }
		}
	}],
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

// JSONify trainer data for auth
TrainerSchema.methods.toAuthJSON = function() {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		approved: this.approved,
		profiles: this.profiles,
		rating: this.rating
	};
};

// JSONify trainer data for profile viewed by user
TrainerSchema.methods.toProfileJSONFor = function(user) {
	return {
		contact: this.contact,
		profiles: this.profiles,
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

// Switch a trainer's approval
TrainerSchema.methods.flipApproved = function(sport) {
	const profile = this.profiles.find(p => { return p.sport === sport; });
	profile.approved = !profile.approved;
	return this.save();
};

// Set mongoose model
User.discriminator('Trainer', TrainerSchema);
