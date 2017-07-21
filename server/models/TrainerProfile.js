
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const TrainerProfileSchema = new Schema({
	trainer: { type: ObjectId, ref: 'User' },
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
});

// Index our searchable locations
TrainerProfileSchema.index({"locations.geometry": "2dsphere"});

// JSONify profile data for a user
TrainerProfileSchema.methods.toJSONFor = function(user) {
	return {
		id: this._id,
		trainer: this.trainer.toProfileJSONFor(user),
		sport: this.sport,
		completed: this.completed,
		approved: this.approved,
		image: this.image,
		locations: this.locations,
		packages: this.packages,
		summary: this.summary,
		credentials: this.credentials,
		services: this.services,
		// saved: user ? user.isSaved(this._id) : false
	};
};

// JSONify profile data
TrainerProfileSchema.methods.toJSON = function() {
	return {
		id: this._id,
		sport: this.sport,
		completed: this.completed,
		approved: this.approved,
		image: this.image,
		locations: this.locations,
		packages: this.packages,
		summary: this.summary,
		credentials: this.credentials,
		services: this.services
	};
};

// Switch a trainer profile's approval
TrainerProfileSchema.methods.flipApproved = function() {
	this.approved = !this.approved;
	return this.save();
};

// Set mongoose model
mongoose.model('TrainerProfile', TrainerProfileSchema);
