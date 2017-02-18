const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;

const Task = new mongoose.Schema({
	text: String,
	date: String
});

Task.methods.getViewModel = function(){
	return {
		_id: this._id,
		text: this.text,
		date: this.date
	};
};

module.exports = mongoose.model('Task', Task);