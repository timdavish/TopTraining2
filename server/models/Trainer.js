
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
	approved: { type: Boolean, required: [true, "can't be blank"], default: false },
	profiles: [{
		sport: { type: String, required: [true, "can't be blank"], lowercase: true },
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
			sessions: { type: Number, lowercase: true, enum: [1, 2, 5, 10], default: 1 },
			length: { type: String, required: [true, "can't be blank"], lowercase: true, default: '1 hour' },
			price: { type: Number, required: [true, "can't be blank"], default: 0 }
		}],
		summary: { type: String },
		credentials: {
			experience: { type: Number },
			school: { type: String }
		},
		services: {
			ages: [{ type: String }],
			positions: [{ type: String }],
			specialties: [{ type: String }]
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

// Switch a trainer's approval
TrainerSchema.methods.flipApproved = function() {
	this.approved = !this.approved;
	return this.save();
};

// Set mongoose model
User.discriminator('Trainer', TrainerSchema);
