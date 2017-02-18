const taskRepository = require('./taskRepository');

class TaskService {

	getAllTasks(){
		return taskRepository.findAll();
	}

	getTaskById(id){
		return taskRepository.findById(id);
	}

	editTask(id, task){
		if(checkText(task.text)) {
			return Promise.reject(new Error('wrong words'));
		}
		return taskRepository.update({_id: id}, task);
	}

	deleteTask(id){
		return taskRepository.delete({_id: id});
	}

	addTask(task){
		var d = new Date();
		task.date = d.toLocaleDateString();

		if(checkText(task.text)) {
			return Promise.reject(new Error('wrong words'));
		}
		return taskRepository.add(task);
	}
}


function checkText(text) {
	if(text && text.toLowerCase().indexOf('зрада') >= 0) {
		return true;
	} else {
		return false;
	}
}

module.exports = new TaskService();