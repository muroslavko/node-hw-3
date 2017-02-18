const mongoose = require('mongoose');
const config = require('../../config/');

mongoose.Promise = global.Promise;

const db = () => {
	mongoose.connect(config.db.uri, config.db.opts);

	mongoose.set('debug', true);
	
	mongoose.connection.on('connected',  () => {
		this.state = 'connected';
			console.log('Mongoose default connection open to ' + config.db.uri);
	});

	mongoose.connection.on('error', (err) => {
		this.state = 'disconnected';
		console.log('Mongoose default connection error: ' + err);
	});

	mongoose.connection.on('disconnected',  () => {
		this.state = 'disconnected';
		console.log('Mongoose default connection disconnected');
	});

	process.on('SIGINT', () => {
		mongoose.connection.close( () => {
			this.state = 'disconnected';
			console.log('Mongoose default connection disconnected through app termination');
			process.exit(0);
		});
	});

}

module.exports = db;
