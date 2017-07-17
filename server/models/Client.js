
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = mongoose.model('User');

// Schema
const ClientSchema = new Schema({
	activeSessions: [{
		trainer: { type: ObjectId, ref: 'User' },
		sport: { type: String },
		count: { type: Number, enum: [1, 2, 5, 10], default: 1 },
		left: { type: Number },
		price: { type: Number },
		purchaseDate: { type: Date, default: Date.now },
		expireDate: { type: Date }
	}],
	savedTrainers: [{ type: ObjectId, ref: 'User' }]
});

// JSONify client data for admin
ClientSchema.methods.toAdminJSON = function(user) {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		zipcode: this.zipcode,
		activeSessions: this.activeSessions,
		savedTrainers: this.savedTrainers,
		updatedAt: this.updatedAt,
		createdAt: this.createdAt
	};
};

// JSONify client data for auth
ClientSchema.methods.toAuthJSON = function() {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		zipcode: this.zipcode,
		activeSessions: this.activeSessions,
		savedTrainers: this.savedTrainers
	};
};

// JSONify client data for profile viewed by user
ClientSchema.methods.toProfileJSON = function() {
	return {
		contact: this.contact,
		zipcode: this.zipcode,
		activeSessions: this.activeSessions,
		savedTrainers: this.savedTrainers
	};
};

// Save a trainer
ClientSchema.methods.saveTrainer = function(id) {
	if (this.savedTrainers.indexOf(id) === -1) {
		this.savedTrainers.push(id);
	}
	return this.save();
}

// Unsave a trainer
ClientSchema.methods.unsaveTrainer = function(id) {
	this.savedTrainers.remove(id);
	return this.save();
}

// Set mongoose model
User.discriminator('Client', ClientSchema);
