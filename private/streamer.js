'use strict';
const spawn = require('child_process').spawn;
let radioStream;

function play(url) {
  radioStream = spawn('mplayer', ['-playlist', url]);

  radioStream.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  radioStream.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  radioStream.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });
}

function stop() {
  radioStream.kill();
}

const streamer = {
  play,
  stop,
};

module.exports = streamer;
