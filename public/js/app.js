var socket = io();

var piRadio = new Vue({
  el: '#pi-radio',
  data: {
    stationsList: [],
  },
});

socket.on('stations.list', function (data) {
  piRadio.stationsList = data;
});

socket.on('connect', function () {
  console.log('Connected!');
});
