'use strict';

const spawn = require('child_process').spawn;
const pattern = /StreamTitle=\'[\s\S]*\';/;
const StreamerControl = {
  play,
  stop,
  setDisplayObject,
  emitPlayingStatus,
}

let radioStream;
let startDelay;
let display = {};

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
  let playStatusChange = true;
  let nowPlaying = '';

  display.station = station;
  radioStream = spawn('mplayer', [station.url]);

  radioStream.stdout.on('data', data => {
    display.playing = true;
    if (playStatusChange) { emitPlayingStatus(); }
      playStatusChange = false;

    if (data.indexOf('StreamTitle') > -1) {
      nowPlaying = pattern.exec(data)[0].replace('StreamTitle=\'', '');
      nowPlaying = nowPlaying.slice(0, nowPlaying.indexOf('\';'));
      if (nowPlaying !== display.nowPlaying) {
        display.nowPlaying = nowPlaying;
        emitPlayingStatus();
        console.log('display.nowPlaying', display.nowPlaying);
      }
    }
    // console.log(`radioStream > stdout: ${data}`);
  });

  radioStream.stderr.on('data', data => {
    console.log(`stderr: ${data}`);
  });

  radioStream.on('close', (code) => {
    display.playing = false;
    display.nowPlaying = '';
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
