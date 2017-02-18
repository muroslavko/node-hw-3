const tasks = require('./tasks');

const initializeRoutes = (server, socetIO) => {

    tasks(server, socetIO);
}

module.exports = initializeRoutes;