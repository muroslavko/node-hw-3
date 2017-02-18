const Repository = require('../../common/Repository');
const TaskModel = require('./taskSchema');

class TaskRepository extends Repository{

	constructor(){
		super();
		this.model = TaskModel;
	}

}

module.exports = new TaskRepository();