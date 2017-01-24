'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();
const config = require('config');

server.connection({
    host: 'localhost',
    port: 8000,
});

const request = require('request');
let stationList = [];
const io = require('socket.io')(server.listener);

function getStations() {
  io.emit('stations.list', 'meh');

  if (config.url.indexOf('http') > -1) {
    console.log('getting online')
    performOnlineRequest();
  } else {
    console.log('getting local');
    stationList = require(config.url);
    console.log('local', stationList[1]);
    io.emit('stations.list', stationList[1]);
  }
}

function performOnlineRequest() {
  request.get({
    url: config.url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    if (err) {
      console.log('Error:', err);
    } else if (res.statusCode !== 200) {
      console.log('Status:', res.statusCode);
    } else {
      stationList = data;
    }
  });
}

function findStation(query) {
  return stationList.filter(station => station.name.toLowerCase().indexOf(query) > -1).slice(0, 10);
}

function handleClient(socket) {
  io.emit('stations.list', []);
  io.emit('stations.list', stationList.length);

  socket.on('stations.search', query => {
    socket.emit('stations.results', findStation(query));
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
};

io.on('connection', handleClient);

getStations();

server.register(require('inert'), (err) => {
  if (err) { throw err; }

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'public',
        listing: true,
      }
    }
  });

  server.start((err) => {
      if (err) { throw err; }
      console.log('Server running at:', server.info.uri);
  });
});
