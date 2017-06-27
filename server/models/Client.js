
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = mongoose.model('User');

// Schema
const ClientSchema = new Schema({
	zipcode: { type: Number },
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

// JSONify client data for auth
ClientSchema.methods.toAuthJSON = function() {
	return {
		token: this.generateJWT(),
		contact: this.contact,
		zipcode: this.zipcode,
		activeSessions: this.activeSessions,
		savedTrainers: this.savedTrainers
	};
};

// Set mongoose model
User.discriminator('client', ClientSchema);
