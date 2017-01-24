var socket = io();

function searchFunc(stationQuery) {
  socket.emit('stations.search', stationQuery);
}

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
    stationQuery: '',
  },
  methods: {
    searchFunc,
  },
});

socket.on('stations.list', function (data) {
  console.log(data);
});

socket.on('stations.results', function (data) {
  console.log('resp -->>', data);
});
