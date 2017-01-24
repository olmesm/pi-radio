'use strict';

const spawn = require('child_process').spawn;

let radioStream;
let startDelay;

function play(station) {
  clearTimeout(startDelay);
  stop();

  startDelay = setTimeout(function() {
    debouncePlay(station);
  }, 300)
}

function debouncePlay(station) {
  console.log('station.url>>>>>>>>>', station.url);

  radioStream = spawn('mplayer', [station.url]);

  radioStream.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  radioStream.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });
}

function stop() {
  spawn('pkill', ['mplayer'])
}

const StreamerControl = {
  play,
  stop,
}

module.exports = StreamerControl;
