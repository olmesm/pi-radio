'use strict';

const spawn = require('child_process').spawn;

let radioStream;
let startDelay;
let display = {};

const StreamerControl = {
  play,
  stop,
  setDisplayObject,
  emitPlayingStatus,
}

function setDisplayObject(emitter) {
  display.emitter = emitter;
  return display;
}

function play(station) {
  clearTimeout(startDelay);
  stop();

  startDelay = setTimeout(function() {
    debouncePlay(station);
  }, 300)
}

function debouncePlay(station) {
  display.station = station;
  radioStream = spawn('mplayer', [station.url]);
  let playStatusChange = true;

  radioStream.stdout.on('data', data => {
    display.playing = true;
    if (playStatusChange) { emitPlayingStatus(); }
    playStatusChange = false;
    console.log(`stdout: ${data}`);
  });

  radioStream.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  radioStream.on('close', (code) => {
    display.playing = false;
    display.station = '';
    emitPlayingStatus();
    console.log(`child process exited with code ${code}`);
  });
}

function emitPlayingStatus() {
  display.emitter('streamer.status', display);
}

function stop() {
  spawn('pkill', ['mplayer'])
}

module.exports = StreamerControl;
