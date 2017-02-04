const io = require('socket.io-client');
const config = require('./config.json');

const socket = io(config.localAddress);
let searchDebounce;

function clearSearch() {
  piRadio.stationsList = []
}

function searchFunc() {
  clearTimeout(searchDebounce);
  if (piRadio.stationQuery === '') { return clearSearch(); }

  searchDebounce = setTimeout(() => {
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

function addFavourite(station) {
  socket.emit('stations.favourites.add', station);
}

function removeFavourite(station) {
  socket.emit('stations.favourites.remove', station);
}

function getFavourites() {
  socket.emit('stations.favourites.list');
}

const piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    stationsFavourites: [],
    stationQuery: '',
    streamerStatus: {},
  },
  computed: {
  },
  methods: {
    searchFunc,
    displayMore,
    playStation,
    stopStation,
    addFavourite,
    removeFavourite,
  },
});

socket.on('stations.list', data => {
  piRadio.stationsList = [];
});

socket.on('gettingStations', data => {
  console.log('gettingStations', data);
});

socket.on('streamer.status', data => {
  console.log('streamer.status', data)
  piRadio.streamerStatus = data;
});

socket.on('stations.results', data => {
  console.log('gettingStations', data);
  piRadio.stationsList = data;
});

socket.on('stations.favourites.list', data => {
  piRadio.stationsFavourites = data;
  console.log('piRadio.stationsFavourites', piRadio.stationsFavourites)
});

getFavourites();
