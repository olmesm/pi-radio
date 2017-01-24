var socket = io();
var searchDebounce;

function clearSearch() {
  piRadio.stationsList = []
}

function searchFunc() {
  clearTimeout(searchDebounce);
  if (piRadio.stationQuery === '') { return clearSearch(); }

  searchDebounce = setTimeout(function() {
    socket.emit('stations.search', piRadio.stationQuery);
  }, 1000)
}

function displayMore() {
  socket.emit('stations.search.more', piRadio.stationQuery);
}

function playStation(station) {
  socket.emit('radio.play', station);
}

function stopStation() {
  socket.emit('radio.stop');
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    stationQuery: '',
  },
  methods: {
    searchFunc,
    displayMore,
    playStation,
    stopStation,
  },
});

socket.on('stations.list', function(data) {
  piRadio.stationsList = [];
});

socket.on('gettingStations', function(data) {
  console.log('gettingStations', data);
});

socket.on('streamer.status', function(data) {
  console.log('streamer.status', data)
});


socket.on('stations.results', function (data) {
  console.log('gettingStations', data);
  piRadio.stationsList = data;
});
