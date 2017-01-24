'use strict';

const Hapi = require('hapi');
const server = new Hapi.Server();

const config = require('config');
const streamer = require('./streamer-control');

let display = {};


server.connection({
  host: 'localhost',
  port: 8000,
});

const request = require('request');
const io = require('socket.io')(server.listener);

let stationList = [];
let gettingStations = false;

function isGettingStations(bool) {
  if (typeof bool === 'boolean') { gettingStations = bool };
  io.emit('gettingStations', gettingStations);

  return gettingStations;
}

function emitter(socket, message) {
  return io.emit(socket, message);
}

display.streamer = streamer.setDisplayObject(emitter);
// display.streamer.emitter = emitter;

function getStations() {
  isGettingStations(true);

  if (config.url.indexOf('http') > -1) {
    console.log('getting online')
    performOnlineRequest();
  } else {
    io.emit('performOnlineRequest', true);

    console.log('getting local');
    stationList = require(config.url);
    isGettingStations(false);
  }
}

function performOnlineRequest() {
  request.get({
    url: config.url,
    json: true,
    headers: { 'User-Agent': 'request' }
  }, (err, res, data) => {
    isGettingStations(false);
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
  return stationList.filter(station => station.name.toLowerCase().indexOf(query) > -1);
}

function handleClient(socket) {
  let stationsToDisplay;

  io.emit('stations.list', []);
  isGettingStations();

  socket.on('stations.search', query => {
    stationsToDisplay = 10;
    socket.emit('stations.results', findStation(query).slice(0, stationsToDisplay));
  });

  socket.on('stations.search.more', query => {
    stationsToDisplay += 10;
    socket.emit('stations.results', findStation(query).slice(0, stationsToDisplay));
  });

  socket.on('radio.play', station => {
    console.log('play', station.name);
    streamer.play(station);
  });

  socket.on('radio.stop', () => {
    console.log('stop!!');
    streamer.stop();
  });

  socket.on('disconnect', () => {
    io.emit('user disconnected');
  });
};

io.on('connection', handleClient);

getStations();

server.register(require('inert'), err => {
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

  server.start(err => {
    if (err) { throw err; }
    console.log('Server running at:', server.info.uri);
  });
});
