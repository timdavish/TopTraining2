
// Dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;
const uniqueValidator = require('mongoose-unique-validator');
const crypto = require('crypto'); // Used for generating password hash
const jwt = require('jsonwebtoken'); // Used for generating tokens
const secret = require('../config').secret;

// Schema
const options = {
	discriminatorKey: 'usertype',
	timestamps: true
};

const UserSchema = new Schema({
    contact: {
        email: { type: String, required: [true, "can't be blank"], unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
        phone: { type: String, match: [/^\(?\d{3}\)?-?\d{3}-?\d{4}$/, 'is invalid'] },
        firstname: { type: String, required: [true, "can't be blank"] },
        lastname: { type: String, required: [true, "can't be blank"] }
    },
    accounts: {
        local: {
            hash: { type: String },
            salt: { type: String }
        },
        facebook: {}
    }
}, options);

UserSchema.plugin(uniqueValidator, { message: 'is already taken' });

// Set a hashed password using a crypto salt
UserSchema.methods.setPassword = function(password) {
    this.accounts.local.salt = crypto.randomBytes(16).toString('hex');
    this.accounts.local.hash = crypto.pbkdf2Sync(password, this.accounts.local.salt, 10000, 512, 'sha512').toString('hex');
};

// Validate a password using the crypto salt
UserSchema.methods.validPassword = function(password) {
    const hash = crypto.pbkdf2Sync(password, this.accounts.local.salt, 10000, 512, 'sha512').toString('hex');
    return this.accounts.local.hash === hash;
};

// Generate a JWT
UserSchema.methods.generateJWT = function() {
    // Set token experation (14 days)
    const today = new Date();
    const exp = new Date(today);
    exp.setDate(today.getDate() + 14);

    return jwt.sign({
        id: this._id,
		usertype: this.usertype,
        exp: parseInt(exp.getTime() / 1000)
    }, secret);
};

// Set mongoose model
mongoose.model('User', UserSchema);
