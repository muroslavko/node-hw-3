const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

class Repository {

	findWhere(props) {
		const query = this.model.find(props);
		return query.exec();
	}

	findOne(props) {
		const query = this.model.findOne(props);
		return query.exec();
	}

	findById(id) {
		return this.findOne({_id: id});
	}

	findAll() {
		return this.findWhere({});
	}

	findOneAndPopulate(props) {
		const query = this.model.findOne(props);
		for (let i = 0; i < this.fieldsToPopulate.length; i++){
			query.populate(this.fieldsToPopulate[i]);
		}
		return query.exec();
	}

	add(data) {
		return this.model.create(data);
	}

	update(queryObj, obj) {
		var query = this.model.update(queryObj, obj);
		return query.exec();
	}

	findOneAndUpdate(queryObj, body) {
		if (queryObj && queryObj._id){
			queryObj._id = ObjectId(queryObj._id);
		}
		const query = this.model.findOneAndUpdate(queryObj, body);
		return query.exec();
	}

	findAndDelete(queryObj){
		if (queryObj._id){
			queryObj._id = ObjectId(queryObj._id);
		}
		const query = this.model.remove(queryObj);
		return query.exec();
	}

	deleteAll() {
		const query = this.model.remove();
		return query.exec();
	}

	delete(obj) {
		const query = this.model.remove(obj);
		return query.exec();
	}
}

module.exports = Repository;