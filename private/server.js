'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

server.connection({
    host: 'localhost',
    port: 8000
});

const io = require('socket.io')(server.listener);
const stations = require('./stations');

function handleClient(socket) {
  io.emit('stations.list', stations.list);

  socket.on('station.add', newStation => {
    io.emit('station.added', stations.add(newStation));
  });

  socket.on('station.remove', index => {
    io.emit('station.removed', stations.remove(index));
  });
};

io.on('connection', handleClient);

server.register(require('inert'), (err) => {

    if (err) {
        throw err;
    }

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'public',
                listing: true
            }
        }
    });

    server.start((err) => {

        if (err) {
            throw err;
        }

        console.log('Server running at:', server.info.uri);
    });
});
