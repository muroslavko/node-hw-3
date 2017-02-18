var $$addTask = document.getElementById('add-task');
var $$tasksContainer = document.getElementById('tasks-container');
var $$infoContainer = document.getElementById('info-container');

var socket = io();
socket.on("tasks-changed", function(msg){
	console.log('load tasks');
    getTasks();
});

getTasks();

function getTasks(){
	$$tasksContainer.innerHTML = "";
	fetch('/task').then(function(response) {
		if(response.ok) {
			return response.json();
		} else {
			renderError();
		}
	}).then(function(tasks){
		renderTasks(tasks);
	});
}

bindEventListeners();

function renderError(string = '') {
	var error = document.createElement('div');
	error.innerHTML  = `<h1> error appears when ${string} </h1>`

	$$infoContainer.appendChild(error);
}

function renderTasks(listOfTasks) {
	for (var i = 0; i < listOfTasks.length; i++) {
		$$tasksContainer.appendChild(renderTask(listOfTasks[i]));
	}
}


function renderTask(task = {}) {
	var taskContainer = document.createElement('div');
	taskContainer.className = 'task-container';

	if(task._id){
		taskContainer.id = task._id
		var taskId = document.createElement('a');
		taskId.className = 'task-id';
		taskId.innerText = task._id;
		taskId.href = '/task/' + task._id;
		taskContainer.appendChild(taskId);
	} else {
		var taskId = document.createElement('a');
		taskId.className = 'task-id';
		taskId.innerText = task._id;
		taskContainer.appendChild(taskId);
	}


	var taskText = document.createElement('input');
	taskText.value = task.text || '';
	taskText.className = 'task-text';
	taskContainer.appendChild(taskText);

	var creationDate = document.createElement('input');
	creationDate.value = task.date || 'data not set';
	creationDate.disabled = true;
	creationDate.className = 'task-date';
	taskContainer.appendChild(creationDate);

	var saveTaskButton = document.createElement('button');
	saveTaskButton.innerText = 'Save';
	saveTaskButton.className = 'save-task'
	taskContainer.appendChild(saveTaskButton);

	var deleteTaskButton = document.createElement('button');
	deleteTaskButton.innerText = 'Delete';
	deleteTaskButton.className = 'delete-task'
	taskContainer.appendChild(deleteTaskButton);

	return taskContainer;
}


function bindEventListeners(){

	$$addTask.addEventListener('click', function(){
		$$tasksContainer.appendChild(renderTask());
	});

	document.addEventListener('click', function(event){
		if (event.target.className === 'save-task'){
			var taskContainer = event.target.parentNode;
			var id = taskContainer.id;
			if (id){
				sendEditTaskReq(taskContainer, id).catch(() =>{
					renderError('when edit task');
				});
			} else {
				sendCreateTaskReq(taskContainer).then(function(response){
					if(response.ok) {
						return response.json();
					} 
				}).then((task) => {
					// $$tasksContainer.appendChild(renderTask(task));
					// taskContainer.remove();
				}).catch(function(){
					debugger
					renderError('when create task');
				});
			}
		} else if (event.target.className === 'delete-task'){
			var taskContainer = event.target.parentNode;
			var id = taskContainer.id;
			
			sendDeleteTaskReq(id).then(function(response){
				if(response.ok) {
					return;
				} 
			}).then(function(){
				//taskContainer.remove();
			}).catch(function(){
				renderError('when delete');
			});
		}
	});

}


function sendEditTaskReq(taskContainer, id){
	
	var text = taskContainer.querySelector('.task-text').value;

	return fetch('/task/' + id, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text
		})
	})
}

function sendDeleteTaskReq(id){
	return fetch('/task/' + id, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json'
		}
	})
}

function sendCreateTaskReq(taskContainer){

	var text = taskContainer.querySelector('.task-text').value;

	return fetch('/task/', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			text
		})
	})
}