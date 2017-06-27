
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const User = mongoose.model('User');

// Schema
const AdminSchema = new Schema({
	actions: [{
		date: { type: Date, required: [true, "can't be blank"], default: Date.now },
	    message: { type: String, required: [true, "can't be blank"], default: '' }
	}]
});

// JSONify admin data for auth
AdminSchema.methods.toAuthJSON = function() {
	return {
		token: this.generateJWT(),
		contact: this.contact,
		actions: this.actions
	};
};

AdminSchema.methods.logAction = function(action) {
	this.actions.push(action);
	return this.save();
};

// Set mongoose model
User.discriminator('admin', AdminSchema);
