'use strict';

const Hapi = require('hapi');
const Path = require('path');

var EventEmitter = require('events');
var notifier = new EventEmitter();

const initializeRoutes = require('./app/routes/apiRoutes');

//const Pug = require('pug');

// Create a server with a host and port
const server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: Path.join(__dirname, 'public')
            }
        }
    }
});

server.connection({ 
    host: 'localhost', 
    port: 8000 
});

var initializeDB = require('./app/db/db');
initializeDB();

var io = require('socket.io')(server.listener);

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});


const rootHandler = function (request, reply) {
    reply.view('list', {
        // title: 'examples/views/pug/index.js | Hapi ' + request.server.version,
        // message: 'Index - Hello World!'
    });
};

server.register(require('vision'), (err) => {

    if (err) {
        console.log("Failed to load vision.");
    }

    server.views({
        engines: { pug: require('pug') },
        path: __dirname + '/views',
        compileOptions: {
            pretty: true
        }
    });

    server.route({ method: 'GET', path: '/', handler: rootHandler });
    
    
});

initializeRoutes(server, io);


// Add the route
server.route({
    method: 'GET',
    path:'/hello', 
    handler: function (request, reply) {

        return reply('hello world');
    }
});

// loas all files in folder public
server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
    });
});

// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});