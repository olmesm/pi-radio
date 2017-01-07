'use strict';
const spawn = require('child_process').spawn;
const pattern = /StreamTitle=\'[\s\S]*\';/;

const streamer = streamerStatusUpdate => {
  let self = this;

  self.radioStream;
  self.currentStation;
  self.currentSong;

  function stop() {
    self.currentStation = null;
    self.currentSong = null;
    self.radioStream.kill();
  }

  function play(url) {
    if (self.currentStation) { self.stop(); }

    self.currentStation = url;

    self.radioStream = spawn('mplayer', ['-playlist', url]);

    self.radioStream.stdout.on('data', data => {
      if (data.indexOf('StreamTitle') > -1) {
        let nowPlaying = pattern.exec(data)[0].replace('StreamTitle=\'', '');
        nowPlaying = nowPlaying.slice(0, nowPlaying.indexOf('\';'));
        self.currentSong = nowPlaying;
        streamerStatusUpdate({ nowPlaying: self.currentSong });
      }
      // console.log(`stdout: ${data}`); // <- Leave this in incase we need to fault find in future
    });

    self.radioStream.stderr.on('data', data => {
      console.log(`stderr: ${data}`);
    });

    self.radioStream.on('close', code => {
      if (self.currentStation && code === 1) { return; }
      console.log(`child process exited with code ${code}`);
      streamerStatusUpdate();
    });
  }

  self.play = play;
  self.stop = stop;

  return self;
};

module.exports = streamer;
