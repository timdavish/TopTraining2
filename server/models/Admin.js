
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

const AdminSchema = new Schema({
	actions: [{
		date: { type: Date, required: [true, "can't be blank"], default: Date.now },
	    message: { type: String, required: [true, "can't be blank"], default: '' }
	}]
}, options);

// JSONify admin data for admin
AdminSchema.methods.toAdminJSON = function(user) {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		actions: this.actions,
		updatedAt: this.updatedAt,
		createdAt: this.createdAt
	};
};

// JSONify admin data for auth
AdminSchema.methods.toAuthJSON = function() {
	return {
		id: this._id,
		token: this.generateJWT(),
		usertype: this.usertype,
		contact: this.contact,
		actions: this.actions
	};
};

AdminSchema.methods.logAction = function(action) {
	this.actions.push(action);
	return this.save();
};

// Set mongoose model
User.discriminator('Admin', AdminSchema);
