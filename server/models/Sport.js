
// Module dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

// Schema
const SportSchemaOptions = { timestamps: true };

const SportSchema = new Schema({
    sport: { type: String, required: [true, "can't be blank"], unique: true },
	trainers: [{ type: ObjectId, ref: 'User' }]
}, SportSchemaOptions);

SportSchema.methods.addTrainer = function(id) {
	if (this.trainers.indexOf(id) === -1) {
		this.trainers.push(id);
	}
	return this.save();
};

SportSchema.methods.removeTrainer = function(id) {
	this.trainers.remove(id);
	return this.save();
};

// Set mongoose model
mongoose.model('Sport', SportSchema);
