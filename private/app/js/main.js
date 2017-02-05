const io = require('socket.io-client');
const config = require('./config.json');

const socket = io(config.localAddress);
let searchDebounce;

function clearSearch() {
  piRadio.stationsList = [];
  piRadio.spinner = false;
}

function cancelSearch() {
  piRadio.stationQuery = '';
  searchFunc();
}

function searchFunc() {
  clearTimeout(searchDebounce);
  piRadio.spinner = true;
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

function noResults() {
  return !this.spinner && this.stationQuery.length > 0 && this.stationsList.length === 0;
}

const piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    spinner: false,
    stationsFavourites: [],
    stationQuery: '',
    streamerStatus: {},
  },
  computed: {
    noResults,
  },
  methods: {
    searchFunc,
    displayMore,
    playStation,
    stopStation,
    addFavourite,
    removeFavourite,
    cancelSearch,
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
  piRadio.spinner = false;
});

socket.on('stations.favourites.list', data => {
  piRadio.stationsFavourites = data;
  console.log('piRadio.stationsFavourites', piRadio.stationsFavourites)
});

getFavourites();
