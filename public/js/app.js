var socket = io();

function add() {
  if (!piRadio.newStation.name && !piRadio.newStation.url) {
    return;
  }
  socket.emit('station.add', piRadio.newStation);
  piRadio.newStation = {};
}

function remove(index) {
  socket.emit('station.remove', index);
}

function playStation(index) {
  piRadio.stationName = 'Loading...';
  socket.emit('station.play', index);
}

function stopStation() {
  piRadio.stationName = 'Stopping...';
  socket.emit('station.stop');
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
    stationName: 'Stopped',
    nowPlaying: '',
  },
  methods: {
    add,
    remove,
    playStation,
    stopStation,
  },
});

socket.on('streamer.statusUpdate', function (data) {
  if (!data) {
    piRadio.nowPlaying = '';
    piRadio.stationName = 'Stopped';
  } else {
    if (data.nowPlaying) { piRadio.nowPlaying = data.nowPlaying; }
    if (data.stationName) { piRadio.stationName = data.stationName; }
  }
});

socket.on('stations.list', function (data) {
  piRadio.stationsList = data;
});

socket.on('station.added', function (data) {
  piRadio.stationsList.push(data);
});

socket.on('station.removed', function (data) {
  piRadio.stationsList.splice(data, 1);
});

socket.on('connect', function () {
  console.log('Connected!');
});
