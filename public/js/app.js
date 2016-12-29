var socket = io();

function add() {
  if (!piRadio.newStation.name && !piRadio.newStation.url) {
    return;
  }
  socket.emit('station.add', piRadio.newStation);
  piRadio.newStation = {};
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    newStation: {},
  },
  methods: {
    add,
  },
});

socket.on('stations.list', function (data) {
  piRadio.stationsList = data;
});

socket.on('connect', function () {
  console.log('Connected!');
});
