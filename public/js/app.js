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
  socket.emit('station.play', index)
}

function stopStation() {
  socket.emit('station.stop')
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
    remove,
    playStation,
    stopStation,
  },
});

socket.on('stations.list', function (data) {
  piRadio.stationsList = data;
});

socket.on('station.added', function (data) {
  piRadio.stationsList.push(data);
});

socket.on('station.removed', function (data) {
  piRadio.stationsList.splice(data);
});

socket.on('connect', function () {
  console.log('Connected!');
});
