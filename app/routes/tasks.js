const taskService = require('../entities/task/taskService');

const tasks = (server, socketIO) => {

	/* GET listing. */
	server.route({
		method: 'GET',
		path: '/task',
		handler: function (request, reply) {
			taskService.getAllTasks().then((tasks) => {
				reply(tasks);
			}).catch((err) => {
				reply.status(400);
			});
		}
	});

	server.route({
		method: 'GET',
		path: '/task/{id}',
		handler: function (request, reply) {
			taskService.getTaskById(request.params.id).then((task) => {
				reply(task);
			}).catch((err) => {
				reply.status(400);
			});
		}
	});

	server.route({
		method: 'POST',
		path: '/task/',
		handler: function (request, reply) {
			taskService.addTask(request.payload).then((task) => {
				socketIO.emit("tasks-changed");
				reply(task);
			}).catch((err) => {
				reply.status(403);
			});
		}
	});

	server.route({
		method: 'DELETE',
		path: '/task/{id}',
		handler: function (request, reply) {
			taskService.deleteTask(request.params.id).then((task) => {
				socketIO.emit("tasks-changed");
				reply.status(200);
			}).catch((err) => {
				reply.status(403);
			});
		}
	});

	server.route({
		method: 'PUT',
		path: '/task/{id}',
		handler: function (request, reply) {
			taskService.editTask(request.params.id, request.payload).then((task) => {
				socketIO.emit("tasks-changed");
				reply.status(200);
			}).catch((err) => {
				reply.status(403);
			});
		}
	});
}

module.exports = tasks;
